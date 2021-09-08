const config = require('../config');
const { CONTACTS, PLATFORMS, addAlert } = require('./utils/alert');
const { log } = require('./utils/logger');

const { LIRAN, ALMOG } = CONTACTS;
const { WHATSAPP, EMAIL } = PLATFORMS;

async function processFinances(financeResults) {
  log(JSON.stringify({ financeResults }, null, 3));

  _leumiGemel(financeResults);
  _leumiHishtalmut(financeResults);
  _leumiMain(financeResults);
  _hapoalim(financeResults);
}

module.exports = processFinances;

function _leumiHishtalmut(financeResults) {
  const { leumi } = financeResults;
  if (!leumi) return;

  const { balance } = leumi.accounts.find(({ accountNumber }) => accountNumber === config.leumi.accountHishtalmut);
  if (balance > 1000) {
    addAlert({
      msg: `Leumi Hishtalmut IRA account balance ₪ ${Math.round(balance).toLocaleString()} is pending for investment.`,
    });
  }
}

function _leumiGemel(financeResults) {
  const { leumi } = financeResults;
  if (!leumi) return;

  const { balance } = leumi.accounts.find(({ accountNumber }) => accountNumber === config.leumi.accountGemel);
  if (balance > 1000) {
    addAlert({
      msg: `Leumi Gemel IRA account balance ₪ ${Math.round(balance).toLocaleString()} is pending for investment.`,
    });
  }
}

function _leumiMain(financeResults) {
  const { leumi } = financeResults;
  if (!leumi) return;

  const { balance } = leumi.accounts.find(({ accountNumber }) => accountNumber === config.leumi.accountMain);
  if (balance < 5000) {
    addAlert({
      msg: `Leumi Main account balance ₪ ${Math.round(balance).toLocaleString()} is too low and at risk to turn negative.}`,
    });
  }

  if (balance > 20000) {
    addAlert({
      msg: `Leumi Main account balance ₪ ${Math.round(balance).toLocaleString()} is high.
      Required actions:
      1. transfer money via Bit to shared account
      2. dummy ₪ 2000 payment via PayBox to meet loan requirements
      3. dummy payments to gain El-Al points
      4. invest leftover balance`,
    });
  }
}

function _hapoalim(financeResults) {
  const { hapoalim } = financeResults;
  if (!hapoalim) return;

  const { balance } = hapoalim.accounts.find(({ accountNumber }) => accountNumber === config.hapoalim.accountMain);
  if (balance < 3000) {
    addAlert({
      msg: `Hapoalim account balance ₪ ${Math.round(balance).toLocaleString()} is too low and at risk to turn negative upon next loan payment.}`,
    });
  }
}
