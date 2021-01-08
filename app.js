const express = require('express');
const puppeteer = require ('puppeteer');
const app = express();
const port = 3000;
const blockResources = ['stylesheet', 'script', 'font', 'media'];

app.get('/', (req, res) => {
    puppeteer.launch({headless: true})
        .then(async browser => {
            console.time('start');
            const page = await browser.newPage ();
            await page.setRequestInterception(true);
            page.on('request', request => {
                if (blockResources.includes(request.resourceType())) {
                    request.abort();
                }
                else {
                    request.continue();
                }
            });
            await page.goto ('');
            const body = await page.evaluate(() => document.body.innerHTML);
            await browser.close();
            console.timeEnd('start');
            res.send(body);

        })
        .catch(error => {
            console.log(error);
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})