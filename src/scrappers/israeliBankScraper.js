const { createScraper } = require('israeli-bank-scrapers');
const config = require('../../config');
const { addAlert } = require('../utils/alert');
const withRetry = require('../utils/withRetry');

async function israeliBankScraper(bank) {
  try {
    const result = await _scrape(bank);
    return result;
  } catch (e) {
    addAlert({ msg: `${bank} scraper failed. error: ${e.message}` });
    return null;
  }
}

const _scrape = withRetry(async (bank) => {
  const { credentials, transactionsDaysRange } = config.scrapers[bank];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (transactionsDaysRange || 0));

  const options = {
    companyId: bank,
    startDate,
    combineInstallments: true,
    showBrowser: true,
  };

  const scraper = createScraper(options);
  const scrapeResult = await scraper.scrape(credentials);

  if (scrapeResult.success) {
    return scrapeResult;
  } else {
    throw new Error(`${scrapeResult.errorType}: ${scrapeResult.errorMessage}`);
  }
});

module.exports = israeliBankScraper;
