# Remove sensitive files
delete:src/config/youtube-service-account.json
delete:assets/regal-scholar-453620-r7-da2d2fa02d15.json
delete:client_secret.json
delete:src/scripts/generate_thumbnails.py
delete:src/scripts/generate_single_thumbnail.py

# Remove sensitive content from .env.example
replace-text:scripts/setup_openai.sh
replace-text:.env.example
replace-text:src/scripts/generate_news.py
replace-text:src/scripts/set_api_key.py 