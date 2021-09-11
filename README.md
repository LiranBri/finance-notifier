# Finance Notifier
A simple script that crawls bank websites with the ability to send custom alerts to multiple contacts and platforms.

Crawler is based on the [Israeli Bank Scrapers](https://github.com/eshaham/israeli-bank-scrapers/) project.

## Instructions
you are required to provide two files:
* config.js - configurations file with banks credentials, contacts, and api keys
* processFinances.js - custom alerts logic

## API Keys
follow the official documentations to obtain proper API keys:

[SendGrid](https://www.sendgrid.com)

[CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/)
## config.js
example:
```js
module.exports = {
  leumi: {
    username: '<username>',
    password: '<password>',
  },
  hapoalim: {
    username: '<username>',
    password: '<password>',
  },
  beinleumi: {
    username: '<username>',
    password: '<password>',
  },
  contacts: {
    LIRAN: {
      phone: '+972000111222',
      emailAddress: 'liran@fake-email.com',
      callmebotApiKey: '<your CallMeBot api key>',
    },
    SOMEONE_ELSE: {
      phone: '+972000111222',
      emailAddress: 'someone@email.com',
      callmebotApiKey: '<your CallMeBot api key>',
    },
  },
  defaultAlertContacts: ['LIRAN'],
  defaultAlertPlatforms: ['WHATSAPP', 'EMAIL'],
  sendgrid: {
    apiKey: '<your SendGrid api key>',
    sendFrom: '<your sender email as configured in SendGrid>'
  }
};
```

you could of course add as much configuration as you pleased, as well as multiple contacts.

## processFinances.js
feel free to write whatever custom logic for your alerts. example:
```js
const config = require('./config');
const { CONTACTS, PLATFORMS, addAlert } = require('./src/utils/alert');
const { log } = require('./src/utils/logger');
const formatNis = require('./src/utils/formatNis');

const { LIRAN, SOMEONE } = CONTACTS;
const { WHATSAPP, EMAIL } = PLATFORMS;

function processFinances(financeResults) {
  log(JSON.stringify({ financeResults }, null, 3));

  _leumi(financeResults);
//   _leumiGemelIRA(financeResults);
//   _leumiHishtalmutIRA(financeResults);
//   _hapoalim(financeResults);
//   _beinleumi(financeResults);
}

module.exports = processFinances;

function _leumi(financeResults) {
  const { leumi } = financeResults;
  if (!leumi) return;

  const { balance, txns } = leumi.accounts.find(({ accountNumber }) => accountNumber === config.leumi.accountMain);
  if (balance < 5000) {
    addAlert({
      msg: `Leumi Main account balance ${formatNis(balance)} is too low and at risk to turn negative.`,
    });
  }

  const salaryTransaction = txns.find((txn) => txn.memo.includes('משכורת'));
  if (salaryTransaction) {
    addAlert({
      msg: `Leumi Main account received a payroll of ${formatNis(salaryTransaction.chargedAmount)} with total balance of ${formatNis(balance)}.`,
    });
    // positive balance alerts only on Mondays
  } else if (balance > 10000 && new Date().getDay() === 1) {
    addAlert({
      to: [LIRAN, SOMEONE],
      platforms: [WHATSAPP, EMAIL],
      msg: `Leumi Main account balance ${formatNis(balance)} is still high.`,
    });
  }
}
```

Note that `addAlert` can get optional target platforms and/or contacts arguments.

## Scheduled triggers
Follow [this guide](https://smallbusiness.chron.com/schedule-automator-tasks-mac-os-x-39132.html) to schedule an automated trigger of this script.

## Logs
Log files are written automatically to path `~/Library/Logs/finance-notifier/`