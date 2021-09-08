const axios = require('axios');
const sgMail = require('@sendgrid/mail');

const config = require('../../config');
const { log } = require('./logger');

sgMail.setApiKey(config.sendgrid.apiKey);

const CONTACTS = {
  LIRAN: 'LIRAN',
  ALMOG: 'ALMOG',
};

const PLATFORMS = {
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
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
      const whatsappMsg = _formatWhatsappMsg(whatsappAlerts);
      await _sendWhatsapp(currContact, whatsappMsg);
    }

    const emailAlerts = contactAlerts.filter((alert) => alert.platforms.includes(PLATFORMS.EMAIL));
    if (emailAlerts.length) {
      const emailMsg = _formatEmailMsg(emailAlerts);
      await _sendEmail(currContact, emailMsg);
    }
  }

  accumulatedAlerts = [];
}

function _formatWhatsappMsg(alerts) {
  let whatsappMsg = '';
  while (true) {
    currAlert = alerts.shift();
    if (!currAlert) break;

    const currAlertMsg = currAlert.msg.replace(/\n/g, '%0A') + '%0A%0A';
    whatsappMsg += currAlertMsg;
  }
  return whatsappMsg;
}

function _formatEmailMsg(alerts) {
  let emailMsg = '';
  while (true) {
    currAlert = alerts.shift();
    if (!currAlert) break;

    const currAlertMsg = currAlert.msg + '\n\n';
    emailMsg += currAlertMsg;
  }
  return emailMsg;
}

async function _sendWhatsapp(contact, text) {
  const { callmebotApiKey: apikey, phone } = config.contacts[contact];

  log(`sending whatsapp to ${phone} with text: ${text}`);
  return;
  await axios.get(encodeURI(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${apikey}`));
}

async function _sendEmail(contact, text) {
  const { emailAddress } = config.contacts[contact];
  log(`sending email to ${emailAddress} with text: ${text}`);

  const options = {
    to: emailAddress,
    from: 'liranbri+finance-notifier@gmail.com',
    subject: 'Finance Alert - התרעה פיננסית',
    text,
  };
  await sgMail.send(options);
}

module.exports = {
  addAlert,
  sendAlerts,
  CONTACTS,
  PLATFORMS,
};
