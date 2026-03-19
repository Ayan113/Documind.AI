from pdf_loader import load_pdf
from text_chunker import chunk_text
from vector_store import create_vector_store
from search_engine import search_docs

file_path = "data/ml.pdf"
text = load_pdf(file_path)
chunks = chunk_text(text)
vector_db = create_vector_store(chunks)

query = "What is machine learning?"
results = search_docs(vector_db, query)

for i, doc in enumerate(results):
    print(f"\nResult {i+1}:\n")
    print(doc.page_content[:300])