const axios = require('axios');

const config = require('../../config');

const CONTACTS = {
  LIRAN: 'LIRAN',
  ALMOG: 'ALMOG',
};

const PLATFORMS = {
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
};

const phoneNumbers = {
  [CONTACTS.LIRAN]: '+972524587341',
  [CONTACTS.ALMOG]: '+972524587341',
};

const emails = {
  [CONTACTS.LIRAN]: 'liranbri@gmail.com',
  [CONTACTS.ALMOG]: 'liranbri@gmail.com',
};

let accumulatedAlerts = [];

function addAlert({ msg, to = [CONTACTS.LIRAN], platforms = [PLATFORMS.EMAIL, PLATFORMS.WHATSAPP] } = {}) {
  console.warn(`\n${msg}\n`);
  accumulatedAlerts.push({ msg, to, platforms });
}

async function sendAlerts() {
  for (const currContact of Object.keys(CONTACTS)) {
    const contactAlerts = accumulatedAlerts.filter((alert) => alert.to.includes(currContact));

    const whatsappAlerts = contactAlerts.filter((alert) => alert.platforms.includes(PLATFORMS.WHATSAPP));
    if (whatsappAlerts.length) {
      const phoneNumber = phoneNumbers[currContact];
      if (!phoneNumber) {
        throw new Error(`missing phone number for ${currContact}`);
      }

      const whatsappMsg = _formatWhatsappMsg(whatsappAlerts);
      await _sendWhatsapp(phoneNumber, whatsappMsg);
    }

    const emailAlerts = contactAlerts.filter((alert) => alert.platforms.includes(PLATFORMS.EMAIL));
    if (emailAlerts.length) {
      const emailAddress = emails[currContact];
      if (!emailAddress) {
        throw new Error(`missing email address for ${currContact}`);
      }

      const emailMsg = _formatEmailMsg(emailAlerts);
      await _sendEmail(emailAddress, emailMsg);
    }
  }

  accumulatedAlerts = [];
}

function _formatWhatsappMsg(alerts) {
  let whatsappMsg = '';
  while (true) {
    currAlert = accumulatedAlerts.shift();
    if (!currAlert) break;

    const currAlertMsg = currAlert.msg.replace(/\n/g, '%0A') + '%0A%0A';

    whatsappMsg += currAlertMsg;
  }
  return whatsappMsg;
}

function _formatEmailMsg(alerts) {
  return 'TODO" implement _formatEmailMsg';
}

async function _sendWhatsapp(phone, text) {
  console.log(`sending whatsapp to ${phone} with text: ${text}`);
  // await axios.get('https://api.callmebot.com/whatsapp.php', {
  //   params: {
  //     phone,
  //     text,
  //     apikey: config.callmebot.apikey,
  //   },
  // });
  await axios.get(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${config.callmebot.apikey}`);
}

async function _sendEmail() {}

module.exports = {
  addAlert,
  sendAlerts,
  CONTACTS,
  PLATFORMS,
};
