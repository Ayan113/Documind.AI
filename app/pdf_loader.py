from pypdf import PdfReader 
'''We import a class from library PyPDF to read the pdf file and extract the text from it'''

def load_pdf(file_path):
    '''This function loads the pdf file and extracts the text from it'''
    
    reader = PdfReader(file_path)
    text = ""
    
    for page in reader.pages:
        page_text = page.extract_text()
        text += page_text
    return text