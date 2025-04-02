# Test Directory Structure

This directory contains all test files for the project, organized by language and type.

## Directory Structure

```
tests/
├── typescript/                 # TypeScript tests
│   ├── services/              # Service tests
│   │   ├── research/         # Research-related tests
│   │   ├── voice/           # Voice/TTS tests
│   │   ├── image/           # Image generation tests
│   │   └── storage/         # Storage tests
│   ├── actions/             # Action tests
│   └── utils/               # Utility tests
├── python/                   # Python tests
│   ├── services/            # Service tests
│   │   ├── video/          # Video integration tests
│   │   └── audio/          # Audio processing tests
│   └── utils/              # Utility tests
├── mocks/                   # Consolidated mocks
│   ├── typescript/         # TS-specific mocks
│   └── python/            # Python-specific mocks
└── fixtures/               # Test fixtures
    ├── typescript/        # TS-specific fixtures
    └── python/           # Python-specific fixtures
```

## Test Types

1. **Unit Tests**
   - Test individual components in isolation
   - Mock external dependencies
   - Fast execution
   - High coverage

2. **Integration Tests**
   - Test component interactions
   - Use real dependencies where appropriate
   - Slower execution
   - Focus on critical paths

3. **End-to-End Tests**
   - Test complete workflows
   - Use real services
   - Slowest execution
   - Focus on user scenarios

4. **Performance Tests**
   - Test system under load
   - Measure response times
   - Resource usage monitoring
   - Scalability testing

## Running Tests

### TypeScript Tests
```bash
# Run all TypeScript tests
npm test

# Run specific test file
npm test -- src/tests/typescript/services/voice/voice.service.test.ts

# Run tests with coverage
npm test -- --coverage
```

### Python Tests
```bash
# Run all Python tests
pytest

# Run specific test file
pytest src/tests/python/services/video/test_video_integration.py

# Run tests with coverage
pytest --cov=src
```

## Test Guidelines

1. **Naming Conventions**
   - TypeScript: `*.test.ts`
   - Python: `test_*.py`

2. **Test Structure**
   - Use descriptive test names
   - Group related tests
   - Follow the pattern: Arrange, Act, Assert
   - Clean up after tests

3. **Mocking**
   - Use mocks for external services
   - Keep mocks in dedicated directories
   - Document mock behavior

4. **Fixtures**
   - Share common test data
   - Keep fixtures up to date
   - Use appropriate scope

5. **Coverage**
   - Aim for high test coverage
   - Focus on critical paths
   - Include error cases

## Adding New Tests

1. Create test file in appropriate directory
2. Follow naming conventions
3. Use existing patterns and utilities
4. Add necessary mocks and fixtures
5. Update documentation if needed

## Continuous Integration

Tests are automatically run on:
- Pull requests
- Merges to main
- Scheduled runs

## Troubleshooting

1. **Test Failures**
   - Check test logs
   - Verify dependencies
   - Update mocks if needed

2. **Coverage Issues**
   - Review uncovered code
   - Add missing test cases
   - Update test configuration

3. **Performance Issues**
   - Optimize test setup
   - Use appropriate test types
   - Monitor resource usage 