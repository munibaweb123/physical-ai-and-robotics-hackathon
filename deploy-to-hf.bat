@echo off
REM Deployment script for Hugging Face Spaces (Windows)
REM This script copies only the necessary backend files to a deployment directory

setlocal enabledelayedexpansion

set DEPLOY_DIR=hf-backend-deploy

echo 🚀 Preparing backend for Hugging Face deployment...

REM Create deployment directory
if exist "%DEPLOY_DIR%" (
    echo 📁 Removing existing deployment directory...
    rmdir /s /q "%DEPLOY_DIR%"
)

mkdir "%DEPLOY_DIR%"
echo ✅ Created deployment directory: %DEPLOY_DIR%

REM Copy essential backend files
echo 📦 Copying backend files...

copy README.md "%DEPLOY_DIR%\" >nul 2>&1
copy Dockerfile "%DEPLOY_DIR%\" >nul 2>&1
copy huggingface_app.py "%DEPLOY_DIR%\" >nul 2>&1
copy main.py "%DEPLOY_DIR%\" >nul 2>&1
copy requirements.txt "%DEPLOY_DIR%\" >nul 2>&1
copy auth_utils.py "%DEPLOY_DIR%\" >nul 2>&1 || echo ⚠️  auth_utils.py not found (optional)

REM Copy .env.example if it exists
if exist ".env.example" (
    copy .env.example "%DEPLOY_DIR%\" >nul 2>&1
)

REM Copy services directory
if exist "services" (
    xcopy /E /I /Y services "%DEPLOY_DIR%\services" >nul 2>&1
    echo ✅ Copied services\ directory
) else (
    echo ⚠️  services\ directory not found
)

REM Copy .claude directory
if exist ".claude" (
    xcopy /E /I /Y .claude "%DEPLOY_DIR%\.claude" >nul 2>&1
    echo ✅ Copied .claude\ directory
) else (
    echo ⚠️  .claude\ directory not found
)

REM Create .gitignore
(
echo # Python
echo __pycache__/
echo *.py[cod]
echo *$py.class
echo *.so
echo .Python
echo env/
echo venv/
echo .venv/
echo.
echo # Environment
echo .env
echo .env.local
echo.
echo # IDE
echo .vscode/
echo .idea/
echo *.swp
echo *.swo
echo.
echo # OS
echo .DS_Store
echo Thumbs.db
) > "%DEPLOY_DIR%\.gitignore"

echo ✅ Created .gitignore

REM Create .hfignore
(
echo __pycache__/
echo *.pyc
echo *.pyo
echo *.pyd
echo .Python
echo .env
echo .venv
echo venv/
) > "%DEPLOY_DIR%\.hfignore"

echo ✅ Created .hfignore

REM Summary
echo.
echo ✨ Deployment preparation complete!
echo.
echo 📊 Files copied to: %DEPLOY_DIR%\
echo.
echo Next steps:
echo 1. cd %DEPLOY_DIR%
echo 2. git init
echo 3. git add .
echo 4. git commit -m "Initial backend deployment"
echo 5. git remote add origin https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME
echo 6. git push -u origin main
echo.
echo Don't forget to add your secrets in Hugging Face Space settings:
echo   - OPENAI_API_KEY
echo   - QDRANT_URL
echo   - QDRANT_API_KEY
echo   - AUTH_SERVER_URL
echo.

pause
