const { CompanyTypes, createScraper } = require('israeli-bank-scrapers');
const config = require('../../config');
const { addAlert } = require('../utils/alert');

async function hapoalimScrapper() {
  return _generateMock();

  try {
    const startDate = new Date();
    // startDate.setDate(startDate.getDate() - 14);

    const options = {
      companyId: CompanyTypes.hapoalim,
      startDate,
      combineInstallments: true,
      showBrowser: false,
    };

    const scraper = createScraper(options);
    const credentials = {
      userCode: config.hapoalim.username,
      password: config.hapoalim.password,
    };
    const scrapeResult = await scraper.scrape(credentials);

    if (scrapeResult.success) {
      return scrapeResult;
    } else {
      throw new Error(`${scrapeResult.errorType}: ${scrapeResult.errorMessage}`);
    }
  } catch (e) {
    addAlert({ msg: `Hapoalim scraping failed. error: ${e.message}` });
  }
}

function _generateMock() {
  const mock = {
    success: true,
    accounts: [
      {
        accountNumber: '12-640-191944',
        balance: 4340.45,
        txns: [
          {
            type: 'normal',
            identifier: 640191944,
            date: '2021-08-26T21:00:00.000Z',
            processedDate: '2021-08-26T21:00:00.000Z',
            originalAmount: -107.57,
            originalCurrency: 'ILS',
            chargedAmount: -107.57,
            description: 'הו"ק הלו\' רבית',
            status: 'completed',
            memo: '',
          },
          {
            type: 'normal',
            identifier: 640191944,
            date: '2021-08-26T21:00:00.000Z',
            processedDate: '2021-08-26T21:00:00.000Z',
            originalAmount: -645.22,
            originalCurrency: 'ILS',
            chargedAmount: -645.22,
            description: 'הו"ק הלואה קרן',
            status: 'completed',
            memo: '',
          },
          {
            type: 'normal',
            identifier: 90474,
            date: '2021-08-24T21:00:00.000Z',
            processedDate: '2021-08-24T21:00:00.000Z',
            originalAmount: -12000.08,
            originalCurrency: 'ILS',
            chargedAmount: -12000.08,
            description: 'העברה מהבנק',
            status: 'completed',
            memo: 'לטובת: Interactive Brokers LLC. עבור: U2036498.',
          },
          {
            type: 'normal',
            identifier: 99011330,
            date: '2021-08-21T21:00:00.000Z',
            processedDate: '2021-08-21T21:00:00.000Z',
            originalAmount: 11000,
            originalCurrency: 'ILS',
            chargedAmount: 11000,
            description: 'זיכוי מדיסקונט',
            status: 'completed',
            memo: 'המבצע: ברימר אדוארדו,בר. עבור: תשלום               מח-ן:072692563.',
          },
        ],
      },
      {
        accountNumber: '12-510-191942',
        txns: [],
      },
    ],
  };
  return mock;
}

module.exports = hapoalimScrapper;
