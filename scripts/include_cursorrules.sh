#!/bin/bash

# Check if .cursorrules exists
if [ ! -f .cursorrules ]; then
    echo "Error: .cursorrules file not found"
    exit 1
fi

# Copy the contents of .cursorrules to clipboard
if command -v xclip >/dev/null 2>&1; then
    cat .cursorrules | xclip -selection clipboard
    echo "Cursor rules copied to clipboard"
elif command -v pbcopy >/dev/null 2>&1; then
    cat .cursorrules | pbcopy
    echo "Cursor rules copied to clipboard"
else
    echo "Error: No clipboard tool found (xclip or pbcopy)"
    exit 1
fi 