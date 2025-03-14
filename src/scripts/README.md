# Podcast Generation Scripts

This directory contains scripts for generating various podcasts for the Copernicus project.

## News Podcast Scripts

### Consolidated Scripts (Recommended)

We now have consolidated scripts that can handle multiple subjects:

1. **`create_news_podcast.py`**: Creates JSON files for podcast content
   ```bash
   python create_news_podcast.py [subject] [options]
   ```
   
   Options:
   - `subject`: One of `biology`, `chemistry`, `compsci`, `math`, `physics`, `science`, or `all`
   - `--part`: Specify which part to create (1, 2, or 0 for both, default: 0)
   - `--output-dir`: Custom output directory (default: src/data/news_json_archive)
   - `--episode`: Episode number (default: 1)

2. **`generate_news_podcast.py`**: Generates audio from JSON files
   ```bash
   python generate_news_podcast.py [subject] [options]
   ```
   
   Options:
   - `subject`: One of `biology`, `chemistry`, `compsci`, `math`, `physics`, `science`
   - `--episode`: Episode number (default: 1)
   - `--output-dir`: Output directory (default: output)

3. **`process_news_podcast.py`**: All-in-one script that handles both creation and generation
   ```bash
   python process_news_podcast.py [subject] [options]
   ```
   
   Options:
   - `subject`: One of `biology`, `chemistry`, `compsci`, `math`, `physics`, `science`, or `all`
   - `--episode`: Episode number (default: 1)
   - `--output-dir`: Output directory (default: output)
   - `--skip-creation`: Skip JSON creation and only generate audio

### Legacy Individual Scripts

The original individual scripts have been moved to the `legacy_news_scripts/` directory to keep this directory clean. These scripts are deprecated in favor of the consolidated scripts above.

If you need to use the legacy scripts for any reason, you can find them in the `legacy_news_scripts/` directory:

```bash
python legacy_news_scripts/create_math_news_podcast.py
```

See the README.md in the `legacy_news_scripts/` directory for more information.

## Other Podcast Scripts

- `add_bumpers.py`: Adds intro and outro bumpers to podcast audio files
- `create_podcast_assets.py`: Creates various assets for podcasts
- `generate_thumbnails.py`: Generates thumbnail images for podcasts

## Usage Examples

### Generate all news podcasts at once

```bash
python process_news_podcast.py all
```

### Generate just the math news podcast

```bash
python process_news_podcast.py math
```

### Skip JSON creation and only generate audio

```bash
python process_news_podcast.py science --skip-creation
```

### Create JSON files for all subjects

```bash
python create_news_podcast.py all
```

### Generate audio for a specific episode

```bash
python generate_news_podcast.py physics --episode 2
``` 