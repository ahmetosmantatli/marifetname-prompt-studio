// Canlı siteyi gerçek anahtarlarla test eder. Kullanım:
// GROQ_API_KEY=... GEMINI_API_KEY=... node scripts/live-provider-test.mjs
import puppeteer from 'puppeteer-core';
const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const url = 'https://ahmetosmantatli.github.io/marifetname-prompt-studio/';
const browser = await puppeteer.launch({ headless: 'new', executablePath, args: ['--no-sandbox','--disable-gpu'], userDataDir: '/tmp/mps-live-test' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

async function setSettings(provider) {
  const isGroq = provider === 'groq';
  await page.evaluate(({ isGroq, groqKey, geminiKey }) => {
    const s = {
      provider: isGroq ? 'groq' : 'gemini',
      groqKey,
      groqModel: 'openai/gpt-oss-20b',
      geminiKey,
      geminiModel: 'gemini-3.5-flash',
      embeddingModel: 'gemini-embedding-001',
      semanticRag: false,
      temperature: 0.85,
      maxOutputTokens: 4096
    };
    localStorage.setItem('mps.settings.v2', JSON.stringify(s));
  }, { isGroq, groqKey: process.env.GROQ_API_KEY, geminiKey: process.env.GEMINI_API_KEY });
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 700));
}

async function generate(label) {
  await page.click('.generate-btn');
  await Promise.race([
    page.waitForSelector('.result-head', { timeout: 90000 }),
    page.waitForSelector('.error-state', { timeout: 90000 })
  ]).catch(() => {});
  await new Promise((r) => setTimeout(r, 1200));
  const state = await page.evaluate(() => ({
    title: document.querySelector('.result-head h2')?.textContent?.trim() || '',
    badge: document.querySelector('.provider-badge')?.textContent?.trim() || '',
    promptChars: document.querySelector('.prompt-block pre')?.textContent?.length || 0,
    error: document.querySelector('.error-message')?.textContent?.trim() || '',
    inlineError: document.querySelector('.inline-error')?.textContent?.trim() || '',
    toast: document.querySelector('.toast')?.textContent?.trim() || '',
    scriptLines: document.querySelectorAll('.script-line').length
  }));
  console.log(label, JSON.stringify(state));
  await page.screenshot({ path: `/tmp/live-${label}.png` });
}

await page.goto(url, { waitUntil: 'networkidle0' });
await setSettings('groq');
await generate('groq');
await setSettings('gemini');
await generate('gemini');
console.log('errors:', errors.length ? errors : 'none');
await browser.close();
