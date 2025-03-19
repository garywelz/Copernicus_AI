#!/bin/bash

# Script to prepare the Copernicus repository for GitHub and Vercel deployment

echo "Preparing Copernicus repository for GitHub and Vercel deployment..."
echo "=================================================================="

# Ensure .gitignore is up to date
if [ ! -f .gitignore ]; then
    echo "Error: .gitignore file not found!"
    exit 1
fi

# Check if the remote exists
if ! git remote | grep -q "origin"; then
    echo "Error: No 'origin' remote found. Setting up remote..."
    git remote add origin https://github.com/garywelz/copernicus.git
fi

# Create a list of files to be included in the commit
echo "Creating a list of files to be included in the commit..."

# Add essential Next.js files
for file in package.json package-lock.json pnpm-lock.yaml next.config.js tsconfig.json tailwind.config.js next-env.d.ts .npmrc .vercelignore; do
    if [ -f "$file" ]; then
        git add "$file"
        echo "Added $file"
    else
        echo "Warning: $file not found, skipping"
    fi
done

# Add directories if they exist
for dir in app/ src/ public/ styles/; do
    if [ -d "$dir" ]; then
        git add "$dir"
        echo "Added directory $dir"
    else
        echo "Warning: Directory $dir not found, skipping"
    fi
done

# Add README and documentation
for file in README.md LICENSE README_GITHUB.md vercel_deploy_notes.md README_OPENAI_TTS.md; do
    if [ -f "$file" ]; then
        git add "$file"
        echo "Added $file"
    else
        echo "Warning: $file not found, skipping"
    fi
done

# Add markdown files from output directory (transcripts, descriptions, show notes)
if [ -d "output" ] && [ "$(ls -A output/*.md 2>/dev/null)" ]; then
    git add output/*.md
    echo "Added markdown files from output directory"
else
    echo "Warning: No markdown files found in output directory, skipping"
fi

# Add thumbnail images from output directory
if [ -d "output" ] && [ "$(ls -A output/*.webp output/*.png 2>/dev/null)" ]; then
    git add output/*.webp output/*.png
    echo "Added thumbnail images from output directory"
else
    echo "Warning: No thumbnail images found in output directory, skipping"
fi

# Add configuration files
git add .gitignore
if [ -f "vercel.json" ]; then
    git add vercel.json
    echo "Added vercel.json"
else
    echo "Warning: vercel.json not found, skipping"
fi

# Add other important configuration files
for file in jest.config.js turbo.json; do
    if [ -f "$file" ]; then
        git add "$file"
        echo "Added $file"
    else
        echo "Warning: $file not found, skipping"
    fi
done

echo ""
echo "Files staged for commit. Review the changes with 'git status'."
echo ""
echo "You can now commit and push to GitHub with:"
echo "git commit -m 'Prepare for Vercel deployment'"
echo "git push origin main"
echo ""
echo "=================================================================="
echo "After pushing to GitHub, you can deploy to Vercel by connecting your GitHub repository to Vercel."
echo "Visit https://vercel.com/new to create a new project and select the GitHub repository."
echo ""
echo "For your existing Vercel project, go to:"
echo "https://vercel.com/gary-welzs-projects/v0-vercel-website-redesign/settings/git"
echo "and connect it to your GitHub repository: https://github.com/garywelz/copernicus" 