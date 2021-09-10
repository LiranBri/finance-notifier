const config = require('../config');
const { CONTACTS, PLATFORMS, addAlert } = require('./utils/alert');
const { log } = require('./utils/logger');

const { LIRAN, ALMOG } = CONTACTS;
const { WHATSAPP, EMAIL } = PLATFORMS;

function processFinances(financeResults) {
  log(JSON.stringify({ financeResults }, null, 3));

  _leumiIRA(financeResults, 'Gemel', config.leumi.accountGemel);
  _leumiIRA(financeResults, 'Hishtalmut', config.leumi.accountHishtalmut);
  _leumiMain(financeResults);
  _hapoalim(financeResults);
  _beinleumi(financeResults);
}

module.exports = processFinances;

function _leumiIRA(financeResults, displayName, leumiAccountId) {
  const { leumi } = financeResults;
  if (!leumi) return;

  const { balance, txns } = leumi.accounts.find(({ accountNumber }) => accountNumber === leumiAccountId);

  const salaryTransaction = txns.find((txn) => txn.memo.includes('העברה מאת: הלמן'));
  if (salaryTransaction) {
    addAlert({
      msg: `Leumi ${displayName} IRA account received a payroll of ${_formatNis(salaryTransaction.chargedAmount)} with total balance of ${_formatNis(balance)} and pending for investment.`,
    });
    // positive balance alerts only on Sundays
  } else if (balance > 1000 && new Date().getDay() === 0) {
    addAlert({
      msg: `Leumi ${displayName} IRA account balance ${_formatNis(balance)} is still high and pending for investment.`,
    });
  }
}

function _leumiMain(financeResults) {
  const { leumi } = financeResults;
  if (!leumi) return;

  const { balance, txns } = leumi.accounts.find(({ accountNumber }) => accountNumber === config.leumi.accountMain);
  if (balance < 5000) {
    addAlert({
      msg: `Leumi Main account balance ${_formatNis(balance)} is too low and at risk to turn negative.`,
    });
  }

  const requiredActionsMsg = `Required actions:
  1. transfer money via Bit to shared account
  2. dummy ₪ 2000 payment via PayBox to meet loan requirements
  3. dummy payments to gain El-Al points
  4. invest leftover balance`;

  const salaryTransaction = txns.find((txn) => txn.memo.includes('משכורת'));
  if (salaryTransaction) {
    addAlert({
      msg: `Leumi Main account received a payroll of ${_formatNis(salaryTransaction.chargedAmount)} with total balance of ${_formatNis(balance)}.
      ${requiredActionsMsg}`,
    });
    // positive balance alerts only on Sundays
  } else if (balance > 20000 && new Date().getDay() === 0) {
    addAlert({
      msg: `Leumi Main account balance ${_formatNis(balance)} is still high.
      ${requiredActionsMsg}`,
    });
  }
}

function _hapoalim(financeResults) {
  const { hapoalim } = financeResults;
  if (!hapoalim) return;

  const { balance } = hapoalim.accounts.find(({ accountNumber }) => accountNumber === config.hapoalim.accountMain);
  if (balance < 3000) {
    addAlert({
      msg: `Hapoalim account balance ${_formatNis(balance)} is too low and at risk to turn negative upon next loan payment.`,
    });
  }
}

function _beinleumi(financeResults) {
  const { beinleumi } = financeResults;
  if (!beinleumi) return;

  const { balance } = beinleumi.accounts.find(({ accountNumber }) => accountNumber === config.beinleumi.accountMain);
  if (balance < 5000) {
    addAlert({
      to: [LIRAN, ALMOG],
      msg: `Habeinleumi account balance ${_formatNis(balance)} is too low and at risk to turn negative.`,
    });
  }
}

function _formatNis(amount) {
  return `₪ ${Math.round(amount).toLocaleString()}`;
}
