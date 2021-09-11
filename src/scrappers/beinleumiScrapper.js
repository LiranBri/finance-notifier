const { CompanyTypes, createScraper } = require('israeli-bank-scrapers');
const config = require('../../config');

async function beinleumiScrapper() {
  // return

  try {
    const startDate = new Date();
    // startDate.setDate(startDate.getDate() - 14);

    const options = {
      companyId: CompanyTypes.beinleumi,
      startDate,
      combineInstallments: true,
      showBrowser: false,
    };

    const scraper = createScraper(options);
    const credentials = {
      username: config.beinleumi.username,
      password: config.beinleumi.password,
    };
    const scrapeResult = await scraper.scrape(credentials);

    if (scrapeResult.success) {
      return scrapeResult;
    } else {
      throw new Error(`${scrapeResult.errorType}: ${scrapeResult.errorMessage}`);
    }
  } catch (e) {
    addAlert({ msg: `Habeinleumi scraping failed. error: ${e.message}` });
  }
}

module.exports = beinleumiScrapper;