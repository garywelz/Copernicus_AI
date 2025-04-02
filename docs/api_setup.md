# Research API Keys Setup Guide

This guide walks you through obtaining and configuring API keys for various research sources.

## Core Research Sources

### 1. CORE API
**Purpose**: Access to millions of open access research papers across all fields.

1. Visit https://core.ac.uk/services/api/
2. Click "Get API Key"
3. Fill out the registration form:
   - Select "Academic/Research" use
   - Provide institutional email if possible
   - Describe usage: "Accessing research papers for podcast content generation"
4. Once approved, copy your API key
5. Add to `.env`:
   ```
   CORE_API_KEY=your_key_here
   ```

### 2. NASA ADS
**Purpose**: Access to astronomy and physics research papers.

1. Visit https://ui.adsabs.harvard.edu/user/account/register
2. Create an account
3. Go to "Account -> Settings -> API Token"
4. Generate a new token
5. Add to `.env`:
   ```
   NASA_ADS_TOKEN=your_token_here
   ```

### 3. PLOS API
**Purpose**: Access to biology and medicine research.

1. Visit https://api.plos.org/registration/
2. Complete the registration form
3. Verify your email
4. Copy the API key from your welcome email
5. Add to `.env`:
   ```
   PLOS_API_KEY=your_key_here
   ```

## Additional Sources

### 4. Zenodo
**Purpose**: Access to research data and supplementary materials.

1. Visit https://zenodo.org/
2. Create an account
3. Go to "Applications" in your profile
4. Create a new token
5. Add to `.env`:
   ```
   ZENODO_API_KEY=your_key_here
   ```

### 5. Figshare
**Purpose**: Access to research data and figures.

1. Visit https://figshare.com/
2. Create an account and log in
3. Go to "Applications" in your profile settings
4. Under "Personal tokens" (not "Applications"), click "Create new token"
5. Enter a description: "Copernicus Podcast Generator"
6. Select the following scopes:
   - `read_public`
   - `read_user`
7. Click "Generate token"
8. Copy the token immediately (it won't be shown again)
9. Add to `.env`:
   ```
   FIGSHARE_API_KEY=your_token_here
   ```

Note: We use a personal token instead of OAuth since we're not requiring users to log in to Figshare.

## Verifying Your Setup

1. Run the API test script:
   ```bash
   npm run test:apis
   ```

2. Check the results in the console:
   - Green ✓: API key is valid and working
   - Red ✗: API key is invalid or missing

## Troubleshooting

### Common Issues

1. **Invalid API Key**
   - Verify key is copied correctly
   - Check for extra spaces
   - Ensure key is added to `.env`

2. **Rate Limit Exceeded**
   - Wait a few minutes
   - Check rate limit in documentation
   - Implement caching if needed

3. **Authentication Failed**
   - Verify key hasn't expired
   - Check if IP is whitelisted
   - Ensure HTTPS is used

### Getting Help

- CORE: support@core.ac.uk
- NASA ADS: adshelp@cfa.harvard.edu
- PLOS: api@plos.org
- Zenodo: info@zenodo.org
- Figshare: support@figshare.com

## Best Practices

1. **Security**
   - Never commit API keys to git
   - Use environment variables
   - Rotate keys periodically

2. **Usage**
   - Implement rate limiting
   - Cache responses
   - Handle errors gracefully

3. **Monitoring**
   - Log API usage
   - Track rate limits
   - Monitor response times 

GOOGLE_PROJECT_ID=your-project-id 