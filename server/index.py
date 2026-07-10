"""
Web Nav - Flask API server
Serves nav data (YAML), Bing wallpaper proxy, and static frontend
"""
import json
import os
import sys
import yaml
import requests
from flask import Flask, request, jsonify, send_from_directory, Response

# --- Config ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, '..', 'config', 'app.json')
DATA_FILE = os.path.join(BASE_DIR, '..', 'data', 'nav.yaml')
DIST_DIR = os.path.join(BASE_DIR, '..', 'dist')

app_config = {'server': {'port': 3001}}
try:
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
            app_config = json.load(f)
except Exception as e:
    print(f'Failed to read config, using defaults: {e}', file=sys.stderr)

PORT = int(os.environ.get('PORT', app_config.get('server', {}).get('port', 3001)))

app = Flask(__name__, static_folder=None)

# --- Navigation API ---

@app.route('/api/nav', methods=['GET'])
def get_nav():
    """Read navigation data from YAML file"""
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        return jsonify(success=True, data=data)
    except Exception as e:
        print(f'Failed to read YAML: {e}', file=sys.stderr)
        return jsonify(success=False, error='Failed to read navigation data'), 500


@app.route('/api/nav', methods=['PUT'])
def put_nav():
    """Write navigation data to YAML file"""
    try:
        body = request.get_json()
        data = body.get('data') if body else None
        if not data or 'categories' not in data:
            return jsonify(success=False, error='Invalid data: missing categories'), 400
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            yaml.dump(data, f, allow_unicode=True, indent=2, default_flow_style=False, sort_keys=False)
        return jsonify(success=True)
    except Exception as e:
        print(f'Failed to write YAML: {e}', file=sys.stderr)
        return jsonify(success=False, error='Failed to save navigation data'), 500


# --- Background image proxy ---

BING_UA = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
)


@app.route('/api/background')
def get_background():
    """Proxy Bing wallpaper JSON API (bypasses CORS)"""
    idx = request.args.get('idx', '0')
    n = request.args.get('n', '8')
    headers = {'User-Agent': BING_UA}

    try:
        resp = requests.get(
            f'https://www.bing.com/HPImageArchive.aspx?format=js&idx={idx}&n={n}&mkt=zh-CN',
            headers=headers,
            timeout=10,
        )
        if resp.status_code == 200:
            json_data = resp.json()
            bing_host = 'https://www.bing.com'
        else:
            raise Exception(f'Status {resp.status_code}')
    except Exception:
        resp = requests.get(
            f'https://cn.bing.com/HPImageArchive.aspx?format=js&idx={idx}&n={n}',
            headers=headers,
            timeout=10,
        )
        resp.raise_for_status()
        json_data = resp.json()
        bing_host = 'https://cn.bing.com'

    images = [
        {
            'url': f"{bing_host}{img['url']}",
            'urlbase': f"{bing_host}{img['urlbase']}",
            'copyright': img.get('copyright', ''),
            'title': img.get('title', ''),
        }
        for img in json_data.get('images', [])
    ]
    return jsonify(success=True, images=images, host=bing_host)


@app.route('/api/background/image')
def proxy_image():
    """Proxy individual Bing wallpaper images (bypasses hotlinking protection)"""
    image_url = request.args.get('url', '')
    if not image_url:
        return jsonify(success=False, error='Missing url parameter'), 400

    try:
        resp = requests.get(
            image_url,
            headers={
                'User-Agent': BING_UA,
                'Referer': 'https://www.bing.com/',
            },
            timeout=30,
            stream=True,
        )
        resp.raise_for_status()

        content_type = resp.headers.get('content-type', 'image/jpeg')
        response_headers = {
            'Content-Type': content_type,
            'Cache-Control': 'public, max-age=86400',
        }

        def generate():
            for chunk in resp.iter_content(chunk_size=8192):
                yield chunk

        return Response(generate(), headers=response_headers)
    except Exception as e:
        print(f'Failed to proxy image: {e}', file=sys.stderr)
        return jsonify(success=False, error='Failed to proxy image'), 502


# --- Static files & SPA fallback ---

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """
    Serve static files from dist/.
    For non-file paths (SPA routes), return index.html.
    """
    if '..' in path:
        return '', 400

    file_path = os.path.join(DIST_DIR, path) if path else DIST_DIR
    if path and os.path.isfile(file_path):
        return send_from_directory(DIST_DIR, path)

    return send_from_directory(DIST_DIR, 'index.html')


# --- Entry point ---

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=False)
