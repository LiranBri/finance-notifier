const { CompanyTypes, createScraper } = require('israeli-bank-scrapers');
const config = require('../../config');
const { addAlert } = require('../utils/alert');

async function leumiScrapper() {
  // return _generateMock();
  // return

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);

    const options = {
      companyId: CompanyTypes.leumi,
      startDate,
      combineInstallments: true,
      showBrowser: false,
    };

    const scraper = createScraper(options);
    const credentials = {
      username: config.leumi.username,
      password: config.leumi.password,
    };
    const scrapeResult = await scraper.scrape(credentials);

    if (scrapeResult.success) {
      return scrapeResult;
    } else {
      throw new Error(`${scrapeResult.errorType}: ${scrapeResult.errorMessage}`);
    }
  } catch (e) {
    addAlert({ msg: `Leumi scraping failed. error: ${e.message}` });
  }
}

module.exports = leumiScrapper;

function _generateMock() {
  const mock = {
    success: true,
    accounts: [
      {
        accountNumber: '701-24346_24',
        balance: 1.86,
        txns: [],
      },
      {
        accountNumber: '832-74392_42',
        balance: 2000,
        txns: [
          {
            status: 'completed',
            type: 'normal',
            date: '2021-05-03T21:00:00.003Z',
            processedDate: '2021-05-03T21:00:00.003Z',
            description: 'מב. הפועלים-י',
            identifier: 99012,
            memo: 'העברה מאת: הלמן - אלדובי קו 12-600-000651952',
            originalCurrency: 'ILS',
            chargedAmount: 1571.2,
            originalAmount: 1571.2,
          },
        ],
      },
      {
        accountNumber: '832-74403_63',
        balance: 2000,
        txns: [
          {
            status: 'completed',
            type: 'normal',
            date: '2021-04-06T21:00:00.003Z',
            processedDate: '2021-04-06T21:00:00.003Z',
            description: 'מב. הפועלים-י',
            identifier: 99012,
            memo: 'העברה מאת: הלמן - אלדובי קו 12-600-000651936',
            originalCurrency: 'ILS',
            chargedAmount: 4231.54,
            originalAmount: 4231.54,
          },
        ],
      },
      {
        accountNumber: '857-53706_04',
        balance: 42138.16,
        txns: [
          {
            status: 'completed',
            type: 'normal',
            date: '2021-08-31T21:00:00.003Z',
            processedDate: '2021-08-31T21:00:00.003Z',
            description: 'מנדיי.קום בע-י',
            identifier: 42814,
            memo: 'העברה מאת: מנדיי.קום 10-864-051310064 משכורת',
            originalCurrency: 'ILS',
            chargedAmount: 17071.41,
            originalAmount: 17071.41,
          },
        ],
      },
    ],
  };
  return mock;
}
