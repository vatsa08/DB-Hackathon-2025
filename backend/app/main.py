from fastapi import FastAPI, Request
from rag_pipeline import generate_response

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
# Allow all origins, methods, headers (for development only)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],  # ← This is crucial to allow OPTIONS
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    query = body.get("query")
    scenario = body.get("business")
    profile = body.get("profile", {"industry": "general", "stage": "early"})
    response = generate_response(scenario,query, profile)
    return {"answer": response}
