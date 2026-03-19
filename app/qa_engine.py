from langchain_ollama import OllamaLLM


def generate_answer(query, docs):

    context = "\n\n".join([doc.page_content for doc in docs])

    prompt = f"""
    Use the context below to answer the question.

    Context:
    {context}

    Question:
    {query}

    Answer:
    """

    llm = OllamaLLM(model="llama3")

    response = llm.invoke(prompt)

    return response