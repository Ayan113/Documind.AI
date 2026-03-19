from pdf_loader import load_pdf
from text_chunker import chunk_text

file_path = "data/ml.pdf"
text = load_pdf(file_path)
chunks = chunk_text(text)

print("Total chunks:", len(chunks))
print("First chunk:\n")
print(chunks[0])