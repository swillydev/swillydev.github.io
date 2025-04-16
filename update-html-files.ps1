$htmlFiles = Get-ChildItem -Path "html" -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if the file already has the phone-number-formatter.js script
    if (-not $content.Contains("/js/phone-number-formatter.js")) {
        # Add the script after scroll-animations.js
        $updatedContent = $content -replace '(<script src="/js/scroll-animations.js"></script>)', '$1
    <script src="/js/phone-number-formatter.js"></script>'
        
        # Write the updated content back to the file
        Set-Content -Path $file.FullName -Value $updatedContent
        
        Write-Host "Updated $($file.Name)"
    } else {
        Write-Host "$($file.Name) already has the script"
    }
}

Write-Host "All HTML files have been updated."
