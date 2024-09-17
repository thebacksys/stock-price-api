module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    moduleFileExtensions: ['js', 'json', 'node'],
    testPathIgnorePatterns: ['/node_modules/'],
    verbose: true
};