const processFinances = require('./processFinances');
const hapoalimScrapper = require('./scrappers/hapoalimScrapper');
const leumiScrapper = require('./scrappers/leumiScrapper');

async function main() {
  const [leumi, hapoalim] = await Promise.all([
    leumiScrapper(),
    hapoalimScrapper(),
  ]);

  financeResults = {
    leumi,
    hapoalim,
  };
  await processFinances(financeResults);
}

main();
