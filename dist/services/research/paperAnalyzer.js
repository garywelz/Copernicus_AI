"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePaper = analyzePaper;
const OpenRouterService_1 = require("./llm/OpenRouterService");
async function analyzePaper(paper, options) {
    const llm = new OpenRouterService_1.OpenRouterService(process.env.OPENROUTER_API_KEY || '');
    const prompt = `Analyze this research paper:
Title: ${paper.title}
Authors: ${paper.authors.join(', ')}
Content: ${paper.content}

Provide a ${options?.depth || 'quick'} analysis with ${options?.outputFormat || 'summary'} format.`;
    const response = await llm.generateStructuredOutput(prompt, {
        type: 'object',
        properties: {
            summary: { type: 'string' },
            keyPoints: { type: 'array', items: { type: 'string' } }
        }
    });
    return response;
}
//# sourceMappingURL=paperAnalyzer.js.map