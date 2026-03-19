from pdf_loader import load_pdf
from text_chunker import chunk_text
from vector_store import create_vector_store

file_path = "data/ml.pdf"
text = load_pdf(file_path)
chunks = chunk_text(text)
vector_db = create_vector_store(chunks)
print("vector store created successfully")
