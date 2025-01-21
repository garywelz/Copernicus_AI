import {
    Action,
    IAgentRuntime,
    Memory,
    HandlerCallback,
    State,
    composeContext,
    ModelClass,
    elizaLogger,
} from "@elizaos/core";
import { OpenRouterService } from "../services/llm/OpenRouterService.js";

export interface PaperAnalysis {
    keyFindings: string[];
    paradigmShifts: string[];
    implications: string[];
    researchGaps: string[];
    futureDirections: string[];
    technicalContributions: string[];
}

export interface PaperContent {
    title: string;
    authors: string[];
    content: string;
}

function validatePaperContent(content: any): content is PaperContent {
    if (!content?.title || typeof content.title !== 'string') {
        throw new Error('invalid_content: missing or invalid title');
    }
    if (!Array.isArray(content.authors) || content.authors.length === 0) {
        throw new Error('invalid_content: missing or invalid authors');
    }
    if (!content.content || typeof content.content !== 'string') {
        throw new Error('invalid_content: missing or invalid content');
    }
    if (content.content.length > 10000) {
        throw new Error('content_too_long: content exceeds maximum length of 10000 characters');
    }
    return true;
}

export const analyzePaperAction: Action = {
    name: "ANALYZE_PAPER",
    description: "Analyze a research paper and identify paradigm-shifting elements",
    
    validate: async (runtime: IAgentRuntime, message: Memory) => {
        if (!runtime.character.settings.secrets?.OPENROUTER_API_KEY) {
            elizaLogger.error("Missing OpenRouter API key");
            return false;
        }
        try {
            return validatePaperContent(message.content);
        } catch (error) {
            elizaLogger.error("Invalid paper content:", error);
            return false;
        }
    },

    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ) => {
        try {
            // Validate content
            if (!validatePaperContent(message.content)) {
                throw new Error('invalid_content: Invalid paper content');
            }

            const openRouterService = new OpenRouterService(runtime.character.settings.secrets?.OPENROUTER_API_KEY || '');

            const analysisPrompt = `
                Please provide a comprehensive analysis of the following research paper, focusing on both technical and broader impacts.

                Consider these specific aspects:
                1. Key Findings:
                   - Main technical contributions and discoveries
                   - Empirical results and their significance
                   - Novel methodologies or approaches introduced

                2. Paradigm Shifts:
                   - How this work challenges existing assumptions
                   - New perspectives or methodologies introduced
                   - Potential impact on current research practices

                3. Technical Contributions:
                   - Specific technical innovations
                   - Methodological improvements
                   - Novel algorithms or approaches

                4. Research Gaps:
                   - Limitations identified in current approaches
                   - Areas requiring further investigation
                   - Methodological challenges

                5. Future Directions:
                   - Potential research opportunities
                   - Suggested improvements or extensions
                   - Emerging research questions

                6. Broader Implications:
                   - Impact on the field and related disciplines
                   - Societal and ethical considerations
                   - Practical applications and implementation challenges

                Paper Title: ${message.content.title}
                Authors: ${message.content.authors.join(', ')}
                Content: ${message.content.content}

                Please provide specific, concrete details for each category.
            `;

            const result = await openRouterService.generateStructuredOutput<PaperAnalysis>(
                analysisPrompt,
                {
                    type: "object",
                    properties: {
                        keyFindings: {
                            type: "array",
                            items: { type: "string" },
                            description: "Main technical findings and contributions"
                        },
                        paradigmShifts: {
                            type: "array",
                            items: { type: "string" },
                            description: "Major changes in thinking or approach"
                        },
                        technicalContributions: {
                            type: "array",
                            items: { type: "string" },
                            description: "Specific technical innovations and improvements"
                        },
                        researchGaps: {
                            type: "array",
                            items: { type: "string" },
                            description: "Identified limitations and areas needing more research"
                        },
                        futureDirections: {
                            type: "array",
                            items: { type: "string" },
                            description: "Suggested future research directions"
                        },
                        implications: {
                            type: "array",
                            items: { type: "string" },
                            description: "Broader impacts and applications"
                        }
                    },
                    required: ["keyFindings", "paradigmShifts", "technicalContributions", "researchGaps", "futureDirections", "implications"]
                },
                {
                    model: "gpt-3.5-turbo",
                    temperature: 0.7
                }
            );

            elizaLogger.info('Generated analysis:', result);

            await runtime.storeMemory({
                type: "paper_analysis",
                content: result,
                timestamp: new Date().toISOString()
            });

            const formattedResponse = [
                `Analysis complete for paper: ${message.content.title}\n`,
                'Key Findings:',
                ...result.keyFindings.map(f => `  • ${f}`),
                '\nTechnical Contributions:',
                ...result.technicalContributions.map(t => `  • ${t}`),
                '\nParadigm Shifts:',
                ...result.paradigmShifts.map(s => `  • ${s}`),
                '\nResearch Gaps:',
                ...result.researchGaps.map(g => `  • ${g}`),
                '\nFuture Directions:',
                ...result.futureDirections.map(d => `  • ${d}`),
                '\nBroader Implications:',
                ...result.implications.map(i => `  • ${i}`),
                '\nAnalysis complete.'
            ].join('\n');

            callback(
                { text: formattedResponse },
                []
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            elizaLogger.error("Error analyzing paper:", error);
            
            let userMessage = "Failed to analyze paper. ";
            
            if (errorMessage.includes('invalid_content')) {
                userMessage += "Please provide a valid paper with title, authors, and content.";
            } else if (errorMessage.includes('content_too_long')) {
                userMessage += "The paper content is too long. Please provide a shorter abstract or summary.";
            } else if (errorMessage.includes('OPENROUTER_API_KEY')) {
                userMessage += "API configuration error. Please contact support.";
            } else if (errorMessage.includes('timeout')) {
                userMessage += "The analysis took too long. Please try again.";
            } else if (errorMessage.includes('rate_limit')) {
                userMessage += "Too many requests. Please wait a moment and try again.";
            } else {
                userMessage += "An unexpected error occurred. Please try again later.";
            }

            callback(
                { text: userMessage },
                []
            );
        }
    }
};