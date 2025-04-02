import { RESEARCH_SOURCES } from '../config/sources/sources';
import { AuthService } from '../services/research/AuthService';
import chalk from 'chalk';

async function testApiKeys() {
  console.log(chalk.blue('\nTesting Research API Keys...\n'));

  const authService = AuthService.getInstance();
  const results: { source: string; status: boolean; error?: string }[] = [];

  for (const source of RESEARCH_SOURCES) {
    try {
      process.stdout.write(`Testing ${source.name}... `);
      
      if (!source.requiresAuth) {
        console.log(chalk.gray('No auth required ✓'));
        results.push({ source: source.name, status: true });
        continue;
      }

      const isValid = await authService.validateApiKey(source);
      
      if (isValid) {
        console.log(chalk.green('Valid ✓'));
        results.push({ source: source.name, status: true });
      } else {
        console.log(chalk.red('Invalid ✗'));
        results.push({ 
          source: source.name, 
          status: false, 
          error: 'Invalid or missing API key' 
        });
      }
    } catch (error) {
      console.log(chalk.red('Error ✗'));
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
  const totalAuthRequired = RESEARCH_SOURCES.filter(s => s.requiresAuth).length;
  
  results.forEach(result => {
    const icon = result.status ? '✓' : '✗';
    const color = result.status ? chalk.green : chalk.red;
    console.log(color(`${icon} ${result.source}${result.error ? `: ${result.error}` : ''}`));
  });

  console.log('\nStatistics:');
  console.log('-----------');
  console.log(`Total sources: ${RESEARCH_SOURCES.length}`);
  console.log(`Sources requiring auth: ${totalAuthRequired}`);
  console.log(`Valid auth configs: ${validCount}`);

  const missingKeys = authService.getMissingApiKeys();
  if (missingKeys.length > 0) {
    console.log('\nMissing API Keys:');
    console.log('----------------');
    missingKeys.forEach(key => {
      console.log(chalk.yellow(`- ${key}`));
    });
  }
}

// Run the tests
testApiKeys().catch(error => {
  console.error(chalk.red('\nError running tests:'), error);
  process.exit(1);
}); 