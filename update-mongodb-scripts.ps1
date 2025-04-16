$htmlFiles = Get-ChildItem -Path "html" -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if the file has the mailhog-form-handler.js script
    if ($content.Contains("/js/mailhog-form-handler.js")) {
        # Replace mailhog-form-handler.js with our new scripts
        $updatedContent = $content -replace '<!-- Mailhog Form Handler -->\s*<script src="/js/mailhog-form-handler.js"></script>', '<!-- Toast Notifications -->
    <script src="/js/toast-notification.js"></script>
    <!-- Form Handler for MongoDB -->
    <script src="/js/form-handler.js"></script>'
        
        # Write the updated content back to the file
        Set-Content -Path $file.FullName -Value $updatedContent
        
        Write-Host "Updated $($file.Name)"
    } 
    # Check for index-form-handler.js
    elseif ($content.Contains("index-form-handler.js")) {
        # Replace index-form-handler.js with our new scripts
        $updatedContent = $content -replace '<!-- Index Form Handler for Mailhog -->\s*<script src="../js/index-form-handler.js"></script>', '<!-- Toast Notifications -->
    <script src="../js/toast-notification.js"></script>
    <!-- Form Handler for MongoDB -->
    <script src="../js/form-handler.js"></script>'
        
        # Write the updated content back to the file
        Set-Content -Path $file.FullName -Value $updatedContent
        
        Write-Host "Updated $($file.Name)"
    }
    else {
        Write-Host "$($file.Name) doesn't have form handler scripts"
    }
}

Write-Host "All HTML files have been updated."
