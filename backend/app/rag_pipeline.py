from chromadb import Client
from chromadb.config import Settings
from vertexai.language_models import ChatModel
# from google.colab import auth
from vertexai import init

init(project="hack-team-net-runners", location="us-central1")

# Initialize Chroma
client = Client(Settings(persist_directory="chroma_db"))
collection = client.get_or_create_collection(name="biz_docs")

# Init Gemini model
chat_model = ChatModel.from_pretrained("gemini-1.5-flash-preview")  # or "gemini-1.5-pro-preview"
chat = chat_model.start_chat()

def retrieve_context(query):
    results = collection.query(query_texts=[query], n_results=3)
    return "\n".join(results['documents'][0]) if results['documents'] else ""

def generate_response(query, profile):
    context = retrieve_context(query)

    prompt = f"""
You are a business advisor specialized in Indian Retail.

User Profile:
{profile}

User Query:
{query}

Relevant Context:
{context}

Provide a short, actionable recommendation in simple terms.
"""
    response = chat.send_message(prompt)
    return response.text.strip()
