"""
Vercel entrypoint: Flask app + static frontend.
All /api/* are handled by backend; everything else serves the React build from public/.
"""
import os
from flask import send_from_file, abort

from backend.app import app
from backend.db import init_db

init_db()

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "public")


@app.route("/")
def serve_index():
    return send_from_file(PUBLIC_DIR, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    if path.startswith("api/"):
        abort(404)
    file_path = os.path.join(PUBLIC_DIR, path)
    if os.path.isfile(file_path):
        return send_from_file(PUBLIC_DIR, path)
    return send_from_file(PUBLIC_DIR, "index.html")
