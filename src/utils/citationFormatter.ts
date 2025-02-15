import { ResearchPaper } from '../types/paper.js';

interface CitationConfig {
  style: 'APA' | 'MLA' | 'Chicago' | 'IEEE';
  includeLinks: boolean;
  includeDOI: boolean;
}

export function formatCitation(
  paper: ResearchPaper,
  config: CitationConfig
): string {
  const { authors, title, journal, publicationDate, doi } = paper;
  
  switch (config.style) {
    case 'APA':
      return `${authors.join(', ')}. (${publicationDate}). ${title}. ${journal}.${
        config.includeDOI && doi ? ` doi: ${doi}` : ''
      }`;
    // Add other citation styles as needed
    default:
      return `${authors.join(', ')} - "${title}"`;
  }
} 