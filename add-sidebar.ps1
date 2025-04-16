$lawAreaPages = @(
    "html\criminal-appeals.html",
    "html\immigration.html",
    "html\criminal-law.html",
    "html\traffic-cases.html",
    "html\wills-probate.html",
    "html\arrest-search-seizure.html",
    "html\restraint-orders.html"
)

$sidebarHTML = @"
    <!--side nav bar-->
    <div id="mySidebar" class="sidebar">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">×</a>
        <nav class = "nav">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><div class="dropdown">
                    <button class="dropbtn">Our Practice Areas</button>
                    <div class="dropdown-content">
                        <a href="criminal-appeals.html">Criminal Appeals</a>
                        <a href="immigration.html">Immigration</a>
                        <a href="criminal-law.html">Criminal Law</a>
                        <a href="traffic-cases.html">Road Traffic Cases</a>
                        <a href="wills-probate.html">Wills And Probate</a>
                        <a href="arrest-search-seizure.html">Arrest, Search and Seizure of property</a>
                        <a href="restraint-orders.html">Challenging Restraint and Freezing Orders</a>
                    </div>
                  </div></li>
                <li><a href="aboutUs.html">About Us</a></li>
                <li><a href="contact.html">Get In Touch</a></li>
                <li><a href="Our-Locations.html">Our Locations</a></li>
            </ul>
        </nav>
      </div>
"@

foreach ($page in $lawAreaPages) {
    $content = Get-Content -Path $page -Raw
    
    # Check if the sidebar already exists
    if ($content -notmatch '<div id="mySidebar" class="sidebar">') {
        # Find the position to insert the sidebar (after the mobile overlay)
        $newContent = $content -replace '(<div id="mobileOverlay" class="mobile-overlay" onclick="closeNav\(\)"></div>)', "`$1`n$sidebarHTML"
        
        # Write the updated content back to the file
        Set-Content -Path $page -Value $newContent
        
        Write-Host "Added sidebar to $page"
    } else {
        Write-Host "Sidebar already exists in $page"
    }
}

Write-Host "All law area pages have been updated."
