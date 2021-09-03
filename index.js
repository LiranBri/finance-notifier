const processFinances = require('./src/processFinances');
const beinleumiScrapper = require('./src/scrappers/beinleumiScrapper');
const hapoalimScrapper = require('./src/scrappers/hapoalimScrapper');
const leumiScrapper = require('./src/scrappers/leumiScrapper');

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
}

main();
