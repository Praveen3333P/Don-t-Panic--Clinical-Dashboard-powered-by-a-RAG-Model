import pdfplumber
import os

# Use absolute path for reliability
pdf_path = r"D:\Clinical Futurism\laboratory-reference-ranges.pdf"

if os.path.exists(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        full_text = ""
        for page in pdf.pages:
            full_text += page.extract_text() + "\n"
        
        print("--- PDF CONTENT START ---")
        print(full_text[:2000] + "...") # Print first 2000 chars to understand structure
        print("--- PDF CONTENT END ---")
else:
    print(f"Error: {pdf_path} not found.")
