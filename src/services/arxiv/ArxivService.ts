import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { logger } from '../../utils/logger.js';

interface ArxivPaper {
    id: string;
    title: string;
    authors: string[];
    summary: string;
    published: string;
    updated: string;
    categories: string[];
    doi?: string;
    journal_ref?: string;
    pdf_url: string;
}

interface SearchOptions {
    search_query: string;
    max_results?: number;
    start?: number;
    sortBy?: 'submittedDate' | 'lastUpdatedDate' | 'relevance';
    sortOrder?: 'ascending' | 'descending';
}

export class ArxivService {
    private readonly baseUrl = 'http://export.arxiv.org/api/query';
    private readonly parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
    });

    /**
     * Search for papers on ArXiv
     * @param options Search options including query, max results, and sorting
     * @returns Array of ArXiv papers
     */
    async searchPapers(options: SearchOptions): Promise<ArxivPaper[]> {
        const {
            search_query,
            max_results = 10,
            start = 0,
            sortBy = 'submittedDate',
            sortOrder = 'descending'
        } = options;

        try {
            // Construct the query URL
            const sortByMap = {
                submittedDate: 'submittedDate',
                lastUpdatedDate: 'lastUpdatedDate',
                relevance: 'relevance'
            };

            const params = new URLSearchParams({
                search_query,
                start: start.toString(),
                max_results: max_results.toString(),
                sortBy: sortByMap[sortBy],
                sortOrder
            });

            // Make the API request
            const response = await axios.get(`${this.baseUrl}?${params}`);
            const parsed = this.parser.parse(response.data);

            // Extract papers from the response
            const entries = Array.isArray(parsed.feed.entry) 
                ? parsed.feed.entry 
                : [parsed.feed.entry];

            return entries.map(this.transformEntry);
        } catch (error) {
            logger.error('Error fetching papers from ArXiv:', error);
            throw new Error('Failed to fetch papers from ArXiv');
        }
    }

    /**
     * Transform ArXiv API entry to paper format
     */
    private transformEntry(entry: any): ArxivPaper {
        const authors = Array.isArray(entry.author) 
            ? entry.author.map((a: any) => a.name)
            : [entry.author.name];

        const categories = Array.isArray(entry.category)
            ? entry.category.map((c: any) => c.term)
            : [entry.category.term];

        return {
            id: entry.id.split('/abs/')[1],
            title: entry.title.trim(),
            authors,
            summary: entry.summary.trim(),
            published: entry.published,
            updated: entry.updated,
            categories,
            doi: entry['arxiv:doi']?.content,
            journal_ref: entry['arxiv:journal_ref']?.content,
            pdf_url: entry.link.find((l: any) => l.title === 'pdf').href
        };
    }

    /**
     * Get detailed information about a specific paper
     * @param paperId ArXiv paper ID
     * @returns Paper details
     */
    async getPaper(paperId: string): Promise<ArxivPaper> {
        try {
            const params = new URLSearchParams({
                id_list: paperId
            });

            const response = await axios.get(`${this.baseUrl}?${params}`);
            const parsed = this.parser.parse(response.data);
            
            return this.transformEntry(parsed.feed.entry);
        } catch (error) {
            logger.error(`Error fetching paper ${paperId}:`, error);
            throw new Error(`Failed to fetch paper ${paperId}`);
        }
    }
} 