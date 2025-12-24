#!/bin/bash

# Deployment script for Hugging Face Spaces
# This script copies only the necessary backend files to a deployment directory

set -e  # Exit on error

DEPLOY_DIR="hf-backend-deploy"
CURRENT_DIR=$(pwd)

echo "🚀 Preparing backend for Hugging Face deployment..."

# Create deployment directory
if [ -d "$DEPLOY_DIR" ]; then
    echo "📁 Removing existing deployment directory..."
    rm -rf "$DEPLOY_DIR"
fi

mkdir -p "$DEPLOY_DIR"
echo "✅ Created deployment directory: $DEPLOY_DIR"

# Copy essential backend files
echo "📦 Copying backend files..."

# Root level files
cp README.md "$DEPLOY_DIR/"
cp Dockerfile "$DEPLOY_DIR/"
cp huggingface_app.py "$DEPLOY_DIR/"
cp main.py "$DEPLOY_DIR/"
cp requirements.txt "$DEPLOY_DIR/"
cp auth_utils.py "$DEPLOY_DIR/" 2>/dev/null || echo "⚠️  auth_utils.py not found (optional)"

# Copy .env.example if it exists
if [ -f ".env.example" ]; then
    cp .env.example "$DEPLOY_DIR/"
fi

# Copy services directory
if [ -d "services" ]; then
    cp -r services "$DEPLOY_DIR/"
    echo "✅ Copied services/ directory"
else
    echo "⚠️  services/ directory not found"
fi

# Copy .claude directory (for socratic_tutor.md)
if [ -d ".claude" ]; then
    cp -r .claude "$DEPLOY_DIR/"
    echo "✅ Copied .claude/ directory"
else
    echo "⚠️  .claude/ directory not found"
fi

# Create .gitignore for the deployment directory
cat > "$DEPLOY_DIR/.gitignore" << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF

echo "✅ Created .gitignore"

# Create .hfignore
cat > "$DEPLOY_DIR/.hfignore" << 'EOF'
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
.env
.venv
venv/
EOF

echo "✅ Created .hfignore"

# Summary
echo ""
echo "✨ Deployment preparation complete!"
echo ""
echo "📊 Files copied to: $DEPLOY_DIR/"
echo ""
echo "Next steps:"
echo "1. cd $DEPLOY_DIR"
echo "2. git init"
echo "3. git add ."
echo "4. git commit -m 'Initial backend deployment'"
echo "5. git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME"
echo "6. git push -u origin main"
echo ""
echo "Don't forget to add your secrets in Hugging Face Space settings:"
echo "  - OPENAI_API_KEY"
echo "  - QDRANT_URL"
echo "  - QDRANT_API_KEY"
echo "  - AUTH_SERVER_URL"
echo ""
