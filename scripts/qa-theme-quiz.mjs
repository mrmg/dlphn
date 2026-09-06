import { chromium } from 'playwright';

const BASE = process.env.QA_BASE || 'http://127.0.0.1:3018';
const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` — ${detail}` : ''}`);
}

const toneWav = (() => {
  const sampleRate = 8000;
  const seconds = 1;
  const n = sampleRate * seconds;
  const data = Buffer.alloc(44 + n);
  data.write('RIFF', 0);
  data.writeUInt32LE(36 + n, 4);
  data.write('WAVE', 8);
  data.write('fmt ', 12);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(1, 22);
  data.writeUInt32LE(sampleRate, 24);
  data.writeUInt32LE(sampleRate, 28);
  data.writeUInt16LE(1, 32);
  data.writeUInt16LE(8, 34);
  data.write('data', 36);
  data.writeUInt32LE(n, 40);
  for (let i = 0; i < n; i += 1) data[44 + i] = 128 + Math.round(100 * Math.sin((i / sampleRate) * 440 * 2 * Math.PI));
  return data;
})();

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.route('**/theme-quiz/qa-fixture-v1/*', (route) => route.fulfill({ status: 200, contentType: 'audio/wav', body: toneWav }));
  const audioRequests = [];
  page.on('request', (r) => {
    if (r.url().includes('/theme-quiz/')) audioRequests.push(r.url());
  });
  await page.goto(`${BASE}/?themeQuizPreview=1`, { waitUntil: 'load' });
  check('homepage loads with preview', true);
  const launcher = page.locator('.theme-quiz-launcher-btn');
  check('launcher visible in preview', (await launcher.count()) === 1);
  const hidden = await page.locator('.theme-quiz-launcher').evaluate((el) => el.hidden).catch(() => null);
  check('launcher not hidden when eligible', hidden === false);
  await launcher.click();
  await page.waitForSelector('#themeQuizDialog', { timeout: 5000 });
  check('dialog opens on launch', true);
  const qText = await page.locator('.theme-quiz-q').first().textContent().catch(() => '');
  check('question heading shown', String(qText).includes('TV show'));
  await page.locator('.theme-quiz-opt input').first().check();
  const lockEnabled = await page.locator('.theme-quiz-primary').first().isEnabled().catch(() => false);
  check('lock enabled after selection', lockEnabled === true);
  await page.locator('.theme-quiz-primary').first().click();
  const fb = await page.locator('.theme-quiz-feedback').first().textContent().catch(() => '');
  check('reveal after lock', fb.length > 0, fb.slice(0, 60));
  const next = page.locator('.theme-quiz-foot .theme-quiz-primary').first();
  check('next offered', (await next.count()) === 1);
  await page.screenshot({ path: '/tmp/dlphn-qa-question.png' });
  await page.keyboard.press('Escape');
  check('escape closes', (await page.locator('#themeQuizDialog[open]').count()) === 0);
  await page.goto(`${BASE}/`, { waitUntil: 'load' });
  audioRequests.length = 0;
  await page.waitForTimeout(1500);
  const prodHidden = await page.locator('.theme-quiz-launcher').evaluate((el) => el.hidden).catch(() => true);
  check('production disabled hides launcher', prodHidden === true);
  check('disabled makes zero theme audio requests', audioRequests.filter((u) => u.includes('/theme-quiz/')).length === 0, `${audioRequests.length} requests`);
  const failed = results.filter((r) => !r.ok);
  if (failed.length) process.exitCode = 1;
} finally {
  await browser.close();
}
