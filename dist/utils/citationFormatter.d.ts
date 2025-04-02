import { ResearchPaper } from '../types/paper';
interface CitationConfig {
    style: 'APA' | 'MLA' | 'Chicago' | 'IEEE';
    includeLinks: boolean;
    includeDOI: boolean;
}
export declare function formatCitation(paper: ResearchPaper, config: CitationConfig): string;
export {};
