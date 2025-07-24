# DB-Hackathon-2025c

npm create vite@latest frontend --template react
cd frontend
npm install
npm run start

gcloud auth login shaarayu28@gmail.com
gcloud auth application-default login
gcloud config set project flowing-design-466913-e5

cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r .\requirements.txt
cd .\backend\app
uvicorn main:app --reload