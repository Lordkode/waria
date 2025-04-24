const { test, expect } = require('@playwright/test');

test('should visit homepage and check if "Hello, world!" is displayed', async ({ page }) => {
  await page.goto('http://localhost:3000'); // Accède à la route "/"
  
  // Vérifie si le texte "Hello, world!" est présent sur la page
  const helloText = await page.locator('text=Hello World !'); // Sélecteur basé sur le texte
  await expect(helloText).toBeVisible(); // Vérifie si le texte est visible
});
