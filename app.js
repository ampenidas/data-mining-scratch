const express = require('express');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth')();
//const blockResourcesPlugin = require('puppeteer-extra-plugin-block-resources')();
const anonymizeuaPlugin = require('puppeteer-extra-plugin-anonymize-ua')();
const adBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
const app = express();
const port = 3000;
const baseUrl = '';
const baseSearchUrl = '';


puppeteer.use(stealthPlugin);
puppeteer.use(adBlockerPlugin({blockTrackers: true}));
//puppeteer.use(blockResourcesPlugin);
puppeteer.use(anonymizeuaPlugin);

app.get('/', (req, res) => {
    (async () => {
        console.time('start');
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();

        /*blockResourcesPlugin.blockedTypes.add('image');
        blockResourcesPlugin.blockedTypes.add('stylesheet');
        blockResourcesPlugin.blockedTypes.add('other');
        blockResourcesPlugin.blockedTypes.add('script');
        blockResourcesPlugin.blockedTypes.add('media');
        blockResourcesPlugin.blockedTypes.add('font');*/

        // directly go to search page
        const book = '';
        await page.goto(baseSearchUrl + encodeURI(book));
        await page.evaluate(() => {

        });

        // go to homepage and search like an user
        await page.goto(baseUrl);
        await page.evaluate(() => {
            const searchInput = document.querySelector('#sitesearch_field');
            searchInput.value = '';
            const searchButton = document.querySelector("#headerSearchForm > a > img");
            searchButton.click();
            const modalCloseButton = document.querySelector('body > div:nth-child(3) > div > div > div.modal__close > button > img');
            modalCloseButton.click();
        });


        const quotesUrl = await page.evaluate(() => document.querySelector('body > div.content > div.mainContentContainer > div.mainContent > div.mainContentFloat > div.rightContainer > div:nth-child(12) > div.h2Container.gradientHeaderContainer > h2 > a').getAttribute('href'));
        await page.goto(baseUrl + quotesUrl);
        const quotes = await page.evaluate(() => document.querySelector('.quoteText').textContent);
        await browser.close();
        console.timeEnd('start');
        res.send(quotes);

    })();
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})