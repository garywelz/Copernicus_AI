import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config();
const test = `test ${process.env.TEST}`
async function testOpenRouter() {
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    { role: 'user', content: 'Hello, this is a test message. Please respond with "Test successful!"' }
                ]
            })
        });
        const data = await response.json();
        console.log('API Response:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

testOpenRouter();