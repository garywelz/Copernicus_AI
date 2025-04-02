export interface ScriptAnalysis {
    feedback: string;
    suggestions: string[];
    references: string[];
}
export declare class NotebookLMService {
    private static instance;
    private constructor();
    static getInstance(): NotebookLMService;
    analyzeScript(script: string): Promise<ScriptAnalysis>;
}
