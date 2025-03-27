#!/bin/bash

# Script to set up OpenAI API key for the podcast generator

echo "OpenAI TTS Setup Script"
echo "======================="
echo ""
echo "This script will help you set up your OpenAI API key for the podcast generator."
echo ""

# Check if .env file exists
if [ -f .env ]; then
    echo "Found existing .env file."
    # Check if OPENAI_API_KEY is already in .env
    if grep -q "OPENAI_API_KEY" .env; then
        echo "OpenAI API key is already set in .env file."
        echo "Current value:"
        grep "OPENAI_API_KEY" .env
        echo ""
        read -p "Do you want to update it? (y/n): " update_key
        if [ "$update_key" != "y" ]; then
            echo "Keeping existing API key."
            exit 0
        fi
    fi
else
    echo "Creating new .env file."
    touch .env
fi

# Prompt for API key
echo ""
echo "Please enter your OpenAI API key."
echo "You can find this in your OpenAI account dashboard at: https://platform.openai.com/api-keys"
echo ""
read -p "OpenAI API Key: " api_key

# Validate API key format (basic check)
if [[ ! $api_key =~ ^sk-[A-Za-z0-9]{32,} ]]; then
    echo "Warning: The API key format doesn't look right. OpenAI API keys typically start with 'sk-' followed by a long string."
    read -p "Do you want to continue anyway? (y/n): " continue_anyway
    if [ "$continue_anyway" != "y" ]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Update or add the API key to .env
if grep -q "OPENAI_API_KEY" .env; then
    # Replace existing key
    sed -i "s/OPENAI_API_KEY=.*/OPENAI_API_KEY=$api_key/" .env
else
    # Add new key
    echo "OPENAI_API_KEY=$api_key" >> .env
fi

echo ""
echo "OpenAI API key has been set in .env file."
echo "You can now run the podcast generator with:"
echo "source venv/bin/activate && python generate_math_podcast_openai.py"
echo ""
echo "Setup complete!" 