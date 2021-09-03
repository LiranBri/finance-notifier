const CONTACTS = {
  LIRAN: 'LIRAN',
  ALMOG: 'ALMOG',
};

const PLATFORMS = {
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
};

const accumulatedAlerts = [];

function addAlert(alertData) {
  console.log({ alertData });
  accumulatedAlerts.push(alertData);
}

async function sendAlerts() {}

module.exports = {
  addAlert,
  CONTACTS,
  PLATFORMS,
};
