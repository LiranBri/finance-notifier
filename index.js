const config = require('./config');
const processFinances = require('./processFinances');
const israeliBankScraper = require('./src/scrappers/israeliBankScraper.js');
const { sendAlerts } = require('./src/utils/alert');
const { log } = require('./src/utils/logger');

async function main() {
  log('Finance Notifier started ...');

  const banks = Object.keys(config.scrapers);
  const promiseResults = await Promise.all(
    banks.map((currBank) => israeliBankScraper(currBank)) //
  );

  const financeResults = {};
  for (let i = 0; i < promiseResults.length; i++) {
    financeResults[banks[i]] = promiseResults[i];
  }
  processFinances(financeResults);

  await sendAlerts();
}

main();
