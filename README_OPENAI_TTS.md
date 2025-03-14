# OpenAI Text-to-Speech for Podcast Generation

This guide explains how to use OpenAI's Text-to-Speech (TTS) service to generate high-quality audio for your podcast.

## Overview

OpenAI's TTS service offers natural-sounding voices that are significantly better than Google Cloud TTS and comparable to ElevenLabs. The implementation in this project uses:

- **6 different voices** for different speakers and section headings
- **Two quality levels**: Standard (tts-1) and High Definition (tts-1-hd)
- **Cost-effective pricing**: $0.015 per 1,000 characters for standard, $0.030 per 1,000 characters for HD

## Setup Instructions

1. **Get an OpenAI API Key**:
   - Sign up for an account at [OpenAI](https://platform.openai.com/)
   - Navigate to the [API Keys page](https://platform.openai.com/api-keys)
   - Create a new API key

2. **Set up your API Key**:
   - Run the setup script: `./setup_openai.sh`
   - Enter your API key when prompted

3. **Install Required Packages**:
   - Make sure your virtual environment is activated: `source venv/bin/activate`
   - Install the requests package if not already installed: `pip install requests`

## Running the Podcast Generator

To generate a podcast using OpenAI TTS:

```bash
source venv/bin/activate
python generate_math_podcast_openai.py
```

The script will:
1. Parse the transcript file
2. Generate audio for each segment using the appropriate voice
3. Combine all segments with intro and outro music
4. Save the final podcast to `output/math-news-episode1-openai.mp3`

## Voice Assignments

The script uses the following OpenAI voices:

- **Elena (Host)**: nova (HD quality)
- **Marcus**: onyx
- **Priya**: shimmer
- **Wei**: echo
- **Daria**: alloy
- **Section Headings**: fable

## Cost Estimation

The script will provide an estimate of the cost at the end of the generation process. For a typical episode:

- Standard quality segments: ~$0.15
- HD quality segments: ~$0.30
- Total cost: ~$0.45 per episode

## Troubleshooting

If you encounter issues:

1. **API Key Problems**: Make sure your API key is correctly set in the `.env` file
2. **Rate Limiting**: The script includes pauses between API calls to avoid rate limiting
3. **Long Segments**: The script automatically handles segments longer than 4,000 characters by splitting them

## Comparing with Other TTS Services

| Feature | OpenAI TTS | Google Cloud TTS | ElevenLabs |
|---------|------------|------------------|------------|
| Voice Quality | Excellent | Good | Excellent |
| Cost | $0.015-0.030/1K chars | $4/1M chars | $1-3/1K chars |
| Voice Variety | 6 voices | Many voices | Many voices |
| Customization | Limited | Moderate | Extensive |
| Ease of Use | Simple | Complex | Moderate |

## Further Improvements

Potential enhancements for future versions:

1. Add more SSML-like features using OpenAI's formatting options
2. Implement voice cloning if OpenAI adds this feature
3. Add support for multiple languages
4. Create a hybrid approach using different services for different speakers 