import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/lessons",
  "/lessons/guitar",
  "/lessons/voice",
  "/lessons/production",
  "/lessons/audio-engineering",
  "/studio",
  "/studio/mixing",
  "/studio/mastering",
  "/studio/recording",
  "/studio/consultation",
  "/studio/mix-master-bundle",
  "/about",
  "/contact",
  "/blog",
  "/terms",
  "/privacy",
];

for (const route of routes) {
  test(`${route} loads with one H1`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });
}

test("/services redirects to /studio", async ({ page }) => {
  await page.goto("/services");
  await expect(page).toHaveURL(/\/studio$/);
});

test("theme toggle switches the theme", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  const before = await html.getAttribute("data-theme");
  await page.getByRole("button", { name: /switch to (light|dark) mode/i }).click();
  await expect(html).not.toHaveAttribute("data-theme", before ?? "");
});

test("contact form submits with the API mocked", async ({ page }) => {
  let payload: Record<string, unknown> | null = null;
  await page.route("**/api/contact", async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ json: { ok: true } });
  });

  await page.goto("/contact?service=lessons");
  await page.getByLabel("Name", { exact: true }).fill("Test Person");
  await page.getByLabel("Email").fill("test@example.com");
  await page.getByLabel("Message").fill("Hello, I'd like a trial lesson.");
  // The form rejects submissions faster than a person could type them.
  await page.waitForTimeout(2500);
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("status")).toContainText("Thanks for reaching out");
  expect(payload).toMatchObject({ service: "lessons", email: "test@example.com" });
});
