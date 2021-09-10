const processFinances = require('./src/processFinances');
const beinleumiScrapper = require('./src/scrappers/beinleumiScrapper');
const hapoalimScrapper = require('./src/scrappers/hapoalimScrapper');
const leumiScrapper = require('./src/scrappers/leumiScrapper');

const { sendAlerts } = require('./src/utils/alert');
const { log } = require('./src/utils/logger');

async function main() {
  log('Finance Notifier started ...');

  const [leumi, hapoalim, beinleumi] = await Promise.all([
    leumiScrapper(), //
    hapoalimScrapper(),
    beinleumiScrapper(),
  ]);

  const financeResults = { leumi, hapoalim, beinleumi };
  processFinances(financeResults);
  await sendAlerts();
}

main();
