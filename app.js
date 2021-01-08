const express = require('express');
const puppeteer = require ('puppeteer');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    puppeteer.launch({headless: true})
        .then(async browser => {
            console.time('start');
            const page = await browser.newPage ();
            await page.goto ('https://www.goodreads.com/choiceawards/best-fiction-books-2020');
            const body = await page.evaluate(() => document.querySelector());
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