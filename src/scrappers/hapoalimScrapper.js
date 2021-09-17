const { CompanyTypes, createScraper } = require('israeli-bank-scrapers');
const config = require('../../config');
const { addAlert } = require('../utils/alert');
const withRetry = require('../utils/withRetry');

async function hapoalimScrapper() {
  // return

  try {
    const result = await _scrape();
    return result;
  } catch (e) {
    addAlert({ msg: `Hapoalim scraping failed. error: ${e.message}` });
    return null;
  }
}

const _scrape = withRetry(async () => {
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
});

module.exports = hapoalimScrapper;
