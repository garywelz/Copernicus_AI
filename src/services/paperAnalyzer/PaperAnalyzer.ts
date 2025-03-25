import OpenAI from 'openai';
import { ArxivPaper } from '../arxiv/ArxivService';

interface PaperAnalysis {
    title: string;
    summary: string;
    keyFindings: string[];
    methodology: string;
    implications: string;
    relatedWork: string;
    technicalComplexity: 'low' | 'medium' | 'high';
    suggestedQuestions: string[];
    keywords: string[];
}

interface AnalysisOptions {
    maxTokens?: number;
    temperature?: number;
    complexity?: 'beginner' | 'intermediate' | 'advanced';
}

export class PaperAnalyzer {
    private readonly openai: OpenAI;
    private readonly defaultOptions: AnalysisOptions = {
        maxTokens: 1000,
        temperature: 0.7,
        complexity: 'intermediate'
    };

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }

    /**
     * Analyze multiple papers and find connections between them
     * @param papers Array of ArXiv papers
     * @param options Analysis options
     * @returns Combined analysis of all papers
     */
    async analyzePapers(
        papers: ArxivPaper[],
        options: AnalysisOptions = {}
    ): Promise<PaperAnalysis[]> {
        try {
            // Analyze each paper individually
            const analyses = await Promise.all(
                papers.map(paper => this.analyzePaper(paper, options))
            );

            // Find connections between papers
            if (papers.length > 1) {
                const connections = await this.findConnections(analyses);
                // Add connection insights to each analysis
                analyses.forEach((analysis, i) => {
                    analysis.relatedWork += `\n\nConnections to other papers:\n${
                        connections[i].join('\n')
                    }`;
                });
            }

            return analyses;
        } catch (error) {
            console.error('Error analyzing papers:', error);
            throw new Error('Failed to analyze papers');
        }
    }

    /**
     * Analyze a single research paper
     * @param paper ArXiv paper
     * @param options Analysis options
     * @returns Detailed analysis of the paper
     */
    private async analyzePaper(
        paper: ArxivPaper,
        options: AnalysisOptions
    ): Promise<PaperAnalysis> {
        const opts = { ...this.defaultOptions, ...options };

        try {
            const prompt = this.constructAnalysisPrompt(paper, opts.complexity);
            
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a research paper analyst specializing in making complex academic papers accessible to different audience levels.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: opts.temperature,
                max_tokens: opts.maxTokens
            });

            const analysis = JSON.parse(response.choices[0].message.content);
            return this.validateAnalysis(analysis);
        } catch (error) {
            console.error(`Error analyzing paper ${paper.id}:`, error);
            throw new Error(`Failed to analyze paper ${paper.id}`);
        }
    }

    /**
     * Find connections between multiple paper analyses
     * @param analyses Array of paper analyses
     * @returns Array of connection descriptions for each paper
     */
    private async findConnections(
        analyses: PaperAnalysis[]
    ): Promise<string[][]> {
        try {
            const prompt = this.constructConnectionsPrompt(analyses);
            
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a research synthesizer specializing in finding connections between academic papers.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('Error finding connections between papers:', error);
            return analyses.map(() => []);
        }
    }

    /**
     * Construct prompt for paper analysis
     */
    private constructAnalysisPrompt(
        paper: ArxivPaper,
        complexity: 'beginner' | 'intermediate' | 'advanced'
    ): string {
        return `
Please analyze the following research paper and provide a structured analysis suitable for a ${complexity} audience.
Focus on making the content accessible while maintaining accuracy.

Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Abstract: ${paper.summary}

Please provide the analysis in the following JSON format:
{
    "title": "Paper title in simpler terms",
    "summary": "Clear explanation of the paper's main points",
    "keyFindings": ["Array of key findings"],
    "methodology": "Description of the research approach",
    "implications": "Real-world impact and applications",
    "relatedWork": "Context within the field",
    "technicalComplexity": "low/medium/high",
    "suggestedQuestions": ["Questions for discussion"],
    "keywords": ["Relevant keywords"]
}`;
    }

    /**
     * Construct prompt for finding connections between papers
     */
    private constructConnectionsPrompt(analyses: PaperAnalysis[]): string {
        return `
Please analyze the following ${analyses.length} papers and identify meaningful connections between them.
Focus on shared themes, complementary findings, and potential synthesis of ideas.

Papers:
${analyses.map((a, i) => `
Paper ${i + 1}: ${a.title}
Summary: ${a.summary}
Key Findings: ${a.keyFindings.join(', ')}
`).join('\n')}

Please provide an array of connection descriptions for each paper in JSON format.
Each paper should have an array of strings describing its connections to other papers.`;
    }

    /**
     * Validate and clean analysis output
     */
    private validateAnalysis(analysis: any): PaperAnalysis {
        // Ensure all required fields are present
        const requiredFields = [
            'title', 'summary', 'keyFindings', 'methodology',
            'implications', 'relatedWork', 'technicalComplexity',
            'suggestedQuestions', 'keywords'
        ];

        for (const field of requiredFields) {
            if (!analysis[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Validate arrays
        if (!Array.isArray(analysis.keyFindings) ||
            !Array.isArray(analysis.suggestedQuestions) ||
            !Array.isArray(analysis.keywords)) {
            throw new Error('Invalid analysis format: arrays required for keyFindings, suggestedQuestions, and keywords');
        }

        // Validate technicalComplexity
        if (!['low', 'medium', 'high'].includes(analysis.technicalComplexity)) {
            throw new Error('Invalid technicalComplexity value');
        }

        return analysis as PaperAnalysis;
    }
} 