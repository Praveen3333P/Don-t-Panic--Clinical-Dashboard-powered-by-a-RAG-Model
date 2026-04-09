import chromadb
from chromadb.utils import embedding_functions
import pdfplumber
import os
import re

class ClinicalRAG:
    def __init__(self, persist_directory="./chroma_db"):
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.client.get_or_create_collection(
            name="clinical_ranges",
            embedding_function=self.embedding_fn
        )

    def ingest_pdf(self, pdf_path):
        """Extracts text from PDF and populates the vector store."""
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF not found at {pdf_path}")

        print(f"Ingesting {pdf_path}...")
        with pdfplumber.open(pdf_path) as pdf:
            documents = []
            metadatas = []
            ids = []
            
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if not text:
                    continue
                
                # Split by lines to get specific marker data
                lines = text.split('\n')
                for j, line in enumerate(lines):
                    if len(line.strip()) < 10:
                        continue
                    
                    documents.append(line)
                    metadatas.append({"source": pdf_path, "page": i + 1})
                    ids.append(f"doc_{i}_{j}")

            if documents:
                self.collection.add(
                    documents=documents,
                    metadatas=metadatas,
                    ids=ids
                )
        print("Ingestion complete.")

    def query_marker(self, marker_name: str, n_results: int = 3):
        """Retrieves clinical context for a specific biomarker."""
        results = self.collection.query(
            query_texts=[marker_name],
            n_results=n_results
        )
        return results['documents'][0] if results['documents'] else []

# Global instance
rag_engine = ClinicalRAG()
