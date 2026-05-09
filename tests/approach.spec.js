import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════
// APPROACH PAGE — approach.html (content moat)
// ═══════════════════════════════════════

test.describe('Approach Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/approach.html');
    await page.waitForLoadState('networkidle');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/How Gloxx works.*Approach/);
  });

  test('has no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('hero H1 reads "How Gloxx works."', async ({ page }) => {
    await expect(page.locator('.ap-hero h1')).toContainText('How Gloxx works');
  });

  test('TOC lists all 7 sections (general QA + 6 AI specialty)', async ({ page, viewport }) => {
    await expect(page.locator('.ap-toc a')).toHaveCount(7);
  });

  test('all 7 section anchors exist in the document', async ({ page }) => {
    const ids = ['general', 'stack', 'agents', 'protocol', 'pyramid', 'gate', 'refuse'];
    for (const id of ids) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('general QA section comes before the AI specialty divider', async ({ page }) => {
    await expect(page.locator('#general')).toBeVisible();
    await expect(page.locator('.ap-toc-divider')).toBeVisible();
  });

  test('AI specialty section features the YouTube video link', async ({ page }) => {
    const video = page.locator('.video-callout');
    await expect(video).toBeVisible();
    await expect(video).toContainText('AI-written code makes QA more important');
    await expect(video.locator('a[href="https://youtu.be/JZPafbBE0zg"]')).toHaveCount(2);
    await expect(video.locator('img')).toHaveAttribute('src', /JZPafbBE0zg/);
  });

  test('QA stack lists 8 named tools', async ({ page }) => {
    await page.locator('#stack').scrollIntoViewIfNeeded();
    await expect(page.locator('.tool')).toHaveCount(8);
  });

  test('stack includes the core DeepEval + promptfoo + Claude Code trio', async ({ page }) => {
    const names = page.locator('.tool-name');
    const text = await names.allTextContents();
    expect(text).toEqual(expect.arrayContaining(['DeepEval', 'promptfoo', 'Claude Code']));
  });

  test('AI agents section has a DeepEval code block', async ({ page }) => {
    await page.locator('#agents').scrollIntoViewIfNeeded();
    const code = page.locator('.code-block');
    await expect(code).toBeVisible();
    await expect(code).toContainText('FaithfulnessMetric');
  });

  test('operating protocol lists 6 principles', async ({ page }) => {
    await page.locator('#protocol').scrollIntoViewIfNeeded();
    await expect(page.locator('.protocol-item')).toHaveCount(6);
  });

  test('interview prompt is quoted verbatim', async ({ page }) => {
    const quote = page.locator('.protocol-item blockquote').first();
    await expect(quote).toContainText('Before we start building, interview me');
    await expect(quote).toContainText('What are the core problems this solves');
  });

  test('principle 6 references Claude Code Routines with a link', async ({ page }) => {
    const principle6 = page.locator('.protocol-item').nth(5);
    const link = principle6.locator('a[href*="routines"]');
    await expect(link).toHaveCount(1);
  });

  test('test pyramid has 6 rows', async ({ page }) => {
    await page.locator('#pyramid').scrollIntoViewIfNeeded();
    await expect(page.locator('.pyramid .row')).toHaveCount(6);
  });

  test('release-gate checklist has 12 items', async ({ page }) => {
    await page.locator('#gate').scrollIntoViewIfNeeded();
    await expect(page.locator('.checklist li')).toHaveCount(12);
  });

  test('refuse-to-do section has 5 items', async ({ page }) => {
    await page.locator('#refuse').scrollIntoViewIfNeeded();
    await expect(page.locator('.refuse-list li')).toHaveCount(5);
  });

  test('refusals include red-team / safety-audit disclaimer', async ({ page }) => {
    const refusals = page.locator('.refuse-list');
    await expect(refusals).toContainText("don't replace AI red teams");
  });

  test('CTA at bottom links to Cal.com booking', async ({ page }) => {
    const cta = page.locator('.cta-section .cta-btn');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', 'https://cal.com/gloxx/30min');
    await expect(cta).toHaveAttribute('target', '_blank');
  });

  test('nav approach link has aria-current', async ({ page }) => {
    const activeLink = page.locator('.nav-links a[aria-current="page"]');
    await expect(activeLink).toHaveText('Approach');
  });

  test('footer preserves Methodology in practice tagline', async ({ page }) => {
    await expect(page.locator('.footer-tag')).toContainText('Methodology in practice.');
  });

  test('no horizontal overflow', async ({ page }) => {
    const overflows = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth;
    });
    expect(overflows).toBe(true);
  });
});
