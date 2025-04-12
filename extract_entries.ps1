$content = Get-Content -Path "2025-03-14_15-45.txt" -Raw
$entries = $content -split "(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\n-------------------" | Where-Object { $_ -ne "" }

$dateRegex = "(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})"
$dates = [System.Collections.ArrayList]::new()

# Process entries in pairs (date + content)
for ($i = 0; $i -lt $entries.Count; $i++) {
    if ($entries[$i] -match $dateRegex) {
        $entryDate = $matches[1]
        $dateFormatted = $entryDate.Replace(":", "-").Replace(" ", "_")
        [void]$dates.Add($dateFormatted)
        
        # Get the next entry which is the content
        if ($i + 1 -lt $entries.Count) {
            $entryContent = $entryDate + "`n-------------------" + $entries[$i + 1]
            
            # Create the file path
            $filePath = "DiaryEntries\$dateFormatted.txt"
            
            # Write the content to the file
            $entryContent | Out-File -FilePath $filePath -Encoding utf8
            
            Write-Host "Created entry: $filePath"
            
            # Skip the next entry since we've already processed it
            $i++
        }
    }
}

Write-Host "Total entries extracted: $($dates.Count)" 