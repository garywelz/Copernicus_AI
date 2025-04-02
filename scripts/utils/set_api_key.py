import sys
import re

def set_api_key(api_key):
    # Read the generate_thumbnails.py file
    with open('generate_thumbnails.py', 'r') as file:
        content = file.read()
    
    # Replace the placeholder API key with the actual key
    updated_content = re.sub(
        r'api_key="[^"]*"',  # Match api_key="anything"
        f'api_key="{api_key}"',  # Replace with the new API key
        content
    )
    
    # Write the updated content back to the file
    with open('generate_thumbnails.py', 'w') as file:
        file.write(updated_content)
    
    print(f"API key has been set in generate_thumbnails.py")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python set_api_key.py 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")
        sys.exit(1)
    
    api_key = sys.argv[1]
    set_api_key(api_key) 