#!/bin/bash
set -e

echo "Starting static build for GitHub Pages..."

# Clean and create dist directory
rm -rf dist
mkdir -p dist

# Copy templates and static assets
cp templates/index.html dist/index.html
cp -r static dist/static

# Replace Flask Jinja2 syntax with relative paths
echo "Replacing Jinja2 paths in index.html..."

# Replaces {{ url_for('static', filename='css/style.css') }} with ./static/css/style.css
sed -i 's/{{ *url_for('\''static'\'', *filename='\''css\/style\.css'\'' *) *}}/\.\/static\/css\/style\.css/g' dist/index.html

# Replaces {{ url_for('static', filename='js/script.js') }} with ./static/js/script.js
sed -i 's/{{ *url_for('\''static'\'', *filename='\''js\/script\.js'\'' *) *}}/\.\/static\/js\/script\.js/g' dist/index.html

echo "Build complete. Ready for deployment."
