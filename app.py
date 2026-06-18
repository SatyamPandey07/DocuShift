import os
import uuid
import time
import io
import zipfile
import json
import xml.etree.ElementTree as ET
from flask import Flask, request, jsonify, render_template, send_from_directory
from werkzeug.utils import secure_filename
from pdf2docx import Converter
from PIL import Image
import fitz
import openpyxl
import pandas as pd
from pptx import Presentation
from pptx.util import Inches

# Monkey patch fitz.Pixmap.tobytes to handle CMYK/Indexed and other non-RGB/non-Gray color spaces
original_tobytes = fitz.Pixmap.tobytes

def patched_tobytes(self, *args, **kwargs):
    if self.colorspace and self.colorspace.name not in ('DeviceRGB', 'DeviceGray'):
        try:
            # Convert to RGB color space
            rgb_pixmap = fitz.Pixmap(fitz.csRGB, self)
            return original_tobytes(rgb_pixmap, *args, **kwargs)
        except Exception as e:
            print(f"[Monkey Patch] Failed to convert pixmap to RGB: {e}")
            
    return original_tobytes(self, *args, **kwargs)

fitz.Pixmap.tobytes = patched_tobytes


app = Flask(__name__, template_folder='templates', static_folder='static')

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
CONVERTED_FOLDER = os.path.join(os.path.dirname(__file__), 'converted')

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)

# Helper function to clean up old files (> 15 minutes old) in uploads and converted dirs
def cleanup_old_files():
    now = time.time()
    for folder in [UPLOAD_FOLDER, CONVERTED_FOLDER]:
        if not os.path.exists(folder):
            continue
        for filename in os.listdir(folder):
            file_path = os.path.join(folder, filename)
            try:
                if os.path.isfile(file_path) and os.stat(file_path).st_mtime < now - 900:
                    os.remove(file_path)
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")

@app.route('/')
def index():
    cleanup_old_files()
    return render_template('index.html')

@app.route('/download/<filename>')
def download_file(filename):
    filename = secure_filename(filename)
    return send_from_directory(CONVERTED_FOLDER, filename, as_attachment=True)

@app.after_request
def add_header(response):
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

# NOTE: Full app.py with all 14 conversion routes is in the repository.
# See the complete file for all routes: PDF->Word, PDF->PPTX, PDF->Excel,
# PDF->Images, PDF->Text, Images->PDF, Excel->PDF, JSON->PDF, Text->PDF,
# Compress PDF, Compress Image, XML<->JSON, XML->PDF, YAML->PDF
