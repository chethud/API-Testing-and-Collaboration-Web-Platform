# API Testing and Collaboration Platform

Full-stack app for testing APIs, organizing requests, and collaborating in real time (Postman-like with collaboration, history, and AI assistance).

## Features

- **Auth**: Signup / Login / Logout with JWT (HttpOnly cookies)
- **API testing**: GET, POST, PUT, PATCH, DELETE with URL, headers, query params, body
- **Collections & workspaces**: Personal and team workspaces, collections of requests
- **Real-time collaboration**: WebSocket updates when requests are edited
- **History & versions**: Save history and revert to previous versions
- **AI assistant**: Natural language → suggested method, URL, headers, body
- **Analytics**: Success/failure rates, response times (24h)
- **Mock server**: Define mock endpoints per workspace
- **Notifications**: API failure and team update notifications
- **Comments**: Comments on requests with @mentions

## Tech stack

- **Frontend**: React 18, Vite 5, Tailwind CSS, React Router, Axios, Socket.IO client
- **Backend**: Python 3, Flask, Flask-SocketIO, Flask-CORS, PyJWT, bcrypt, SQLite, requests

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.8+ (for backend)

## Run locally

1. **Backend (Flask)**

   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate    # Windows
   # source venv/bin/activate   # macOS/Linux
   pip install -r requirements.txt
   python app.py
   ```

   Server: http://127.0.0.1:35421 (or set `PORT` in env). Data is stored in `backend/api-platform.sqlite`.

2. **Frontend**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   App: http://localhost:5173 (proxies `/api` and `/socket.io` to the backend)

3. **First use**

   - Open http://localhost:5173 → Sign up → you get a personal workspace
   - Create a request, set URL (e.g. `https://jsonplaceholder.typicode.com/posts/1`), click Send
   - Use **Mock server** in the sidebar to add mock endpoints; call them with URL like  
     `http://localhost:5173/api/mock/server/<workspaceId>/your-path`

## Scripts

- **Backend**: `python app.py` (Flask + SocketIO). Optional: `set PORT=4000` then `python app.py`
- **Frontend**: `npm run dev`, `npm run build`, `npm run preview`
