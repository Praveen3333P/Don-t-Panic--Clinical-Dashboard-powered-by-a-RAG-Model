import os
import sys

# Add the current directory to path so we can import our services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.rag_engine import rag_engine

PDF_PATH = r"D:\Clinical Futurism\laboratory-reference-ranges.pdf"

if __name__ == "__main__":
    try:
        if not os.path.exists(PDF_PATH):
            print(f"Error: PDF not found at {PDF_PATH}")
            sys.exit(1)
            
        print("Starting Knowledge Ingestion protocol...")
        rag_engine.ingest_pdf(PDF_PATH)
        print("Success: Clinical Knowledge Base initialized.")
        
        # Test Query
        test_result = rag_engine.query_marker("ALT")
        print(f"Test Retrieval [ALT]: {test_result}")
        
    except Exception as e:
        print(f"Ingestion Failed: {str(e)}")
        sys.exit(1)
