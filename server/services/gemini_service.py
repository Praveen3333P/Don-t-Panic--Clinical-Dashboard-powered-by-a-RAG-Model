from google import genai
import os
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image
import io
import pdfplumber
import requests

# Ensure we always find the .env file, even if we start the server from a different directory
_env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_env_path)

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError(f"GEMINI_API_KEY not found in environment (checked {_env_path})")
        self.client = genai.Client(api_key=api_key)
        self.model_id = "gemini-2.5-flash"

        # We're using OpenRouter alongside Gemini for interpretation, let's grab that key
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.openrouter_api_key:
            raise ValueError("OPENROUTER_API_KEY not found in environment")

    async def parse_lab_report(self, file_content: bytes, file_type: str):
        prompt = """
        You are a Clinical Data Extraction Engine. Extract all biomarkers, their values, and units from this lab report.
        Return ONLY a JSON list of objects: [{"name": "string", "value": number, "unit": "string"}].
        Exclude personal identifiable information (PII).
        If multiple columns exist, ensure values are matched correctly to biomarker names.
        """

        try:
            if file_type and "image" in file_type:
                img = Image.open(io.BytesIO(file_content))
                response = self.client.models.generate_content(
                    model=self.model_id,
                    contents=[prompt, img],
                    config={'response_mime_type': 'application/json'}
                )
            elif file_type and "pdf" in file_type:
                text = ""
                with pdfplumber.open(io.BytesIO(file_content)) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"

                if not text.strip():
                    raise ValueError("Could not extract text from PDF")

                response = self.client.models.generate_content(
                    model=self.model_id,
                    contents=f"{prompt}\n\nHere is the lab report text:\n{text}",
                    config={'response_mime_type': 'application/json'}
                )
            else:
                try:
                    img = Image.open(io.BytesIO(file_content))
                    response = self.client.models.generate_content(
                        model=self.model_id,
                        contents=[prompt, img],
                        config={'response_mime_type': 'application/json'}
                    )
                except Exception:
                    raise ValueError(f"Unsupported file type: {file_type}")

            return response.text
        except Exception as e:
            # If something goes wrong during extraction, we want to know exactly what happened
            print(f"Gemini parse error: {str(e)}")
            raise

    def call_openrouter(self, prompt: str):
        url = "https://openrouter.ai/api/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {self.openrouter_api_key}",
            "HTTP-Referer": "http://localhost:8000",
            "X-Title": "Clinical AI App"
        }

        data = {
            "model": "deepseek/deepseek-chat",
            "messages": [
                {"role": "user", "content": prompt + "\n\nReturn ONLY valid JSON. No explanations."}
            ],
            "temperature": 0
        }

        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()

        return response.json()["choices"][0]["message"]["content"]

    def interpret_results(self, biomarkers, clinical_context):
        prompt = f"""
        Role: Clinical Systems Architect & AI Safety Lead
        Persona: You are the 'Don't Panic' Clinical Interpreter. Your tone is that of a world-class physician who has seen it all and remains unfazed. You prioritize clarity over jargon and empathy over alarm.

        Task: Interpret these lab results using the provided clinical context (reference ranges and common fluctuations).
        
        Results: {biomarkers}
        Clinical Context (RAG): {clinical_context}

        Rules:
        1. Never lead with the number; lead with the context.
        2. Use 'Neutralization' language. Instead of 'Abnormal,' use 'Out of typical range.' Instead of 'Risk,' use 'Area for adjustment.'
        3. Always look for the 'Why' behind a deviation (e.g., hydration, stress, recent exercise).
        4. Every response must end with: 'This synthesis is for informational purposes. Your physician remains the primary authority on your health.'

        Output Format: Return JSON matching this structure:
        {{
          "patient_summary": "string",
          "results": [
            {{
              "id": "string",
              "name": "string",
              "value": number,
              "unit": "string",
              "status": "Green|Amber|Orange",
              "insight": "string",
              "zen_context": "string"
            }}
          ],
          "morning_routine_boost": "string"
        }}
        """

        try:
            response_text = self.call_openrouter(prompt)
            # We expect the output to be a plain JSON string, just like the prompt asks for
            return response_text
        except Exception as e:
            print(f"OpenRouter interpret error: {str(e)}")
            raise


gemini_service = GeminiService()