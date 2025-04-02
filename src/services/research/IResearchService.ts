export interface Paper {
    id: string;
    title: string;
    authors: string[];
    abstract: string;
    published: string;
    categories: string[];
    url?: string;
}

export interface PaperAnalysis {
    keyFindings: string[];
    methodology: string;
    implications: string;
    technicalConcepts: string[];
    futureDirections: string;
    discussionPoints: string[];
}

export interface IResearchService {
    analyzePaper(paper: Paper): Promise<PaperAnalysis>;
    processPapers(papers: Paper[]): Promise<PaperAnalysis[]>;
    fetchPapers(category: string, maxPapers?: number): Promise<Paper[]>;
} 