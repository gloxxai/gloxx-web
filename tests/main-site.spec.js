import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════
// MAIN SITE — index.html
// ═══════════════════════════════════════

test.describe('Main Site', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // ─── PAGE LOAD ───
  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Gloxx/);
  });

  test('has no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  // ─── HERO ───
  test('hero section is visible', async ({ page }) => {
    await expect(page.locator('#hero')).toBeVisible();
  });

  test('hero title renders fractional-QA-team headline', async ({ page }) => {
    const hero = page.locator('.hero-title');
    await expect(hero).toBeVisible();
    await expect(hero).toContainText('A fractional QA team');
    await expect(hero).toContainText('software companies');
  });

  test('hero primary CTA routes to Cal.com, secondary to assessment', async ({ page }) => {
    const primary = page.locator('.hero-cta-primary');
    const secondary = page.locator('.hero-cta-secondary');
    await expect(primary).toBeVisible();
    await expect(primary).toHaveAttribute('href', 'https://cal.com/gloxx/30min');
    await expect(primary).toHaveAttribute('target', '_blank');
    await expect(secondary).toHaveAttribute('href', 'institute/assessment.html');
  });

  test('hero tagline shows the price', async ({ page }) => {
    await expect(page.locator('.hero-tag')).toBeVisible();
    await expect(page.locator('.hero-tag')).toContainText('$15,000/mo');
  });

  test('hero subtitle is visible', async ({ page }) => {
    await expect(page.locator('.hero-sub')).toBeVisible();
  });

  test('gradient text has correct styling', async ({ page }) => {
    const gradient = page.locator('.gradient-text').first();
    await expect(gradient).toBeVisible();
  });

  // ─── NAVIGATION ───
  test('nav is visible', async ({ page }) => {
    await expect(page.locator('.nav')).toBeVisible();
  });

  test('nav logo renders the Gloxx wordmark image', async ({ page }) => {
    const img = page.locator('.nav-logo img');
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute('alt', 'Gloxx');
    await expect(img).toHaveAttribute('src', /gloxx-logo.*\.png/);
  });

  test('nav links exist', async ({ page, viewport }) => {
    if (viewport.width > 768) {
      // Services, Approach, Bench, About, Contact, Book a call (CTA)
      await expect(page.locator('.nav-links a')).toHaveCount(6);
    }
  });

  test('nav gets scrolled class on scroll', async ({ page }) => {
    const nav = page.locator('.nav');
    await expect(nav).not.toHaveClass(/scrolled/);
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(300);
    await expect(nav).toHaveClass(/scrolled/);
  });

  test('nav links point to expected pages', async ({ page, viewport }) => {
    if (viewport.width <= 768) return;
    const links = page.locator('.nav-links a:not(.nav-cta-link)');
    const hrefs = await links.evaluateAll(els => els.map(el => el.getAttribute('href')));
    expect(hrefs).toEqual(['services.html', 'approach.html', 'institute/', 'about.html', 'contact.html']);
  });

  // ─── MOBILE NAV ───
  test('hamburger menu works on mobile', async ({ page, viewport }) => {
    if (viewport.width > 768) return;
    const ham = page.locator('#navHam');
    const mob = page.locator('#mobMenu');
    await expect(ham).toBeVisible();
    // Menu starts hidden (opacity 0, pointer-events none)
    await expect(mob).toHaveCSS('opacity', '0');
    await ham.click();
    await page.waitForTimeout(500);
    await expect(mob).toHaveCSS('opacity', '1');
    await ham.click();
    await page.waitForTimeout(500);
    await expect(mob).toHaveCSS('opacity', '0');
  });

  // ─── WHAT WE DO ───
  test('what-we-do section has 3 offer cards', async ({ page }) => {
    await page.locator('#what-we-do').scrollIntoViewIfNeeded();
    await expect(page.locator('.wwd-card')).toHaveCount(3);
  });

  test('what-we-do cards surface retainer / team / specialty metadata', async ({ page }) => {
    await page.locator('#what-we-do').scrollIntoViewIfNeeded();
    const metas = page.locator('.wwd-card .wwd-meta');
    await expect(metas).toHaveCount(3);
    await expect(metas.nth(0)).toContainText('$15,000');
    await expect(metas.nth(1)).toContainText('Founder-led');
    await expect(metas.nth(2)).toContainText('Specialty');
  });

  // ─── WHO WE WORK WITH ───
  test('who-we-serve strip lists 5 segments', async ({ page }) => {
    await page.locator('#who-we-serve').scrollIntoViewIfNeeded();
    await expect(page.locator('.wws-strip span')).toHaveCount(5);
  });

  test('who-we-serve covers software companies + AI specialty', async ({ page }) => {
    await page.locator('#who-we-serve').scrollIntoViewIfNeeded();
    const strip = page.locator('.wws-strip');
    await expect(strip).toContainText('Software companies');
    await expect(strip).toContainText('AI-native teams');
  });

  // ─── WHY GLOXX ───
  test('why-gloxx section has 3 reason cards', async ({ page }) => {
    await page.locator('#why-gloxx').scrollIntoViewIfNeeded();
    await expect(page.locator('.why-card')).toHaveCount(3);
  });

  test('why-gloxx cards are numbered 01/02/03', async ({ page }) => {
    await page.locator('#why-gloxx').scrollIntoViewIfNeeded();
    const nums = page.locator('.why-card .why-num');
    await expect(nums.nth(0)).toContainText('01');
    await expect(nums.nth(1)).toContainText('02');
    await expect(nums.nth(2)).toContainText('03');
  });

  // ─── CTA ───
  test('CTA section has email and button', async ({ page }) => {
    await page.locator('#cta').scrollIntoViewIfNeeded();
    await expect(page.locator('.cta-email')).toBeVisible();
    await expect(page.locator('#cta .btn-mag')).toBeVisible();
  });

  test('CTA email links to mailto', async ({ page }) => {
    const email = page.locator('.cta-email');
    await expect(email).toHaveAttribute('href', 'mailto:hello@gloxx.ai');
  });

  // ─── FOOTER ───
  test('footer shows copyright', async ({ page }) => {
    await expect(page.locator('.footer-copy')).toContainText('2026 Gloxx');
  });

  test('footer has social links', async ({ page }) => {
    const links = page.locator('.footer-links a');
    await expect(links).toHaveCount(5);
    await expect(links).toContainText(['Facebook', 'X', 'GitHub', 'YouTube', 'LinkedIn']);
  });

  test('footer tagline shows', async ({ page }) => {
    await expect(page.locator('.footer-tag')).toContainText('Methodology in practice.');
  });

  // ─── CTA ROUTING ───
  // All "Book a call" CTAs route externally to cal.com/gloxx/30min.
  // The contact.html intake form remains for "I have a longer message" flow.
  test('nav CTA routes to Cal.com', async ({ page }) => {
    const cta = page.locator('.nav-cta-link');
    await expect(cta).toHaveAttribute('href', 'https://cal.com/gloxx/30min');
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('rel', /noopener/);
  });

  test('bottom CTA routes to Cal.com', async ({ page }) => {
    const bottomCta = page.locator('#cta .btn-mag');
    await expect(bottomCta).toHaveAttribute('href', 'https://cal.com/gloxx/30min');
    await expect(bottomCta).toHaveAttribute('target', '_blank');
    await expect(bottomCta).toContainText('Book the call');
  });

  // ─── ACCESSIBILITY ───
  test('all images have alt or aria-hidden', async ({ page }) => {
    const imgs = await page.locator('img:not([alt]):not([aria-hidden])').count();
    expect(imgs).toBe(0);
  });

  test('focus-visible styles exist', async ({ page }) => {
    const styles = await page.evaluate(() => {
      const rules = [...document.styleSheets].flatMap(s => {
        try { return [...s.cssRules]; } catch { return []; }
      });
      return rules.some(r => r.cssText?.includes('focus-visible'));
    });
    expect(styles).toBe(true);
  });

  // ─── RESPONSIVE ───
  test('no horizontal overflow', async ({ page }) => {
    const overflows = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth;
    });
    expect(overflows).toBe(true);
  });
});
