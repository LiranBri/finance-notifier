const processFinances = require('./src/processFinances');
const beinleumiScrapper = require('./src/scrappers/beinleumiScrapper');
const hapoalimScrapper = require('./src/scrappers/hapoalimScrapper');
const leumiScrapper = require('./src/scrappers/leumiScrapper');

const { sendAlerts } = require('./src/utils/alert');

async function main() {
  const [leumi, hapoalim, beinleumi] = await Promise.all([
    leumiScrapper(), //
    hapoalimScrapper(),
    beinleumiScrapper(),
  ]);

  financeResults = {
    leumi,
    hapoalim,
    beinleumi,
  };
  await processFinances(financeResults);
  await sendAlerts();
}

main();
