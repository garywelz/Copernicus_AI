# Copernicus AI Podcast: Content Management Solution

This repository contains tools and documentation for managing large content files (audio, markdown, and images) for the Copernicus AI podcast platform deployed on Vercel.

## Table of Contents

- [Problem Statement](#problem-statement)
- [Solution Components](#solution-components)
- [Getting Started](#getting-started)
- [Workflow](#workflow)
- [File Structure](#file-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Problem Statement

Vercel has deployment size limitations that make it challenging to include large audio files, transcripts, and images directly in a deployment:

- **Deployment Size Limit**: 500MB total deployment size
- **Individual File Size Limit**: 50MB per file
- **Public Directory Size Limit**: Limited by the total deployment size

The Copernicus AI podcast platform includes audio files that exceed these limits, requiring an external storage solution.

## Solution Components

### 1. Chrome Extension: Copernicus Content Manager

A Chrome extension for managing content files:

- **Location**: `vercel-large-files-extension/`
- **Features**:
  - Upload audio files, markdown files, and images to external storage
  - Configure storage providers (S3, Cloudinary, etc.)
  - Add content URLs to Vercel environment variables
  - Check content availability after deployment

### 2. Content Integration Guide

Documentation on integrating external content:

- **Location**: `CONTENT_INTEGRATION_GUIDE.md`
- **Topics**:
  - Setting up external storage
  - Modifying the Next.js application
  - Organizing podcasts by subject
  - Testing and troubleshooting

### 3. Episodes JSON Generator

A script to create a structured data file:

- **Location**: `generate_episodes_json.js`
- **Features**:
  - Scan for audio files, markdown files, and images
  - Create a structured JSON file with episode metadata
  - Group episodes by subject
  - Format durations, titles, and URLs

### 4. S3 Upload Script

A shell script for uploading content to AWS S3:

- **Location**: `upload_content_to_s3.sh`
- **Features**:
  - Upload audio files, markdown files, and images to S3
  - Create the appropriate directory structure
  - Generate and upload episodes.json
  - Set appropriate content types and permissions

## Getting Started

### Prerequisites

- Node.js and npm
- AWS CLI (for S3 upload script)
- Chrome browser (for the extension)
- ffprobe (for audio duration detection)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/garywelz/Copernicus_AI.git
   cd Copernicus_AI
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install the Chrome extension:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `vercel-large-files-extension` directory

4. Configure the S3 upload script:
   - Edit `upload_content_to_s3.sh` and set your S3 bucket name
   - Make the script executable: `chmod +x upload_content_to_s3.sh`

## Workflow

### 1. Prepare Your Content

Ensure your content files are organized in the `output` directory:

- Audio files (`.mp3`, `.wav`) should be in the root of the `output` directory
- Markdown files should follow the naming convention:
  - `{episode-name}-transcript.md`
  - `{episode-name}-description.md`
  - `{episode-name}-show-notes.md`
- Images should be in the `output` directory with the naming convention:
  - `{subject}-thumbnail.webp`

### 2. Upload Content to External Storage

#### Option A: Using the S3 Upload Script

1. Configure the script with your S3 bucket name
2. Run the script:
   ```
   ./upload_content_to_s3.sh
   ```

#### Option B: Using the Chrome Extension

1. Open the Chrome extension
2. Configure your storage provider
3. Upload your content files
4. Add content URLs to your Vercel environment variables

### 3. Update Your Next.js Application

Follow the instructions in the Content Integration Guide to:

1. Add the `useContent` hook for loading markdown files
2. Update the `useEpisodes` hook to load from external storage
3. Update your components to display episodes by subject

### 4. Deploy to Vercel

1. Push your changes to GitHub
2. Deploy to Vercel
3. Set the `NEXT_PUBLIC_CONTENT_BASE_URL` environment variable
4. Test content loading and playback

## File Structure

### Local Repository

```
copernicus/
├── output/                           # Your content files
│   ├── *.mp3, *.wav                  # Audio files
│   ├── *-transcript.md               # Transcripts
│   ├── *-description.md              # Descriptions
│   ├── *-show-notes.md               # Show notes
│   └── *-thumbnail.webp              # Images
├── vercel-large-files-extension/     # Chrome extension
│   ├── manifest.json                 # Extension configuration
│   ├── popup.html                    # Extension UI
│   ├── popup.js                      # Extension logic
│   ├── background.js                 # Background script
│   ├── content.js                    # Content script
│   └── README.md                     # Extension documentation
├── generate_episodes_json.js         # Episodes JSON generator
├── upload_content_to_s3.sh           # S3 upload script
├── CONTENT_INTEGRATION_GUIDE.md      # Integration guide
├── VERCEL_CONTENT_SOLUTION.md        # Solution overview
└── README_CONTENT_SOLUTION.md        # This file
```

### External Storage

```
your-storage/
├── episodes.json                     # Episode metadata
├── audio/                            # Audio files
│   ├── math-news-episode1.mp3
│   └── ...
├── markdown/                         # Markdown files
│   ├── transcripts/
│   │   ├── math-news-ep1-transcript.md
│   │   └── ...
│   ├── descriptions/
│   │   ├── math-news-ep1-description.md
│   │   └── ...
│   └── show-notes/
│       ├── math-news-ep1-show-notes.md
│       └── ...
└── images/                           # Images
    ├── math-news-thumbnail.webp
    └── ...
```

## Troubleshooting

### Common Issues

#### Audio Files Not Loading

- Check that the audio file URL is correct
- Verify that the audio file is publicly accessible
- Check the CORS configuration of your storage provider
- Try adding the `crossorigin="anonymous"` attribute to your audio element

#### Markdown Files Not Rendering

- Check that the markdown file URL is correct
- Verify that the markdown file is publicly accessible
- Check for any syntax errors in your markdown files

#### Images Not Displaying

- Check that the image URL is correct
- Verify that the image is publicly accessible
- Try using the Next.js Image component with proper configuration

### Getting Help

If you encounter any issues with this solution, please:

1. Check the troubleshooting section in the Content Integration Guide
2. Open an issue on the GitHub repository
3. Reach out for further assistance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 