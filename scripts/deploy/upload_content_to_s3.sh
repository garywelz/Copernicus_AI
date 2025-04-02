#!/bin/bash

# Script to upload Copernicus AI podcast content to AWS S3
# Prerequisites: AWS CLI installed and configured with appropriate credentials

# Configuration
S3_BUCKET="your-bucket-name"  # Replace with your actual bucket name
OUTPUT_DIR="./output"
CONTENT_BASE_URL="https://$S3_BUCKET.s3.amazonaws.com"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed. Please install it first.${NC}"
    echo "Visit https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html for installation instructions."
    exit 1
fi

# Check if the bucket exists
echo -e "${YELLOW}Checking if bucket $S3_BUCKET exists...${NC}"
if ! aws s3 ls "s3://$S3_BUCKET" &> /dev/null; then
    echo -e "${RED}Error: Bucket $S3_BUCKET does not exist or you don't have access to it.${NC}"
    echo "Please create the bucket or check your AWS credentials."
    exit 1
fi

# Create directories in S3 bucket
echo -e "${YELLOW}Creating directory structure in S3 bucket...${NC}"
aws s3api put-object --bucket "$S3_BUCKET" --key "audio/"
aws s3api put-object --bucket "$S3_BUCKET" --key "markdown/transcripts/"
aws s3api put-object --bucket "$S3_BUCKET" --key "markdown/descriptions/"
aws s3api put-object --bucket "$S3_BUCKET" --key "markdown/show-notes/"
aws s3api put-object --bucket "$S3_BUCKET" --key "images/"

# Upload audio files
echo -e "${YELLOW}Uploading audio files...${NC}"
audio_count=0
for file in "$OUTPUT_DIR"/*.mp3 "$OUTPUT_DIR"/*.wav; do
    if [[ -f "$file" && ! "$file" =~ "partial" && ! "$file" =~ "cache" ]]; then
        filename=$(basename "$file")
        echo "Uploading $filename..."
        aws s3 cp "$file" "s3://$S3_BUCKET/audio/$filename" --content-type "audio/mpeg" --acl public-read
        audio_count=$((audio_count + 1))
    fi
done
echo -e "${GREEN}Uploaded $audio_count audio files.${NC}"

# Upload markdown files
echo -e "${YELLOW}Uploading markdown files...${NC}"
transcript_count=0
description_count=0
shownotes_count=0

# Transcripts
for file in "$OUTPUT_DIR"/*-transcript.md; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        echo "Uploading $filename..."
        aws s3 cp "$file" "s3://$S3_BUCKET/markdown/transcripts/$filename" --content-type "text/markdown" --acl public-read
        transcript_count=$((transcript_count + 1))
    fi
done

# Descriptions
for file in "$OUTPUT_DIR"/*-description.md; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        echo "Uploading $filename..."
        aws s3 cp "$file" "s3://$S3_BUCKET/markdown/descriptions/$filename" --content-type "text/markdown" --acl public-read
        description_count=$((description_count + 1))
    fi
done

# Show notes
for file in "$OUTPUT_DIR"/*-show-notes.md; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        echo "Uploading $filename..."
        aws s3 cp "$file" "s3://$S3_BUCKET/markdown/show-notes/$filename" --content-type "text/markdown" --acl public-read
        shownotes_count=$((shownotes_count + 1))
    fi
done

echo -e "${GREEN}Uploaded $transcript_count transcripts, $description_count descriptions, and $shownotes_count show notes.${NC}"

# Upload images
echo -e "${YELLOW}Uploading images...${NC}"
image_count=0
for file in "$OUTPUT_DIR"/*.webp; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        echo "Uploading $filename..."
        aws s3 cp "$file" "s3://$S3_BUCKET/images/$filename" --content-type "image/webp" --acl public-read
        image_count=$((image_count + 1))
    fi
done
echo -e "${GREEN}Uploaded $image_count images.${NC}"

# Generate episodes.json
echo -e "${YELLOW}Generating episodes.json...${NC}"
export CONTENT_BASE_URL="$CONTENT_BASE_URL"
node generate_episodes_json.js

# Upload episodes.json
echo -e "${YELLOW}Uploading episodes.json...${NC}"
aws s3 cp "$OUTPUT_DIR/episodes.json" "s3://$S3_BUCKET/episodes.json" --content-type "application/json" --acl public-read

echo -e "${GREEN}Content upload complete!${NC}"
echo -e "${YELLOW}Your content is now available at: $CONTENT_BASE_URL${NC}"
echo -e "${YELLOW}Add the following environment variable to your Vercel project:${NC}"
echo -e "NEXT_PUBLIC_CONTENT_BASE_URL=$CONTENT_BASE_URL" 