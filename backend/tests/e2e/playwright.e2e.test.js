// tests/e2e/playwright.e2e.test.js
const { test, expect } = require('@playwright/test');

test('should visit homepage and check if "Hello, world!" is displayed', async ({ page }) => {
  // Accéder à la page d'accueil
  await page.goto('http://localhost:3000'); // Remplace par l'URL correcte de ton app

  // Vérifier la présence du texte "Hello, world!" sur la page
  const helloText = await page.locator('text=Hello World !');
  await expect(helloText).toBeVisible(); // Vérifie si le texte est visible
});
