Write-Host "Starting Development Environment..."
Write-Host "1. Auth Server (Port 7860)"
Write-Host "2. Chat Backend (Port 8000)"
Write-Host "3. Frontend (Port 3000)"

# Start Auth Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd auth-server; npm run dev"

# Start Chat Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "uvicorn main:app --reload --port 8000"

# Start Frontend (Delayed slightly to let backends start)
Start-Sleep -Seconds 5
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd physical-ai-docs; npm start"

Write-Host "All services started in new windows."
