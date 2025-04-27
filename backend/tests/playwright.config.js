// tests/playwright.config.js
module.exports = {
    use: {
      baseURL: 'http://localhost:3000',
      headless: true,
    },
    testDir: './tests',  // Spécifie le répertoire des tests E2E
    timeout: 30000,
  };
  