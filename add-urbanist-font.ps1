$htmlFiles = Get-ChildItem -Path "html" -Filter "*.html"

$fontLinks = @"
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
"@

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if the file already has the Urbanist font
    if (-not $content.Contains("fonts.googleapis.com/css2?family=Urbanist")) {
        # Add the font links before the closing head tag
        $updatedContent = $content -replace '(</head>)', "$fontLinks`n`$1"
        
        # Write the updated content back to the file
        Set-Content -Path $file.FullName -Value $updatedContent
        
        Write-Host "Added Urbanist font to $($file.Name)"
    } else {
        Write-Host "$($file.Name) already has the Urbanist font"
    }
}

Write-Host "All HTML files have been updated."
