#!/usr/bin/env python3
import os
import re
import glob

def update_creation_script(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if the file already has the updated paths
    if "json_dir = os.path.join" in content:
        print(f"File {file_path} already updated. Skipping.")
        return
    
    # Extract the subject from the filename
    filename = os.path.basename(file_path)
    parts = filename.split('_')
    subject = parts[1]
    
    # Determine if this is part1 or part2
    is_part2 = "part2" in filename
    json_filename = f"{subject}_news_podcast{'_part2' if is_part2 else ''}.json"
    
    # Find the position to insert the directory creation code
    # Usually right before the "Write the podcast to a JSON file" comment
    write_pattern = r"# Write the podcast to a JSON file"
    write_match = re.search(write_pattern, content)
    
    if write_match:
        insert_pos = content.rfind('\n', 0, write_match.start())
        
        # Directory creation code to insert
        dir_creation = '''
# Ensure the directory exists
json_dir = os.path.join("src", "data", "news_json_archive")
os.makedirs(json_dir, exist_ok=True)
'''
        updated_content = content[:insert_pos] + dir_creation + content[insert_pos:]
        
        # Replace the old file opening code
        old_pattern = r"with open\('?" + json_filename + r"'?, 'w'\) as f:"
        new_replacement = f"json_file = os.path.join(json_dir, \"{json_filename}\")\nwith open(json_file, 'w') as f:"
        updated_content = re.sub(old_pattern, new_replacement, updated_content)
        
        # Update the print statement
        old_print_pattern = r'print\("Created ' + json_filename + r'.*"\)'
        new_print = f'print(f"Created {{json_file}} with the {"second" if is_part2 else "first"} part of the {subject.capitalize()} News podcast")'
        updated_content = re.sub(old_print_pattern, new_print, updated_content)
        
        # Write the updated content back to the file
        with open(file_path, 'w') as f:
            f.write(updated_content)
        
        print(f"Updated {file_path}")
    else:
        print(f"Could not find insertion point in {file_path}. Skipping.")

def main():
    # Get all creation scripts
    script_dir = os.path.join("src", "scripts")
    creation_scripts = glob.glob(os.path.join(script_dir, "create_*_news_podcast*.py"))
    
    for script in creation_scripts:
        update_creation_script(script)
    
    print("All creation scripts updated successfully!")

if __name__ == "__main__":
    main() 