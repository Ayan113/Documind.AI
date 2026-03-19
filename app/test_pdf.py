from pdf_loader import load_pdf
file_path = "data/ml.pdf"
text = load_pdf(file_path)
print(text[:500])
