import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import { XMLParser } from 'fast-xml-parser';

dotenv.config();

const test = async () => {
    const baseUrl = 'http://export.arxiv.org/api/query?';

    const params = new URLSearchParams({
        search_query: 'cat:cs.AI',
        max_results: '5',
        sortBy: 'lastUpdatedDate',
        sortOrder: 'descending'
    });

    try {
        console.log('Fetching recent AI papers from arXiv...\n');
        const response = await fetch(baseUrl + params);
        const data = await response.text();

        // Parse XML
        const parser = new XMLParser();
        const result = parser.parse(data);

        // Extract and display papers
        const entries = result.feed.entry;
        console.log('Recent AI Papers:\n');
        entries.forEach((paper, index) => {
            console.log(`Paper ${index + 1}:`);
            console.log(`Title: ${paper.title}`);
            console.log(`Authors: ${Array.isArray(paper.author) ?
                paper.author.map(a => a.name).join(', ') :
                paper.author.name}`);
            console.log(`Published: ${paper.published}`);
            console.log(`Link: ${paper.id}`);
            console.log('---\n');
        });

        return {
            success: true,
            status: response.status,
            paperCount: entries.length
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Run the test
test().then(result => {
    console.log('\nTest complete with result:', result.success ? 'SUCCESS' : 'FAILURE');
    if (result.success) {
        console.log(`Retrieved ${result.paperCount} papers`);
    }
    process.exit(0);
});