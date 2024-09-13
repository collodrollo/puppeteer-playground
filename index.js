import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

// Launch the browser and open a new blank page
const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();

// Navigate the page to a URL.
await page.goto('http://www.ufcstats.com/statistics/events/completed?page=all');

const eventLinkElems = await page.$$('a[href*=event-details]')
const eventLinks = await Promise.all(eventLinkElems.map(link => link.evaluate(x => x.href)))

// loop over every event
for (const link of eventLinks.slice(1)) {
  await page.goto(link);
  const fightLinkElems = await page.$$('.b-fight-details__table-row__hover');
  const elem = fightLinkElems[0];
  const elemData = await elem.$$('.b-fight-details__table-text')
  console.log(await elemData[1].evaluate(x => x.textContent))
  const fightLinks = await Promise.all(fightLinkElems.map(link => link.evaluate(x => x.getAttribute('data-link'))));
  console.log(fightLinks)
  // loop over every fight
  for (const fightLink of fightLinks) {
    await page.goto(fightLink);

  }
}




// Set screen size.
// await page.setViewport({width: 1080, height: 1024});

// Type into search box.
await page.locator('.devsite-search-field').fill('automate beyond recorder');

// Wait and click on first result.
await page.locator('.devsite-result-item-link').click();

// Locate the full title with a unique string.
const textSelector = await page
  .locator('text/Customize and automate')
  .waitHandle();
const fullTitle = await textSelector?.evaluate(el => el.textContent);

// Print the full title.
console.log('The title of this blog post is "%s".', fullTitle);

await browser.close();
