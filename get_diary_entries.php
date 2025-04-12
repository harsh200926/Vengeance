<?php
// Set headers for JSON response
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Path to the DiaryEntries directory
$directory = './DiaryEntries';

// Check if the directory exists
if (!is_dir($directory)) {
    echo json_encode(['error' => 'Directory not found']);
    exit;
}

// Get all .txt files from the directory - Use options that ensure all files are returned
$files = glob($directory . '/*.txt', GLOB_NOSORT);

// Format the filenames to just the basename (not the full path)
$fileNames = array_map('basename', $files);

// Sort files by name (which should sort by date since our naming convention is YYYY-MM-DD_HH-MM-SS.txt)
usort($fileNames, function($a, $b) {
    // Extract timestamps from filenames
    $dateA = strtotime(str_replace(['_', '-'], [' ', ':'], pathinfo($a, PATHINFO_FILENAME)));
    $dateB = strtotime(str_replace(['_', '-'], [' ', ':'], pathinfo($b, PATHINFO_FILENAME)));
    
    // Sort newer dates first (descending order)
    return $dateB - $dateA;
});

// Output the file list as JSON - no limit on how many files we return
echo json_encode($fileNames);
?> 