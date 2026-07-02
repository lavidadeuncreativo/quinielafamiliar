import { expect, test } from "@playwright/test";

test("public dashboard loads without an account", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Resumen general" })).toBeVisible();
  await expect(page.getByText("$1,800")).toBeVisible();
  await expect(page.getByRole("link", { name: /Ver detalle/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Israel Cabrera" })).toBeVisible();
});

test("public table is read-only", async ({ page }) => {
  await page.goto("/tabla");

  await expect(page.getByRole("heading", { name: "Tabla completa" })).toBeVisible();
  await expect(page.locator("main form")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /guardar|registrar|recalcular|entrar/i })).toHaveCount(0);
});
