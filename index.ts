import {extractNameAndPrice} from "./utils/util"
import * as fs from "fs";

const puppeteer = require('puppeteer');
const url = 'https://www.mercari.com/jp/category/674/';

(async () => {
	// const browser = await puppeteer.launch();
	const browser = await puppeteer.launch({
		// headless: false,
		// devtools: true,
		// slowMo: 250 // slow down by 250ms
	});

	const page = await browser.newPage();
	await page.goto(url);
	// await page.screenshot({path: 'example.png'});

	let info: any[] = [];
	for (let i = 0; i < 4; i++) {
		await page.pdf({path: `page-${i+1}.pdf`, format: 'A4'});
		const values = await extractNameAndPrice(page);
		info = info.concat(values);

		page.click('.pager-next a');
		await page.waitForNavigation({
			waitUntil: 'domcontentloaded'
		});
	}

	await browser.close();
	console.log(info.length);

	fs.writeFileSync(`result-${new Date().toISOString()}.json`, JSON.stringify(info));

})();
