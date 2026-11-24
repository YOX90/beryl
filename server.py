"""
Beryl Syndicate - Custom Full-Stack HTTP Server & JSON Storage API
Serves static frontend assets and provides persistent REST endpoints for the Admin Dashboard.
"""

import http.server
import socketserver
import json
import os
import sys
import base64
import time

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
DATA_JSON = os.path.join(DIRECTORY, "data.json")
DATA_JS = os.path.join(DIRECTORY, "data.js")
UPLOADS_DIR = os.path.join(DIRECTORY, "assets", "uploads")
ADMIN_PASSWORD = "0uqisdhc"

os.makedirs(UPLOADS_DIR, exist_ok=True)

class BerylHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def _send_json(self, status, payload):
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(payload, ensure_ascii=False).encode("utf-8"))

    def do_GET(self):
        # API: Get Current Data
        if self.path == "/api/data" or self.path.startswith("/api/data?"):
            if os.path.exists(DATA_JSON):
                with open(DATA_JSON, "r", encoding="utf-8") as f:
                    data = json.load(f)
                return self._send_json(200, data)
            else:
                return self._send_json(404, {"error": "data.json not found"})

        # Strip query string for file resolution
        clean_path = self.path.split("?")[0].split("#")[0]

        # Serve real static assets directly (js, css, images, audio, etc.)
        static_exts = (
            '.js', '.css', '.png', '.jpg', '.jpeg', '.webp', '.svg',
            '.ico', '.mp3', '.m4a', '.aac', '.json', '.woff', '.woff2', '.ttf'
        )
        if any(clean_path.endswith(ext) for ext in static_exts):
            return super().do_GET()

        # SPA fallback — serve index.html for all non-file routes
        # (e.g. /home, /beryl, /keyrainahee)
        index_path = os.path.join(DIRECTORY, "index.html")
        if os.path.exists(index_path):
            with open(index_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        content_len = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else ""

        # API: Admin Login
        if self.path == "/api/login":
            try:
                req = json.loads(body)
                pwd = req.get("password", "")
                if pwd == ADMIN_PASSWORD:
                    return self._send_json(200, {
                        "success": True, 
                        "token": "beryl-admin-token-" + str(int(time.time())),
                        "message": "เข้าสู่ระบบสำเร็จ"
                    })
                else:
                    return self._send_json(401, {"success": False, "error": "รหัสผ่านไม่ถูกต้อง"})
            except Exception as e:
                return self._send_json(400, {"error": str(e)})

        # API: Save Full Data
        if self.path == "/api/data":
            try:
                new_data = json.loads(body)
                # Recalculate totals
                for k, gang in new_data.items():
                    f_len = len(gang.get("founders", []))
                    l_len = len(gang.get("leaders", []))
                    m_len = len(gang.get("members", []))
                    gang["total"] = m_len

                # Save to data.json
                with open(DATA_JSON, "w", encoding="utf-8") as f:
                    json.dump(new_data, f, ensure_ascii=False, indent=2)

                # Sync to data.js for offline fallback
                with open(DATA_JS, "w", encoding="utf-8") as f:
                    f.write("window.GANGS_DATA = " + json.dumps(new_data, ensure_ascii=False, indent=2) + ";\n")

                return self._send_json(200, {"success": True, "message": "บันทึกข้อมูลเรียบร้อยแล้ว"})
            except Exception as e:
                return self._send_json(500, {"error": f"Failed to save data: {e}"})

        # API: Base64 Image Upload
        if self.path == "/api/upload":
            try:
                req = json.loads(body)
                b64_data = req.get("image", "")
                filename = req.get("filename", f"avatar_{int(time.time())}.png")

                if "," in b64_data:
                    b64_data = b64_data.split(",", 1)[1]

                img_bytes = base64.b64decode(b64_data)
                clean_name = "".join(c for c in filename if c.isalnum() or c in "._-")
                if not clean_name:
                    clean_name = f"upload_{int(time.time())}.png"
                out_path = os.path.join(UPLOADS_DIR, clean_name)

                with open(out_path, "wb") as f:
                    f.write(img_bytes)

                return self._send_json(200, {
                    "success": True,
                    "url": f"assets/uploads/{clean_name}"
                })
            except Exception as e:
                return self._send_json(500, {"error": f"Upload failed: {e}"})

        # Default 404
        self._send_json(404, {"error": "Endpoint not found"})

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = False

def run_server():
    os.chdir(DIRECTORY)
    
    # MIME Types extension
    BerylHandler.extensions_map.update({
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
        '.css': 'text/css',
        '.mp3': 'audio/mpeg',
        '.m4a': 'audio/mp4',
        '.aac': 'audio/aac',
        '.webp': 'image/webp',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.json': 'application/json',
    })

    with ThreadedHTTPServer(("", PORT), BerylHandler) as httpd:
        print(f"Beryl Multi-Threaded API Server running at http://localhost:{PORT}/")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    run_server()
