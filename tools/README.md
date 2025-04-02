# Copernicus Tools

This directory contains various utility scripts for managing and testing different aspects of the Copernicus podcast generation system.

## Directory Structure

```
tools/
├── scripts/
│   ├── youtube/     # YouTube API integration scripts
│   ├── twitter/     # Twitter API integration scripts
│   ├── podcast/     # Podcast generation scripts
│   └── descript/    # Descript API integration scripts
├── examples/        # Example scripts for reference
└── package.json     # Project configuration and scripts
```

## Available Scripts

### YouTube
- `youtube:token` - Get a YouTube OAuth refresh token
- `youtube:test` - Test video upload to YouTube

### Twitter
- `twitter:test` - Test sharing content to Twitter
- `twitter:simple` - Test simple tweet functionality

### Podcast
- `podcast:generate` - Generate a podcast episode
- `podcast:blackholes` - Generate a black holes podcast episode

### Descript
- `descript:test` - Test Descript API integration

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys and credentials

3. Run scripts:
   ```bash
   npm run youtube:token
   npm run youtube:test
   npm run twitter:test
   # etc.
   ```

## Examples

The `examples/` directory contains example scripts that demonstrate various features of the system. These can be used as reference for creating new scripts or understanding the API usage.

## Development

- All scripts are written in TypeScript
- Use `ts-node` to run scripts directly
- Build the project with `npm run build`
- The `tsconfig.json` includes path aliases for easy imports from the main project 