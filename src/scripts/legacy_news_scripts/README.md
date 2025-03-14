# Legacy News Podcast Scripts

This directory contains the original individual news podcast scripts that have been replaced by consolidated scripts in the parent directory.

## Why These Scripts Are Here

These scripts were moved here to:
1. Keep the main scripts directory clean and focused on actively used scripts
2. Preserve the original scripts for reference and backward compatibility
3. Make it clear which scripts are the preferred ones to use

## Consolidated Replacements

These legacy scripts have been replaced by three consolidated scripts in the parent directory:

1. **`create_news_podcast.py`**: Replaces all `create_*_news_podcast.py` and `create_*_news_podcast_part2.py` scripts
2. **`generate_news_podcast.py`**: Replaces all `generate_*_news_podcast.py` scripts
3. **`process_news_podcast.py`**: All-in-one script that handles both creation and generation

## Usage

While these scripts still work, it's recommended to use the consolidated scripts instead. If you need to use these legacy scripts for any reason, you can run them directly from this directory:

```bash
python legacy_news_scripts/create_math_news_podcast.py
```

However, the preferred approach is to use the consolidated scripts:

```bash
python create_news_podcast.py math
python generate_news_podcast.py math
# Or the all-in-one approach:
python process_news_podcast.py math
```

See the README.md in the parent directory for more information on using the consolidated scripts. 