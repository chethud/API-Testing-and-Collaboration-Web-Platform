"""
Vercel entrypoint: Flask app + static frontend.
All /api/* are handled by backend; everything else serves the React build from public/.
"""
import os
import sys
import traceback

# Ensure project root is on path (Vercel serverless does not add it)
_root = os.path.dirname(os.path.abspath(__file__))
if _root not in sys.path:
    sys.path.insert(0, _root)

from flask import Flask, send_from_directory, abort, Response

_import_error = None
app = None
try:
    from backend.app import app as _backend_app
    from backend.db import init_db
    init_db()
    app = _backend_app
except Exception:
    _import_error = traceback.format_exc()
    app = Flask(__name__)

PUBLIC_DIR = os.path.join(os.path.dirname(__file__), "public")


@app.before_request
def _check_import_error():
    if _import_error is not None:
        return Response(_import_error, status=500, mimetype="text/plain")
    return None


@app.route("/")
def serve_index():
    return send_from_directory(PUBLIC_DIR, "index.html")


@app.route("/<path:path>")
def serve_static(path):
    if path.startswith("api/"):
        abort(404)
    file_path = os.path.join(PUBLIC_DIR, path)
    if os.path.isfile(file_path):
        return send_from_directory(PUBLIC_DIR, path)
    return send_from_directory(PUBLIC_DIR, "index.html")
