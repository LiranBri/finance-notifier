const { CompanyTypes, createScraper } = require('israeli-bank-scrapers');
const config = require('../../config');
const { addAlert } = require('../utils/alert');
const withRetry = require('../utils/withRetry');

async function leumiScrapper() {
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

module.exports = withRetry(leumiScrapper);
