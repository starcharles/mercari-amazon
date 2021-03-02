import {extractInfoAmazon} from "./utils/util"
import * as fs from "fs";
import * as devices from "puppeteer/DeviceDescriptors";

const json = require("./result.json");

const puppeteer = require('puppeteer');
const streams = require('memory-streams');

const url = 'https://www.amazon.co.jp/';

const book = json[0];

(async () => {
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({
    // headless: false,
    // devtools: true,
    // slowMo: 250 // slow down by 250ms
  });
  const page = await browser.newPage();
  // const iPhone = devices['iPhone 6']; //デバイスはiPhone6を選択
  // await page.emulate(iPhone); // デバイス適用

  // await page.type('input[id=twotabsearchtextbox]', book.name);
  // await page.click('input[type=submit');
  // await page.waitForNavigation({
  // 	waitUntil: 'domcontentloaded'
  // });

  const values: any[] = [];
  const errors: any[] = [];
  const date = new Date().toISOString()
  for (const book of json) {
    let val;
    try {
      await page.goto(url);
      await page.type('input[id=twotabsearchtextbox]', book.name);
      await page.click('input[type=submit');
      await page.waitForNavigation({
        waitUntil: 'domcontentloaded'
      });

      val = await extractInfoAmazon(page, book);

    } catch (e) {
      errors.push(book);
      // console.log("errror------------");
      continue;
    }
    // if(val && val.diff > 100){
    console.log(val);
    // 	values.push(val);
    // }
    const src = new streams.ReadableStream(JSON.stringify(val));
    const dest = fs.createWriteStream(`final-result-${date}.json`, 'utf8');
    src.pipe(dest);
  }

  // const values = json.map(async (book) => {
  // 	await page.type('input[id=twotabsearchtextbox]', book.name);
  // 	await page.click('input[type=submit');
  // 	await page.waitForNavigation({
  // 		waitUntil: 'domcontentloaded'
  // 	});
  // 	return await extractInfoAmazon(page);
  // });

  await browser.close();

  // const src  = new streams.ReadableStream(JSON.stringify(values));
  // const dest = fs.createWriteStream(`final-result-${new Date().toISOString()}.json`, 'utf8');
  // src.pipe(dest);

  // fs.writeFileSync(`errors-${new Date().toISOString()}.json`, JSON.stringify(errors));
  // fs.writeFileSync(`final-result-${new Date().toISOString()}.json`, JSON.stringify(values));
})();
