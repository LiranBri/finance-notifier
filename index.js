const processFinances = require('./processFinances');
const leumiScrapper = require('./scrappers/leumiScrapper');

async function main() {
  const [leumi] = await Promise.all([leumiScrapper()]);
  financeResults = {
    leumi,
  };
  await processFinances(financeResults);
}

main();
