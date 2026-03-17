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

## Deploy to Vercel (frontend)

1. Push your code to GitHub (e.g. [chethud/API-Testing-and-Collaboration-Web-Platform](https://github.com/chethud/API-Testing-and-Collaboration-Web-Platform)).
2. Go to [vercel.com](https://vercel.com) → **Add New** → **Project** → Import your repo.
3. Set **Root Directory** to `frontend` → **Edit** → enter `frontend` → Save.
4. (Optional) If you deployed the backend elsewhere (e.g. Render), add an **Environment Variable**:
   - **Name:** `VITE_API_URL`
   - **Value:** your backend URL, e.g. `https://your-app.onrender.com`
5. Click **Deploy**. The frontend will be live at `https://your-project.vercel.app`.

**Note:** Without a deployed backend, the app will load but login/API will fail. Deploy the Flask backend to [Render](https://render.com), [Railway](https://railway.app), or similar, then set `VITE_API_URL` in Vercel and allow your Vercel URL in the backend CORS settings.

## Scripts

- **Backend**: `python app.py` (Flask + SocketIO). Optional: `set PORT=4000` then `python app.py`
- **Frontend**: `npm run dev`, `npm run build`, `npm run preview`
