const CONTACTS = {
  LIRAN: 'LIRAN',
  ALMOG: 'ALMOG',
};

const PLATFORMS = {
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
};

const accumulatedAlerts = [];

function addAlert({ msg, to = [CONTACTS.LIRAN], platforms = [PLATFORMS.EMAIL, PLATFORMS.WHATSAPP] } = {}) {
  console.warn(msg);
  accumulatedAlerts.push({ msg, to, platforms });
}

async function sendAlerts() {}

module.exports = {
  addAlert,
  CONTACTS,
  PLATFORMS,
};
