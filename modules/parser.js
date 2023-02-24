const puppeteer = require('puppeteer');
const helper = require('./helper');


/**
 * Parse DKO website leaderboard page
 * @returns  {'1versus1Leadearboard' : array, '2versus2Leaderboard' : array}
 */
async function parse() {
    const puppeteerObj = await initBrowser();
    const selectors = {
        imgContainer: ".top-gods",
        img: ".top-gods > img",
        switch: "#__next > div > div.leaderboard-filter-container > label > div",
        playerDataRow: ".player-data-row",
        playerName: '.wrap-container > p',
    };
    const csvGodKey = [
        '1st_main',
        '2nd_main',
        '3rd_main',
    ]
    let modes = {
        '1versus1Leadearboard': [],
        '2versus2Leaderboard': [],
    };
    for (const [modeName, modeLeaderboard] of Object.entries(modes)) {
        let playerDataRows = await puppeteerObj.page.$$(selectors.playerDataRow);
        for (const player of playerDataRows) {
            let newGod = {
                'name': await player.$eval(selectors.playerName, element => element.textContent),
            };
            await (await player.$$eval(selectors.img, (gods) => gods.map((god) => god.alt))).map((god, index) => newGod[csvGodKey[index]] = god)
            modes[modeName].push(newGod);
        }
        await puppeteerObj.page.click(selectors.switch);
    }
    puppeteerObj.browser.close();
    return modes;
}

/**
 * Initialize Puppeteer browser, and go to web page
 * @returns {browser : browserObject, page : firstPageObject}
 */
async function initBrowser() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.goto('https://www.divineknockout.com/leaderboard/');
    return {
        browser: browser,
        page: page,
    }
}

module.exports = {
    parse,
};