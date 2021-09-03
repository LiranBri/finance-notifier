const { CompanyTypes, createScraper } = require('israeli-bank-scrapers');
const config = require('../config');

async function leumiScrapper() {
  return _generateMock();

  try {
    const startDate = new Date();
    // startDate.setDate(startDate.getDate() - 14);

    // read documentation below for available options
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
      { accountNumber: '701-24346_24', balance: 1.86, txns: [] },
      { accountNumber: '832-74392_42', balance: 500.25, txns: [Array] }, // hishtalmut
      { accountNumber: '832-74403_63', balance: 5500.57, txns: [Array] }, // gemel
      { accountNumber: '857-53706_04', balance: 500.93, txns: [Array] }, // main
    ],
  };
  return mock;
}
