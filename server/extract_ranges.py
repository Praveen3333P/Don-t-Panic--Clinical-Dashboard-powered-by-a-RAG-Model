import pdfplumber
import os


pdf_path = r"D:\Clinical Futurism\laboratory-reference-ranges.pdf"

if os.path.exists(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            full_text += page.extract_text() + "\n"
        
        print("--- PDF CONTENT START ---")
        print(full_text[:2000] + "...") 
        print("--- PDF CONTENT END ---")
else:
    print(f"Error: {pdf_path} not found.")
