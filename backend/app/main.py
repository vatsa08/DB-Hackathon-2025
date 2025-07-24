from fastapi import FastAPI, Request
from rag_pipeline import generate_response

app = FastAPI()

@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    query = body.get("query")
    profile = body.get("profile", {"industry": "general", "stage": "early"})
    response = generate_response(query, profile)
    return {"answer": response}
