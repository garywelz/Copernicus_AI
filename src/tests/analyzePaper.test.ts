// src/tests/analyzePaper.test.ts
import { analyzePaperAction } from '../actions/analyzePaper.js';
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';
import dotenv from 'dotenv';
import { IAgentRuntime } from '@elizaos/core';

dotenv.config();

const mockRuntime: Partial<IAgentRuntime> = {
    character: {
        settings: {
            secrets: {
                OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY
            }
        }
    },
    storeMemory: async () => {},
    logger: console
};

async function analyzePaper(arxivId: string, description: string) {
    try {
        const response = await fetch(`http://export.arxiv.org/api/query?id_list=${arxivId}`);
        const xmlData = await response.text();

        const parser = new XMLParser();
        const result = parser.parse(xmlData);
        const entry = result.feed.entry;

        const paperDetails = {
            title: entry.title,
            authors: Array.isArray(entry.author) 
                ? entry.author.map(a => a.name)
                : [entry.author.name],
            content: entry.summary
        };

        console.log(`\n=== Testing Paper: ${description} ===\n`);
        console.log('Paper details:', paperDetails);

        await analyzePaperAction.handler(
            mockRuntime as IAgentRuntime,
            { content: paperDetails },
            {}, 
            {}, 
            (response, _memories) => {
                console.log('\nAnalysis Response:', response);
            }
        );

    } catch (error) {
        console.error(`Error analyzing paper (${description}):`, error);
        if (error instanceof Error) {
            console.error('Full error details:', {
                message: error.message,
                stack: error.stack
            });
        }
    }
}

async function testErrorCases() {
    console.log('\n=== Testing Error Cases ===\n');

    // Test Case 1: Missing API Key
    const runtimeNoKey: Partial<IAgentRuntime> = {
        character: { settings: { secrets: {} } },
        storeMemory: async () => {},
        logger: console
    };

    await analyzePaperAction.handler(
        runtimeNoKey as IAgentRuntime,
        { content: { title: 'Test', authors: ['Test'], content: 'Test' } },
        {}, 
        {}, 
        (response, _memories) => {
            console.log('No API Key Test Response:', response);
        }
    );

    // Test Case 2: Invalid paper content
    await analyzePaperAction.handler(
        mockRuntime as IAgentRuntime,
        { content: { } },
        {}, 
        {}, 
        (response, _memories) => {
            console.log('Invalid Content Test Response:', response);
        }
    );

    // Test Case 3: Very long content
    await analyzePaperAction.handler(
        mockRuntime as IAgentRuntime,
        { content: { 
            title: 'Long Paper',
            authors: ['Test'],
            content: 'A'.repeat(50000) // Very long content
        } },
        {}, 
        {}, 
        (response, _memories) => {
            console.log('Long Content Test Response:', response);
        }
    );
}

async function runAllTests() {
    // Regular paper tests
    await analyzePaper('2501.05443', 'Cyber Abuse Detection');
    await analyzePaper('2002.07953', 'Domain Adaptation');
    await analyzePaper('1810.04805', 'BERT'); // Adding a more complex ML paper

    // Error case tests
    await testErrorCases();
    
    console.log('\n=== All Tests Completed ===\n');
}

runAllTests().catch(console.error);