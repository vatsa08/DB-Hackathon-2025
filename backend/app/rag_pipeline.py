from chromadb import Client
from chromadb.config import Settings
from vertexai.language_models import ChatModel
# from google.colab import auth
from vertexai import init

init(project="flowing-design-466913-e5", location="us-central1")
from google import genai
from google.genai import types

from embedder import get_context
llm = genai.Client(
vertexai=True, project="flowing-design-466913-e5", location="global",
)
# If your image is stored in Google Cloud Storage, you can use the from_uri class method to create a Part object.
model = "gemini-2.5-flash-lite"


# Initialize Chroma
client = Client(Settings(persist_directory="chroma_db"))
collection = client.get_or_create_collection(name="biz_docs")

# Init Gemini model
chat_model = ChatModel.from_pretrained("gemini-1.0-pro")  # or "gemini-1.5-pro-preview"
chat = chat_model.start_chat()

def retrieve_context(query):
    results = collection.query(query_texts=[query], n_results=3)
    return "\n".join(results['documents'][0]) if results['documents'] else ""

def generate_response(business,query, profile):
    context = get_context(business)

    prompt = f"""
You are a business advisor specialized in Indian Retail.

User Profile:
{profile}

Business Context
{context}

User Query:
{query}

Provide a short, actionable recommendation in simple terms.
"""
    response = llm.models.generate_content(
    model=model,
    contents=[
    prompt
    ],
    )
    print(response.text, end="")
    return {"text":response.text.strip()}
