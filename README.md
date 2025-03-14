# Copernicus Science Podcast Project

This repository contains tools for generating and playing science podcasts across various disciplines.

## Project Components

### 1. Podcast Generation Script

The `generate_all_podcasts.py` script automates the creation of science podcasts for different disciplines:

- Biology
- Computer Science
- Chemistry
- Physics
- Mathematics
- Science News

#### Usage

   ```bash
# Generate all podcasts
python generate_all_podcasts.py

# Generate specific podcast types
python generate_all_podcasts.py --type biology
python generate_all_podcasts.py --type compsci
python generate_all_podcasts.py --type news
```

The script will create podcast files with descriptions, show notes, and transcripts.

### 2. Science Podcast Player Chrome Extension

A Chrome extension that allows you to listen to science podcasts directly in your browser. This extension provides a clean, intuitive interface for playing science podcasts across various disciplines.

#### Features

- **Curated Science Podcasts**: Access a collection of high-quality science podcasts across multiple disciplines
- **Elegant Player Interface**: Clean, Material Design-inspired UI with intuitive controls
- **Playback Control**: Play/pause, skip forward/backward, adjust volume, and change playback speed
- **Persistent Playback**: Your playback position is saved between sessions
- **Light/Dark Theme**: Choose between light and dark themes based on your preference
- **Responsive Design**: Works well on various screen sizes

#### Installation

##### From Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store (link to be added)
2. Click "Add to Chrome"
3. Confirm the installation when prompted

##### Manual Installation (Developer Mode)
1. Navigate to the `chrome-extension` directory
2. Run `./build.sh install` to install dependencies
3. Run `./build.sh build` to build the extension
4. Open Chrome and navigate to `chrome://extensions/`
5. Enable "Developer mode" using the toggle in the top-right corner
6. Click "Load unpacked"
7. Select the `chrome-extension/dist` folder
8. The extension should now appear in your extensions list and in the toolbar

#### Development

The extension is built using modern web technologies:

- TypeScript for type-safe JavaScript
- Webpack for bundling
- ESLint for code quality
- Material Design for UI

##### Build Commands

   ```bash
# Install dependencies
./build.sh install

# Development build with watch mode
./build.sh dev

# Production build
./build.sh build

# Package for distribution
./build.sh package

# Lint code
./build.sh lint

# Type check TypeScript
./build.sh typecheck

# Clean build artifacts
./build.sh clean
```

##### Project Structure

```
chrome-extension/
├── css/                  # Stylesheets
│   ├── popup.css         # Popup styles
│   └── styles.css        # Common styles
├── images/               # Icons and images
│   ├── icon128.svg       # Extension icon (128x128)
│   ├── icon48.svg        # Extension icon (48x48)
│   └── icon16.svg        # Extension icon (16x16)
├── js/                   # JavaScript/TypeScript files
│   ├── background.js     # Background service worker
│   ├── content.js        # Content script
│   ├── options.js        # Options page script
│   ├── popup.js          # Popup script
│   └── utils.js          # Utility functions
├── manifest.json         # Extension manifest
├── popup.html            # Popup HTML
├── options.html          # Options page HTML
├── package.json          # NPM package configuration
├── webpack.config.js     # Webpack configuration
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.js          # ESLint configuration
├── babel.config.js       # Babel configuration
├── build.sh              # Build script
├── LICENSE               # MIT License
└── README.md             # Extension README
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
