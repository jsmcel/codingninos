import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { challenges, courseModules } from "../src/challenges.js";

const url = process.env.COURSE_URL || "http://127.0.0.1:5173";
const outDir = path.resolve("output/playwright/course");
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
await context.addInitScript(() => {
  localStorage.clear();
});
const page = await context.newPage();
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (error) => errors.push(String(error)));

await page.goto(url, { waitUntil: "domcontentloaded" });
await page.waitForSelector("[data-command-id='start']");
await page.screenshot({ path: path.join(outDir, "00-home.png"), fullPage: true });

for (let index = 0; index < challenges.length; index += 1) {
  const challenge = challenges[index];
  const module = courseModules.find((item) => item.id === challenge.moduleId);
  const moduleButton = page.locator(`[data-module-id="${module.id}"]`);
  await moduleButton.waitFor({ state: "visible" });
  const moduleLocked = await moduleButton.evaluate((node) => node.disabled);
  if (moduleLocked) {
    throw new Error(`Module stayed locked: ${module.id}`);
  }
  await moduleButton.click();

  const levelButton = page.locator(`[data-level-id="${challenge.id}"]`);
  await levelButton.waitFor({ state: "visible" });
  const levelLocked = await levelButton.evaluate((node) => node.disabled);
  if (levelLocked) {
    throw new Error(`Level stayed locked: ${challenge.id}`);
  }
  await levelButton.click();

  const startStoryButton = page.getByRole("button", { name: "Empezar reto" });
  if (await startStoryButton.isVisible().catch(() => false)) {
    await startStoryButton.click();
  }

  const clearButton = page.getByRole("button", { name: "Limpiar" });
  await clearButton.click();
  const hintButton = page.getByRole("button", { name: "Anadir pista" });
  for (let step = 0; step < challenge.solution.length; step += 1) {
    await hintButton.click();
  }

  await page.getByRole("button", { name: "Ejecutar" }).click();
  await page.evaluate(() => {
    if (typeof window.advanceTime === "function") window.advanceTime(30000);
  });
  await page.waitForFunction(
    (expectedId) => {
      const state = JSON.parse(window.render_game_to_text());
      return state.level.id === expectedId && state.success === true;
    },
    challenge.id,
    { timeout: 8000 },
  );

  if (index === 0 || index === challenges.length - 1 || challenge.order === 10) {
    const padded = String(challenge.order).padStart(2, "0");
    await page.screenshot({
      path: path.join(outDir, `${padded}-${challenge.id}.png`),
      fullPage: true,
    });
  }

  if (index < challenges.length - 1) {
    const next = challenges[index + 1];
    await page.waitForFunction(
      (nextId) => {
        const button = document.querySelector(`[data-level-id="${nextId}"]`);
        const moduleButton = document.querySelector(
          `[data-module-id="${window.__nextModuleIdForVerify || ""}"]`,
        );
        return (button && !button.disabled) || (moduleButton && !moduleButton.disabled);
      },
      next.id,
      { timeout: 8000 },
    ).catch(async () => {
      const nextModule = courseModules.find((item) => item.id === next.moduleId);
      const unlocked = await page
        .locator(`[data-module-id="${nextModule.id}"]`)
        .evaluate((node) => !node.disabled);
      if (!unlocked) throw new Error(`Next module stayed locked: ${nextModule.id}`);
    });
  }
}

const finalState = await page.evaluate(() => JSON.parse(window.render_game_to_text()));
fs.writeFileSync(path.join(outDir, "final-state.json"), JSON.stringify(finalState, null, 2));
if (errors.length) {
  fs.writeFileSync(path.join(outDir, "console-errors.json"), JSON.stringify(errors, null, 2));
  throw new Error(`Console errors detected: ${errors.length}`);
}

await browser.close();
console.log(`Verified ${challenges.length} levels. Artifacts: ${outDir}`);
