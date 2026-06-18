# DocuShift — Unified File Converter Suite

DocuShift is a **privacy-first, local-first** file conversion and compression suite built with **Python Flask**. All processing happens entirely on your machine — your files never leave your computer.

## ✨ Features

| Category | Tools |
|---|---|
| **PDF Tools** | PDF → Word (.docx), PDF → PowerPoint (.pptx), PDF → Excel (.xlsx), PDF → Images (.zip), PDF → Text (.txt), PDF Compressor |
| **Image Tools** | Images → PDF, Image Compressor |
| **Developer Tools** | JSON → PDF, XML → PDF, YAML → PDF, Text → PDF, XML ⇄ JSON Converter |

## 🚀 Getting Started

### Prerequisites
- Python 3.8+

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/SatyamPandey07/pdf-to-doc-converter.git
cd pdf-to-doc-converter

# Run the boot script (auto-creates venv and installs dependencies)
chmod +x run.sh
./run.sh
```

Then open your browser at: **http://localhost:5001**

### Manual Setup (Optional)
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 app.py
```

## 📦 Tech Stack

- **Backend**: Python, Flask
- **PDF Processing**: PyMuPDF (fitz), pdf2docx
- **Office Formats**: python-pptx, openpyxl, pandas
- **Image Processing**: Pillow
- **Frontend**: Vanilla HTML, CSS, JavaScript (glassmorphism UI with dark/light theme)

## 🎨 UI Highlights

- Glassmorphism dark/light theme toggle
- Animated drag-and-drop file upload zones
- Real-time conversion progress overlay
- Sidebar navigation with 13+ tools

## 📄 License

MIT License — Developed by **Satyam Pandey**
