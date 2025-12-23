# PowerShell script to copy files to Hugging Face Space
# Run this after cloning your Hugging Face Space repository

# Define source and destination paths
$sourcePath = Get-Location
$destinationPath = Join-Path $sourcePath "hf_space_copy"  # Adjust this to your actual HF Space path

Write-Host "This script will copy all necessary files to your Hugging Face Space repository."
Write-Host "Current directory: $sourcePath"
Write-Host "Destination directory: $destinationPath"
Write-Host ""

# Check if destination exists
if (-not (Test-Path $destinationPath)) {
    Write-Host "Error: Destination path does not exist: $destinationPath" -ForegroundColor Red
    Write-Host "Please update the destination path in this script to your actual Hugging Face Space repository path." -ForegroundColor Red
    exit 1
}

# Files to copy for the backend
$filesToCopy = @(
    "Dockerfile",
    "requirements.txt",
    "app.py",
    "huggingface_app.py",
    "main.py",
    "services/",
    "agent/",
    ".env.example",  # if you have one
    "README.md"
)

Write-Host "Copying files to Hugging Face Space repository..." -ForegroundColor Green

foreach ($file in $filesToCopy) {
    $sourceFile = Join-Path $sourcePath $file
    $destFile = Join-Path $destinationPath $file

    if (Test-Path $sourceFile) {
        if (Get-Item $sourceFile -Force | Where-Object { $_.PSIsContainer }) {
            # It's a directory
            Copy-Item $sourceFile $destFile -Recurse -Force
            Write-Host "Copied directory: $file" -ForegroundColor Green
        } else {
            # It's a file
            Copy-Item $sourceFile $destFile -Force
            Write-Host "Copied file: $file" -ForegroundColor Green
        }
    } else {
        Write-Host "Warning: File/directory not found: $file" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "File copying completed!" -ForegroundColor Green
Write-Host "Now navigate to your Hugging Face Space directory and run:" -ForegroundColor Cyan
Write-Host "  cd hf_space_copy"  # Replace with actual path
Write-Host "  git add ."
Write-Host "  git commit -m 'Add physical AI book backend'"
Write-Host "  git push"