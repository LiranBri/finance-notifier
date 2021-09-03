const { CompanyTypes, createScraper } = require('israeli-bank-scrapers');
const config = require('../config');

const mock = {
  success: true,
  accounts: [
    { accountNumber: '701-24346_24', balance: 1.86, txns: [] },
    { accountNumber: '832-74392_42', balance: 500.25, txns: [Array] }, // hishtalmut
    { accountNumber: '832-74403_63', balance: 5500.57, txns: [Array] }, // gemel
    { accountNumber: '857-53706_04', balance: 500.93, txns: [Array] }, // main
  ],
};

async function hapoalimScrapper() {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 14);

    // read documentation below for available options
    const options = {
      companyId: CompanyTypes.leumi,
      startDate,
      combineInstallments: false,
      showBrowser: false,
    };

    //   const scraper = createScraper(options);
    //   const credentials = {
    //       username: config.leumi.username,
    //       password: config.leumi.password
    //     }
    //   const scrapeResult = await scraper.scrape(credentials);
    const scrapeResult = mock;

    if (scrapeResult.success) {
      return scrapeResult;
    } else {
      throw new Error(scrapeResult.errorType);
    }
  } catch (e) {
    console.error(`leumi scraping failed. error: ${e.message}`);
  }
}

module.exports = hapoalimScrapper;
