from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import os
import json
import re

from . import models, database, auth_utils
from .database import engine, get_db
from .services.rag_engine import rag_engine
from .services.gemini_service import gemini_service
from .services.safety_service import scoring_service, watchdog


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Don't Panic Clinical API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "Zen Neutral", "neural_core": "Staged (98.4%)"}

# The shapes for the authentication data that comes in from the React portal
class AuthRequest(BaseModel):
    email: str
    password: str

# Endpoints handling user registration and token generation

@app.post("/api/auth/signup")
def signup(auth: AuthRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == auth.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pass = auth_utils.get_password_hash(auth.password)
    new_user = models.User(email=auth.email, hashed_password=hashed_pass)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Neural Profile Created", "email": new_user.email}

@app.post("/api/auth/token")
def login(auth: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == auth.email).first()
    if not user or not auth_utils.verify_password(auth.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect clinical credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth_utils.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
def get_me(db: Session = Depends(get_db), token_data: dict = Depends(auth_utils.decode_access_token)):
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(models.User).filter(models.User.email == token_data["sub"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    return {"email": user.email}

# A handy dependency to grab the currently logged-in user from the JWT

def get_current_user(db: Session = Depends(get_db), token: str = Depends(auth_utils.decode_access_token)):
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate clinical credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(models.User).filter(models.User.email == token.get("sub")).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# The core feature endpoints where the actual clinical processing happens

@app.post("/api/neutralize")
async def neutralize_lab(
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Kicks off the main process. We read the uploaded file, ask Gemini to parse it, 
    pull relevant clinical context from our local RAG database, and finally 
    have Gemini interpret everything in a calm, informative tone.
    """
    content = await file.read()
    
    # Step 1: Figure out what's in the uploaded document
    print(f"Beginning synthesis for user: {current_user.email}")
    try:
        raw_results_json = await gemini_service.parse_lab_report(content, file.content_type)
        print(f"Raw Gemini Output: {raw_results_json}")
        
        
        # Sometimes the AI wraps its json response in markdown blocks, let's pull just the array out
        json_match = re.search(r'\[.*\]', raw_results_json, re.DOTALL)
        if json_match:
            biomarkers = json.loads(json_match.group())
        else:
            biomarkers = json.loads(raw_results_json)
    except Exception as e:
        print(f"Parsing error: {str(e)}")
        
        # If it chokes on JSON parsing, it's helpful to see what string it was actually trying to parse
        if "JSON" in str(e):
             print(f"Failed to parse JSON. Raw output was: {raw_results_json}")
        raise HTTPException(status_code=422, detail=f"Neural synthesis failed: {str(e)}")

    
    # Step 2: Grab extra medical context from our local database for each marker found
    enriched_results = []
    clinical_context = ""
    
    for marker in biomarkers:
        context = rag_engine.query_marker(marker['name'])
        clinical_context += f"\n{context}"
        enriched_results.append({
            **marker,
            "context_found": len(context) > 0
        })

    # Step 3: Pass everything to Gemini to get a patient-friendly summary based on the context
    interpretation_json = gemini_service.interpret_results(biomarkers, clinical_context)
    
    try:
        final_response = json.loads(re.search(r'\{.*\}', interpretation_json, re.DOTALL).group())
    except:
        raise HTTPException(status_code=500, detail="Neural Core synthesis failed.")

    final_response["patient_summary"] = watchdog.sanitize_output(final_response["patient_summary"])
    for result in final_response["results"]:
        result["insight"] = watchdog.sanitize_output(result["insight"])
        result["zen_context"] = watchdog.sanitize_output(result["zen_context"])

    return final_response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
