#!/bin/bash

# Create directories if they don't exist
mkdir -p public/output
mkdir -p public/images

# Copy all markdown files from output to public/output
echo "Copying markdown files..."
cp output/*.md public/output/

# Copy all image files from output to public/images
echo "Copying image files..."
cp output/*.png public/images/ 2>/dev/null || true
cp output/*.jpg public/images/ 2>/dev/null || true
cp output/*.jpeg public/images/ 2>/dev/null || true
cp output/*.webp public/images/ 2>/dev/null || true
cp output/*.svg public/images/ 2>/dev/null || true
cp output/*.gif public/images/ 2>/dev/null || true

# Copy thumbnails
echo "Copying thumbnails..."
cp output/*-thumbnail.* public/images/ 2>/dev/null || true

# Create placeholder audio files (0 bytes) for all episodes
echo "Creating placeholder audio files..."
for md_file in output/*-transcript.md output/*-ep*-transcript.md; do
  base_name=$(basename "$md_file" -transcript.md)
  touch "public/audio/${base_name}.mp3"
done

echo "Done! Files are ready for Vercel deployment." 