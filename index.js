const processFinances = require('./processFinances');
const beinleumiScrapper = require('./scrappers/beinleumiScrapper');
const hapoalimScrapper = require('./scrappers/hapoalimScrapper');
const leumiScrapper = require('./scrappers/leumiScrapper');

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
