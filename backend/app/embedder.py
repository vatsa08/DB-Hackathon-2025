import json

def get_context(user:str):

    with open("G://Hackathon/DB-Hackathon-2025/backend/app/data/business_data.json") as f:
        data = json.load(f)

#     documents = []
#     for business_id, info in data.items():
#         base_meta = {
#             "id": business_id,
#             "name": info["name"],
#             "type": info["type"],
#             "region": info["region"]
#         }

#         # Add top-level context document
#         documents.append(Document(
#             page_content=info["context"],
#             metadata={**base_meta, "level": "overview"}
#         ))

#         # Add monthly data as separate documents for fine-grained retrieval
#         monthly_data = info.get("monthlyData", {})
#         for year, months in monthly_data.items():
#             for month, stats in months.items():
#                 # Format monthly content
#                 summary = f"""
# {info['name']} - {month} {year}
# Revenue: ₹{stats['revenue']}
# Expenses: ₹{stats['expenses']}
# Profit: ₹{stats['profit']}
# Customer Segments: {', '.join([f"{k}: {v}%" for k, v in stats['customerSegments'].items()])}
# Notes: {stats['notes']}
# """
#                 documents.append(Document(
#                     page_content=summary.strip(),
#                     metadata={
#                         **base_meta,
#                         "year": year,
#                         "month": month,
#                         "level": "monthly"
#                     }
#                 ))

#     splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
#     split_docs = splitter.split_documents(documents)
#     # Fix for Pydantic error
#     VertexAIEmbeddings.model_rebuild()
    
#     embeddings = VertexAIEmbeddings()
#     vectordb = Chroma.from_documents(split_docs, embeddings, persist_directory="app/chroma_db")
    # print(f'data {data.get(user)}')
    return data.get(user)

if __name__ == "__main__":
    print(get_context('sarah'))
