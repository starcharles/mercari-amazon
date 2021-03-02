// import {ElementHandle, Page} from "puppeteer"

import {Page} from "puppeteer";

export const extractNameAndPrice = async (page: Page) => {
	const boxes = await page.$$('.items-box-body');

	let values: {
		name: string,
		price: number,
	}[] = [];

	for (const box of boxes) {
		const name = await box.$eval('.items-box-name', (name: any) => {
			return name.innerText;
		});
		const price = await box.$eval('.items-box-price', (price: any) => {
			return price.innerText;
		});

		const match = price.match(/[\d,]+/);

		values.push({
			name,
			price: +match[0].replace(',', '')
		})
	}

	// console.log(values);
	// console.log(values.length);

	return values
};


export const extractInfoAmazon = async (page: Page, book: any) => {
	await page.pdf({path: `pdf/${book.name}-${new Date()}.pdf`});

	const box = await page.$('.s-result-list .sg-col-inner');
	if (!box) {
		return;
	}

	const bookName = await box.$eval('.a-link-normal .a-text-normal', (data) => {
		return data['innerText'];
	});

	const price1 = await box.$eval('.a-price .a-offscreen', (data) => {
		return data['innerText'];
	});

	const price2 = await box.$eval('.a-spacing-top-mini .a-color-price', (data) => {
		return data['innerText'];
	});

	const rest = await box.$eval('.a-spacing-top-mini a', (data) => {
		return data['innerText'];
	});
	// console.log(bookName);
	// console.log(price1);
	// console.log(price2);
	// console.log(rest);

	const match1 = price1.match(/[\d,]+/);
	const match2 = price2.match(/[\d,]+/);
	const match3 = rest.match(/(\d+)点.+/);
	// console.log(match3);

	const val = {
		mer:{
			name: book.name,
			price: book.price,
		},
		name: bookName,
		priceOfficial: +match1[0].replace(',', ''),
		priceUsed: +match2[0].replace(',', ''),
		diff: +match2[0].replace(',', '') - book.price,
		restItems: +match3[1],
	};

	return val;
};
