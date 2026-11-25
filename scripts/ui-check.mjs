import puppeteer from 'puppeteer-core';

const executablePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = process.env.APP_URL || 'http://127.0.0.1:4173/';
const browser = await puppeteer.launch({
  headless: 'new',
  executablePath,
  args: ['--no-sandbox', '--disable-gpu'],
  userDataDir: '/tmp/mps-puppeteer-profile'
});

async function check(page, label) {
  const info = await page.evaluate(() => {
    const overflowing = [...document.querySelectorAll('body *')]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > window.innerWidth + 2;
      })
      .slice(0, 8)
      .map((el) => ({ tag: el.tagName, cls: String(el.className).slice(0, 60), right: Math.round(el.getBoundingClientRect().right) }));
    return {
      innerWidth: window.innerWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      overflowing
    };
  });
  console.log(label, JSON.stringify(info));
}

const errors = [];
const page = await browser.newPage();
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 900));
await check(page, 'desktop');
await page.screenshot({ path: '/tmp/mps-desktop.png' });
await page.click('.generate-btn');
await page.waitForSelector('.result-head', { timeout: 20000 });
await new Promise((r) => setTimeout(r, 900));
console.log('result title:', await page.$eval('.result-head h2', (el) => el.textContent?.trim()));
console.log('prompt chars:', await page.$eval('.prompt-block pre', (el) => el.textContent?.length));
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: '/tmp/mps-result.png' });
const panel = await page.$('.result-panel');
if (panel) await panel.screenshot({ path: '/tmp/mps-result-panel.png' });
await page.click('.top-actions .top-btn:nth-of-type(2)');
await page.waitForSelector('.settings-modal', { timeout: 5000 });
await new Promise((r) => setTimeout(r, 300));
await page.screenshot({ path: '/tmp/mps-settings.png' });
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 300));
await page.click('.top-actions .top-btn:nth-of-type(1)');
await page.waitForSelector('.history-drawer', { timeout: 5000 });
await new Promise((r) => setTimeout(r, 300));
await page.screenshot({ path: '/tmp/mps-history.png' });

const mobile = await browser.newPage();
await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await mobile.goto(url, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 900));
await check(mobile, 'mobile');
await mobile.screenshot({ path: '/tmp/mps-mobile2.png' });
await mobile.click('.generate-btn');
await mobile.waitForSelector('.result-head', { timeout: 20000 });
await new Promise((r) => setTimeout(r, 700));
await check(mobile, 'mobile-result');
await mobile.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 400));
await mobile.screenshot({ path: '/tmp/mps-mobile-result.png', fullPage: false });
const mpanel = await mobile.$('.result-panel');
if (mpanel) await mpanel.screenshot({ path: '/tmp/mps-mobile-result-panel.png' });

console.log('errors:', errors.length ? errors : 'none');
await browser.close();
