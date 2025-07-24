from chromadb import Client
from chromadb.config import Settings
import json

def create_embeddings():
    client = Client(Settings(persist_directory="chroma_db"))
    collection = client.get_or_create_collection(name="biz_docs")

    with open("./app/data/business_data.json", "r") as f:
        docs = json.load(f)
    print("Adding data in DB")
    for i, doc in enumerate(docs):
        metadata = {"title": doc["title"]}
        collection.add(
            documents=[doc["content"]],
            metadatas=[metadata],
            ids=[f"doc_{i}"]
        )

if __name__ == "__main__":
    create_embeddings()
