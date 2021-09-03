const config = require('./config');
const { CONTACTS, PLATFORMS, addAlert } = require('./utils/alert');

const { LIRAN, ALMOG } = CONTACTS;
const { WHATSAPP, EMAIL } = PLATFORMS;

async function processFinances(financeResults) {
  _leumiGemel(financeResults);
  _leumiHishtalmut(financeResults);
  _leumiMain(financeResults);
}

module.exports = processFinances;

function _leumiHishtalmut(financeResults) {
  const { leumi } = financeResults;
  if (!leumi) return;

  const { balance } = leumi.accounts.find(({ accountNumber }) => accountNumber === config.leumi.accountHishtalmut);
  if (balance > 1000) {
    addAlert({
      to: [LIRAN],
      msg: `Leumi Hishtalmut account balance is above 1000 NIS and pending for investment. balance = ${balance} NIS`,
      platforms: [EMAIL, WHATSAPP],
    });
  }
}

function _leumiGemel(financeResults) {
  const { leumi } = financeResults;
  if (!leumi) return;

  const { balance } = leumi.accounts.find(({ accountNumber }) => accountNumber === config.leumi.accountGemel);
  if (balance > 1000) {
    addAlert({
      to: [LIRAN],
      msg: `Leumi Gemel account balance is above 1000 NIS and pending for investment. balance = ${balance} NIS`,
      platforms: [EMAIL, WHATSAPP],
    });
  }
}

function _leumiMain(financeResults) {
  const { leumi } = financeResults;
  if (!leumi) return;

  const { balance } = leumi.accounts.find(({ accountNumber }) => accountNumber === config.leumi.accountMain);
  if (balance < 5000) {
    addAlert({
      to: [LIRAN],
      msg: `Leumi Main account balance is below 5000 NIS and thus at risk to become negative. balance = ${balance} NIS`,
      platforms: [EMAIL, WHATSAPP],
    });
  }
}
