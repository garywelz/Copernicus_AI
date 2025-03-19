# Copernicus AI Podcast: Vercel Content Solution

## Problem

Your Vercel deployment is missing content files (audio, markdown, and images) due to Vercel's deployment size limitations. Vercel has the following constraints:

1. **Deployment Size Limit**: 500MB total deployment size
2. **Individual File Size Limit**: 50MB per file
3. **Public Directory Size Limit**: Limited by the total deployment size

Your audio files are particularly large (some over 30MB), making them unsuitable for direct inclusion in a Vercel deployment.

## Solution Overview

We've created a comprehensive solution with three components:

1. **Chrome Extension**: A tool to help upload and manage content files on external storage
2. **Content Integration Guide**: Documentation on how to modify your Next.js application
3. **Episodes JSON Generator**: A script to create a structured data file from your content

### 1. Chrome Extension: Copernicus Content Manager

The Chrome extension (`vercel-large-files-extension/`) provides a user-friendly interface for:

- Uploading audio files, markdown files, and images to external storage
- Configuring storage providers (S3, Cloudinary, etc.)
- Adding content URLs to your Vercel environment variables
- Checking content availability after deployment

### 2. Content Integration Guide

The guide (`CONTENT_INTEGRATION_GUIDE.md`) explains how to:

- Set up external storage for your content
- Modify your Next.js application to load content from external sources
- Organize your podcasts by subject
- Test and troubleshoot content loading issues

### 3. Episodes JSON Generator

The script (`generate_episodes_json.js`) automatically:

- Scans your output directory for audio files, markdown files, and images
- Creates a structured JSON file with episode metadata
- Groups episodes by subject (math, physics, biology, etc.)
- Formats durations, titles, and URLs correctly

## Implementation Steps

1. **Set Up External Storage**:
   - Create an AWS S3 bucket, Cloudinary account, or use GitHub LFS
   - Configure CORS to allow access from your Vercel domain
   - Organize your content in a structured way

2. **Upload Content Files**:
   - Use the Chrome extension to upload your files
   - Alternatively, use the AWS CLI, Cloudinary dashboard, or Git LFS

3. **Generate Episodes JSON**:
   - Run the `generate_episodes_json.js` script
   - Upload the resulting `episodes.json` file to your storage

4. **Update Your Next.js Application**:
   - Modify your `useEpisodes` hook to load from external storage
   - Add the `useContent` hook for loading markdown files
   - Update your components to display episodes by subject

5. **Configure Vercel Environment Variables**:
   - Set `CONTENT_BASE_URL` to your storage URL
   - Add any other necessary environment variables

6. **Deploy and Test**:
   - Deploy your updated application to Vercel
   - Test content loading and playback
   - Use the Chrome extension to check content availability

## File Structure

Your content should be organized as follows:

```
your-storage/
├── episodes.json
├── audio/
│   ├── math-news-episode1.mp3
│   ├── biology-news-ep1.mp3
│   └── ...
├── markdown/
│   ├── transcripts/
│   │   ├── math-news-ep1-transcript.md
│   │   └── ...
│   ├── descriptions/
│   │   ├── math-news-ep1-description.md
│   │   └── ...
│   └── show-notes/
│       ├── math-news-ep1-show-notes.md
│       └── ...
└── images/
    ├── math-news-thumbnail.webp
    └── ...
```

## Benefits of This Approach

1. **Scalability**: No limits on the number or size of podcast episodes
2. **Performance**: Audio files are served from optimized storage services
3. **Cost-Effective**: Vercel deployments remain small and efficient
4. **Maintainability**: Clear separation between application code and content
5. **User Experience**: Fast loading times and reliable playback

## Next Steps

1. Choose your preferred storage provider
2. Upload your content files using the Chrome extension
3. Run the episodes JSON generator script
4. Update your Next.js application following the integration guide
5. Deploy to Vercel and test

## Support

If you encounter any issues with this solution, please refer to the troubleshooting section in the Content Integration Guide or reach out for further assistance. 