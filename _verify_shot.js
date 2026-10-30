const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: 'old',
    args: ['--disable-gpu', '--no-sandbox', '--hide-scrollbars'],
    defaultViewport: { width: 1440, height: 900 },
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8124/modify2/index.html', { waitUntil: 'networkidle0', timeout: 60000 });
  await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important} *{animation:none!important;transition:none!important}' });
  await new Promise(r => setTimeout(r, 1500));

  // 校验 works 背景已延展为 anker 图、padding-bottom 为 0、两个区块分隔线存在
  const diag = await page.evaluate(() => {
    const works = document.querySelector('.works');
    const cs = getComputedStyle(works);
    const ph = document.querySelector('.section--photography');
    const before = getComputedStyle(works, '::before');
    const phBefore = getComputedStyle(ph, '::before');
    return {
      worksBg: cs.backgroundImage,
      worksPadBottom: cs.paddingBottom,
      worksBeforeW: before.width,
      phBeforeW: phBefore.width,
      phBeforeTop: phBefore.top,
    };
  });
  console.log(JSON.stringify(diag, null, 2));

  // 截图供查看：作品集入口、摄影入口
  for (const [id, name] of [['works','_v_works_top'],['photography','_v_photo_top']]) {
    await page.evaluate((id) => {
      const el = document.getElementById(id) || document.querySelector('.' + id);
      const y = el.getBoundingClientRect().top + window.scrollY - 200;
      window.scrollTo(0, y);
    }, id);
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: `${name}.png` });
    console.log('shot', name);
  }
  await browser.close();
})();
