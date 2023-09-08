const siteUrl = 'https://www.finishline.com/store/product/air-jordan-retro-1-mid-casual-shoes/prod1370657?styleId=DQ8426&colorId=401';
//change const variables to fit your needs
const shippingOption = 'Economy';
const shoeSize = '8.0';
const firstName = 'Sishir';
const lastName = 'Phuyal';
const phoneNumber = '502-XXX-XXXX';
const email = 'XXXXXXXXXXX@gmail.com'
const shippingAddress = 'XXX XXX XX Dr';
const shippingCity = 'Louisville';
const shippingStateAbbr = 'KY';
const shippingZipCode = 'XXXXX';
const creditCardNumber = 'XXXXXXXXXXXX';
const creditCardExpirationMonth = 'XX';
const creditCardExpirationYear = 'XXXX';
const creditCardCVV = 'XXX';


const puppeteer = require('puppeteer-extra'); 
const stealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(stealthPlugin())

async function typeIntIntoField(indent, value, page, timeout){
    for (const char of value) {
        await page.type(indent, char);
        await page.waitForTimeout(timeout);
    }
}

async function clickButtonByText(page, buttonSelector, buttonText) {
    await page.waitForSelector(buttonSelector);
    await page.evaluate((buttonSelector, buttonText) => {
    const buttons = document.querySelectorAll(buttonSelector);
    for (const button of buttons) {
        if (button.textContent === buttonText) {
        button.click();
        break;
        }
    }
    }, buttonSelector, buttonText);
}

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537.36');
    await page.goto(siteUrl);

    await page.waitForSelector("button[data-size='" + shoeSize + "'")
    await page.click("button[data-size='" + shoeSize + "'", btn => btn.click())
    await page.waitForTimeout(500)
    await page.click("#buttonAddToCart", btn => btn.click())

    await page.waitForSelector('a.button.expanded[data-goal="View Bag"]'); 
    await page.click('a.button.expanded[data-goal="View Bag"]'); 
    
    await page.waitForSelector('a.button.expanded.mb-2.js-cart-proceed-btn');
    await page.click('a.button.expanded.mb-2.js-cart-proceed-btn');

    //filling form
    await page.waitForSelector('#firstName')
    await page.type('#firstName', firstName);
    await page.type('#shippingLastName', lastName);
    await page.type('#shippingAddress1', shippingAddress);
    await page.type('#shippingAddress2', '');
    await page.type('#shippingCity', shippingCity);
    await page.select('#shippingState', shippingStateAbbr);
    await typeIntIntoField('#shippingZip', shippingZipCode , page, 0);
    await typeIntIntoField('#shippingPhone', phoneNumber, page, 0);
    await page.type('#email', email);

    // Click on the radio button to select the desired shipping option
    await page.click(`.delivery-methods-rewards input[value="${shippingOption}"]`);
    await page.waitForTimeout(500)
    const buttonSelector = 'button.button.expanded';
    const buttonText = 'Continue to Payment';
    await clickButtonByText(page, buttonSelector, buttonText);


    await page.waitForSelector('form#billing_form');
    await typeIntIntoField('#billingCardNumber', creditCardNumber, page, 25);
    await page.select('#billingExpirationMonth', creditCardExpirationMonth);
    await page.select('#billingExpirationYear', creditCardExpirationYear);
    await typeIntIntoField('#billingSecurityCode', creditCardCVV, page, 20);
    await page.click('#sameAsShippingCheckbox');

    await page.click('#billingContinueButton', btn => btn.click())

    // Wait for the "Place Your Order" button to appear
    const placeOrderButtonSelector = 'button#submitOrder';
    await page.waitForSelector(placeOrderButtonSelector);

    // Click the "Place Your Order" button
    //comment this out, if you want to place the actuall order
    await page.click(placeOrderButtonSelector, btn => btn.click());
    
    console.log("Order Placed!")

    await page.waitForTimeout(5000);

    //await browser.close();

})();