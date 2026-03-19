def search_docs(vector_db, query):
    results = vector_db.similarity_search(query, k =3)
    return results