from pdf_loader import load_pdf
from text_chunker import chunk_text
from vector_store import create_vector_store
from search_engine import search_docs
from qa_engine import generate_answer


file_path = "data/ml.pdf"

text = load_pdf(file_path)

chunks = chunk_text(text)

vector_db = create_vector_store(chunks)


query = "Explain machine learning"

docs = search_docs(vector_db, query)

answer = generate_answer(query, docs)

print("\nAI Answer:\n")
print(answer)