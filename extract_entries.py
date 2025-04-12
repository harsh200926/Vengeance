import os
import re
from datetime import datetime

def extract_entries(input_file, output_dir):
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split the content by date pattern
    # Looking for patterns like: 2024-06-20 21:39:47
    date_pattern = r'\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}'
    
    # Find all positions of date headers
    date_matches = list(re.finditer(date_pattern, content))
    
    # Process each entry
    for i in range(len(date_matches)):
        start_pos = date_matches[i].start()
        
        # Determine end position (either next date or end of file)
        if i < len(date_matches) - 1:
            end_pos = date_matches[i + 1].start()
        else:
            end_pos = len(content)
        
        # Extract the entry
        entry_text = content[start_pos:end_pos].strip()
        
        # Get the date
        date_str = date_matches[i].group()
        date_obj = datetime.strptime(date_str, '%Y-%m-%d %H:%M:%S')
        
        # Format the filename: YYYY-MM-DD_HH-MM-SS.txt
        filename = f"{date_obj.strftime('%Y-%m-%d_%H-%M-%S')}.txt"
        output_path = os.path.join(output_dir, filename)
        
        # Save the entry
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(entry_text)
        
        print(f"Created: {output_path}")

if __name__ == "__main__":
    input_file = "processed_journal.txt"
    output_dir = "DiaryEntries"
    
    # Ensure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Extract entries
    extract_entries(input_file, output_dir)
    print("Extraction complete!") 