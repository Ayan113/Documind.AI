from langchain_text_splitters import RecursiveCharacterTextSplitter
'''We import a class from library Langchain to split the text into chunks'''

def chunk_text(text):
    """this function breaks larget text into smaller chunks to make it easier to process and analyze"""
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(text)
    return chunks