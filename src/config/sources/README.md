# Research Sources

This directory contains configurations for accessing various free and low-cost research sources.

## Available Sources

### Science and Technology
1. **arXiv** - Open access repository for physics, mathematics, computer science, and more
2. **PLOS** - Public Library of Science for biology and medicine
3. **PubMed Central** - Free archive of biomedical and life sciences journal literature
4. **NASA ADS** - NASA Astrophysics Data System
5. **DBLP** - Computer science bibliography
6. **IEEE Open Access** - Engineering and technology research

### Medicine and Life Sciences
1. **bioRxiv** - Preprint server for biology
2. **medRxiv** - Preprint server for health sciences
3. **PubMed Central** - Medical research archive

### Social Sciences and Humanities
1. **SSRN** - Social Science Research Network
2. **JSTOR Open Content** - Historical and cultural materials
3. **ERIC** - Education Resources Information Center

### Multidisciplinary Resources
1. **DOAJ** - Directory of Open Access Journals
2. **CORE** - Aggregated research papers from around the world
3. **Internet Archive Scholar** - Free access to scholarly works
4. **Zenodo** - Research data repository
5. **Figshare** - Research output repository

## Usage

### Authentication
Some sources require authentication:
- PLOS: API key required
- CORE: API key required
- NASA ADS: API token required
- Zenodo: API key required
- Figshare: API key required

Add your API keys to the `.env` file:
```
PLOS_API_KEY=your_key_here
CORE_API_KEY=your_key_here
NASA_ADS_TOKEN=your_token_here
ZENODO_API_KEY=your_key_here
FIGSHARE_API_KEY=your_key_here
```

### Rate Limits
Be mindful of rate limits:
- arXiv: 1 request/second
- PLOS: 1 request/second
- DOAJ: 2 requests/second
- CORE: 1 request/second
- NASA ADS: 1 request/second
- Zenodo: 1 request/second
- Figshare: 1 request/second

### Example Usage
```typescript
import { RESEARCH_SOURCES } from './sources';

// Get all science sources
const scienceSources = RESEARCH_SOURCES.filter(
  source => source.category === 'SCIENCE'
);

// Get sources that don't require authentication
const openSources = RESEARCH_SOURCES.filter(
  source => !source.requiresAuth
);

// Get sources by field
const physicsSources = RESEARCH_SOURCES.filter(
  source => source.fields.includes('physics')
);
```

## Adding New Sources

To add a new source:
1. Add the source configuration to `sources.ts`
2. Document any authentication requirements
3. Add rate limit information if applicable
4. Update this README with source details

## Best Practices

1. **Rate Limiting**: Always respect rate limits to avoid being blocked
2. **Caching**: Cache results when possible to minimize API calls
3. **Error Handling**: Handle API errors gracefully
4. **Attribution**: Always provide proper attribution for content
5. **Terms of Service**: Follow each source's terms of service

## Future Additions

We plan to add more sources:
- PhilPapers (Philosophy)
- SocArXiv (Social Sciences)
- EarthArXiv (Earth Sciences)
- ChemRxiv (Chemistry)
- OSF Preprints (Various Fields)
