$content = Get-Content "physical-ai-docs/docs/01-foundations/01-era-of-physical-ai.md" -Raw

# Escape double quotes for JSON
$escapedContent = $content -replace '"', '""' -replace "`r`n", "`n" -replace "`n", "`n"

# Construct the JSON body
$jsonBody = @{
    raw_text = $content
    chapter_title = "The Era of Physical AI"
    page_numbers = "1-5"
} | ConvertTo-Json

# Send the POST request
Invoke-RestMethod -Uri "http://localhost:8000/ingest" -Method Post -ContentType "application/json" -Body $jsonBody
