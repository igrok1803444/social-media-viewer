# Social Media Viewer

A full-stack web application to connect, view, and interact with Telegram chats and messages using a FastAPI backend and a React frontend.

---

## 🚀 Features

- 🔐 User registration & authentication
- 🤖 Connect Telegram account
- 💬 View Telegram chats and messages
- 📥 Load chat history
- 📤 Send messages (optional)

---

## 🛠 Tech Stack

- **Frontend:** React + Redux Toolkit + TypeScript
- **Backend:** FastAPI + Motor (MongoDB)
- **Telegram API:** Pyrogram

---

## ⚙️ Requirements

- Python 3.10+
- Node.js 16+
- MongoDB

---

## 📦 Installation & Setup

### 🔧 Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Create .env file in backend/
cp .env.example .env  # or create manually

# Run server
uvicorn main:app --reload
```

### 💻 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend (API) will be available at `http://localhost:8000`

---

## 🔐 Environment Variables

### `.env` for backend

```
MONGO_URL=mongodb://localhost:27017
DB_NAME=social-media-viewer
API_HASH=your_telegram_api_hash
API_ID=your_telegram_api_id
SECRET_KEY=your_secret_key
```

---

## 🧪 Optional: Build Frontend

```bash
npm run build
```

---
