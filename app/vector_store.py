import os
from dotenv import load_dotenv
'''We import the load_dotenv function to load environment variables from a .env file'''
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
'''We import classes from Langchain to create vector embeddings and store them in a vector database'''

load_dotenv()
'''This line loads the environment variables from the .env file'''

def create_vector_store(chunks):
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = FAISS.from_texts(chunks, embeddings)
    return vector_store