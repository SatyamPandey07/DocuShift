import os
import shutil
import re

def build_pages():
    print("Starting static build for GitHub Pages...")
    
    # Define directories
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    dist_dir = os.path.join(base_dir, "dist")
    templates_dir = os.path.join(base_dir, "templates")
    static_dir = os.path.join(base_dir, "static")
    
    # Clean and create dist directory
    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)
    os.makedirs(dist_dir, exist_ok=True)
    
    # Copy templates/index.html to dist/index.html
    src_html = os.path.join(templates_dir, "index.html")
    dest_html = os.path.join(dist_dir, "index.html")
    shutil.copy2(src_html, dest_html)
    
    # Copy static folder to dist/static
    dest_static = os.path.join(dist_dir, "static")
    shutil.copytree(static_dir, dest_static)
    
    # Read index.html and replace Flask Jinja2 syntax with relative paths
    print("Replacing Jinja2 paths in index.html...")
    with open(dest_html, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Replace {{ url_for('static', filename='...') }} with ./static/...
    # Support both single and double quotes
    updated_content = re.sub(
        r"\{\{\s*url_for\(\s*['\"]static['\"]\s*,\s*filename\s*=\s*['\"]([^'\"]+)['\"]\s*\)\s*\}\}",
        r"./static/\1",
        content
    )
    
    with open(dest_html, "w", encoding="utf-8") as f:
        f.write(updated_content)
        
    print("Build complete. Ready for deployment.")

if __name__ == "__main__":
    build_pages()
