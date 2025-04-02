# Copernicus AI

An AI-powered podcast and video generation system that creates engaging educational content about science and mathematics.

## Project Structure

```
copernicus/
├── config/                    # Configuration files
│   ├── environment/          # Environment configurations
│   ├── api/                  # API configurations
│   ├── services/             # Service-specific configs
│   └── types/                # TypeScript type definitions
├── src/                      # Main source code
│   ├── services/            # Core services
│   ├── models/              # Data models
│   ├── utils/               # Shared utilities
│   └── tests/               # Test files
├── scripts/                  # Utility scripts
│   ├── build/               # Build scripts
│   ├── deploy/              # Deployment scripts
│   ├── generate/            # Content generation scripts
│   │   ├── video/          # Video generation
│   │   ├── news/           # News generation
│   │   └── batch/          # Batch processing
│   └── utils/               # Development utilities
├── output/                   # Generated content
│   ├── cache/               # Temporary cache
│   ├── content/             # Generated content
│   │   ├── audio/          # Audio files
│   │   ├── video/          # Video files
│   │   └── text/           # Text content
│   └── assets/              # Processed assets
├── docs/                     # Documentation
├── prisma/                   # Database schema
└── tools/                    # Development tools
```

## Features

- AI-powered content generation
- Multi-format output (audio, video, text)
- Integration with various APIs (ElevenLabs, Twitter, YouTube, etc.)
- Automated content scheduling and publishing
- Advanced audio and video processing
- Comprehensive testing suite

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   pip install -r requirements.txt
   ```
3. Copy environment files:
   ```bash
   cp config/environment/.env.example config/environment/.env.development
   ```
4. Set up your environment variables
5. Run the development server:
   ```bash
   npm run dev
   ```

## Development

- TypeScript for main application code
- Python for data processing and ML tasks
- Prisma for database management
- Jest for testing
- ESLint for code quality

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 