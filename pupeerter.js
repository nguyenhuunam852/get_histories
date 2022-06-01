const puppeteer = require('puppeteer');


(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://ib.techcombank.com.vn/servlet/BrowserServlet');

    // Get the "viewport" of the page, as reported by the page.
    await page.evaluate(() => {
        document.getElementsByName('signOnName')[0].value = '0988851934'
        document.getElementsByName('password')[0].value = 'Ha@2002'
        document.querySelector('form[name=login]').submit()
    });


    await page.waitForXPath(`/html/body/div/table/tbody/tr[1]/td/div[2]/ul/li[2]/a`, { visible: true, timeout: 10000 });
    await page.waitForTimeout(1000)

    const tagname = await page.$x(`/html/body/div/table/tbody/tr[1]/td/div[2]/ul/li[2]/a`);
    await tagname[0].click();
    await tagname[0].click();


    await page.waitForXPath(`/html/body/div/table/tbody/tr[2]/td/table/tbody/tr/td[1]/table/tbody/tr/td/div/table/tbody/tr/td[2]/table/tbody/tr/td/div/table/tbody/tr[2]/td/div[2]/div[2]/div/div[2]/form[1]/div[4]/table[2]/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td[1]/a`, { visible: true, timeout: 10000 });
    const elementToClick = await page.$x(`/html/body/div/table/tbody/tr[2]/td/table/tbody/tr/td[1]/table/tbody/tr/td/div/table/tbody/tr/td[2]/table/tbody/tr/td/div/table/tbody/tr[2]/td/div[2]/div[2]/div/div[2]/form[1]/div[4]/table[2]/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td[1]/a`);
    await elementToClick[0].click();

    // const text = await page.waitForSelector('#MainBody234575055103 > div.qwfieldset');
    // const value = await text.evaluate(el => el.textContent);
    // let value = await text.
    // console.log(value);

    await page.waitForXPath('/html/body/div/table/tbody/tr[2]/td/table/tbody/tr/td[1]/table/tbody/tr/td/div/table/tbody/tr/td[2]/table/tbody/tr/td/div[3]/div[2]/div[1]/div/form/div/table/tbody/tr[2]/td[2]', { visible: true, timeout: 10000 });
    const element = await page.$x('/html/body/div/table/tbody/tr[2]/td/table/tbody/tr/td[1]/table/tbody/tr/td/div/table/tbody/tr/td[2]/table/tbody/tr/td/div[3]/div[2]/div[1]/div/form/div/table/tbody/tr[2]/td[2]');
    const getMsg = await page.evaluate(name => name.innerText, element[0]);
    console.log(getMsg)
    // console.log(await page.evaluate(name => name.innerText, element))
    // const textObject = await element[0].getProperty('textContent');
    // const text = textObject._remoteObject.value;
    // console.log(text);
    await browser.close();



})();


