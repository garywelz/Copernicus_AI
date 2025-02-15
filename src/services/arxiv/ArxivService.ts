import { ArxivSearchParams, ArxivResponse, ArxivSearchResult, ArxivPaper } from '../../types/arxiv.js';
import { XMLParser } from 'fast-xml-parser';
import { logger } from '../../utils/logger.js';

export class ArxivService {
  private readonly baseUrl = 'http://export.arxiv.org/api/query?';
  private readonly parser: XMLParser;

  constructor() {
    this.parser = new XMLParser();
  }

  async searchPapers(params: ArxivSearchParams): Promise<ArxivSearchResult> {
    try {
      const searchParams = new URLSearchParams({
        search_query: params.search_query,
        max_results: params.max_results || '5',
        sortBy: params.sortBy || 'lastUpdatedDate',
        sortOrder: params.sortOrder || 'descending'
      });

      const response = await fetch(this.baseUrl + searchParams);
      const data = await response.text();

      const result = this.parser.parse(data) as ArxivResponse;
      const papers = result.feed.entry;

      return {
        success: true,
        status: response.status,
        paperCount: papers.length,
        papers: papers.map(this.normalizePaper)
      };
    } catch (error) {
      logger.error('ArXiv API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private normalizePaper(paper: ArxivPaper): ArxivPaper {
    return {
      ...paper,
      author: Array.isArray(paper.author) ? paper.author : [paper.author]
    };
  }
} 