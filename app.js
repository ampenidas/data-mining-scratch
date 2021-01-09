const express = require('express');
const puppeteer = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth')();
const adBlockerPlugin = require('puppeteer-extra-plugin-adblocker');
const blockResourcesPlugin = require('puppeteer-extra-plugin-block-resources')();
const anonymizeuaPlugin = require('puppeteer-extra-plugin-anonymize-ua')();

const app = express();
const port = 3000;
const url = '';


puppeteer.use(stealthPlugin);
//puppeteer.use(adBlockerPlugin({blockTrackers: true}));
puppeteer.use(blockResourcesPlugin);
puppeteer.use(anonymizeuaPlugin);

app.get('/', (req, res) => {
    (async () => {
        console.time('start');
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();

        blockResourcesPlugin.blockedTypes.add('image');
        blockResourcesPlugin.blockedTypes.add('stylesheet');
        blockResourcesPlugin.blockedTypes.add('other');
        blockResourcesPlugin.blockedTypes.add('script');
        blockResourcesPlugin.blockedTypes.add('media');
        blockResourcesPlugin.blockedTypes.add('font');

        await page.goto(url);
        const body = await page.evaluate(() => document.body.innerHTML);
        await browser.close();
        console.timeEnd('start');
        res.send(body);

    })();
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})