import { test, expect } from "@playwright/test";

test.describe("Flujo End-to-End: Gestión de Solicitudes Internas", () => {
  test("Debería crear una solicitud y verla en el detalle", async ({
    page,
  }) => {
    await page.goto("http://localhost:3000/");

    // 🔐 Simular login
    await page.evaluate(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          name: "Miguel",
          lastName: "Cárdenas",
          area: {
            id: 1,
            description: "Sistemas",
          },
          role: "Administrador",
        }),
      );
    });

    await page.goto("http://localhost:3000/page/modules/requests/create");
    await expect(page.getByText("Título")).toBeVisible();

    await page.fill('input[name="title"]', "Solicitud de Servidor VPS - E2E");
    await page.fill(
      'textarea[name="description"]',
      "Sustento técnico automatizado mediante Playwright.",
    );
    await page.selectOption('select[name="category"]', { index: 1 });
    await page.selectOption('select[name="priority"]', { label: "Alta" });
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/requests/);

    await page.click("text=Solicitud de Servidor VPS - E2E");
    await expect(page.locator("h1")).toContainText(
      "Solicitud de Servidor VPS - E2E",
    );
  });
});
