"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sources_1 = require("../config/sources/sources");
const AuthService_1 = require("../services/research/AuthService");
const chalk_1 = __importDefault(require("chalk"));
async function testApiKeys() {
    console.log(chalk_1.default.blue('\nTesting Research API Keys...\n'));
    const authService = AuthService_1.AuthService.getInstance();
    const results = [];
    for (const source of sources_1.RESEARCH_SOURCES) {
        try {
            process.stdout.write(`Testing ${source.name}... `);
            if (!source.requiresAuth) {
                console.log(chalk_1.default.gray('No auth required ✓'));
                results.push({ source: source.name, status: true });
                continue;
            }
            const isValid = await authService.validateApiKey(source);
            if (isValid) {
                console.log(chalk_1.default.green('Valid ✓'));
                results.push({ source: source.name, status: true });
            }
            else {
                console.log(chalk_1.default.red('Invalid ✗'));
                results.push({
                    source: source.name,
                    status: false,
                    error: 'Invalid or missing API key'
                });
            }
        }
        catch (error) {
            console.log(chalk_1.default.red('Error ✗'));
            results.push({
                source: source.name,
                status: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    console.log('\nSummary:');
    console.log('--------');
    const validCount = results.filter(r => r.status).length;
    const totalAuthRequired = sources_1.RESEARCH_SOURCES.filter(s => s.requiresAuth).length;
    results.forEach(result => {
        const icon = result.status ? '✓' : '✗';
        const color = result.status ? chalk_1.default.green : chalk_1.default.red;
        console.log(color(`${icon} ${result.source}${result.error ? `: ${result.error}` : ''}`));
    });
    console.log('\nStatistics:');
    console.log('-----------');
    console.log(`Total sources: ${sources_1.RESEARCH_SOURCES.length}`);
    console.log(`Sources requiring auth: ${totalAuthRequired}`);
    console.log(`Valid auth configs: ${validCount}`);
    const missingKeys = authService.getMissingApiKeys();
    if (missingKeys.length > 0) {
        console.log('\nMissing API Keys:');
        console.log('----------------');
        missingKeys.forEach(key => {
            console.log(chalk_1.default.yellow(`- ${key}`));
        });
    }
}
// Run the tests
testApiKeys().catch(error => {
    console.error(chalk_1.default.red('\nError running tests:'), error);
    process.exit(1);
});
//# sourceMappingURL=test_apis.js.map