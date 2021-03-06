const axios = require('axios');
const sgMail = require('@sendgrid/mail');

const config = require('../../config');
const { log } = require('./logger');

sgMail.setApiKey(config.sendgrid.apiKey);

const CONTACTS = Object.fromEntries(
  Object.keys(config.contacts).map((name) => [name, name]) //
);

const PLATFORMS = {
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
};

let accumulatedAlerts = [];

// disable SSL certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

function addAlert({ msg, to = config.defaultAlertContacts, platforms = config.defaultAlertPlatforms } = {}) {
  console.warn(`\n${msg}\n`);
  accumulatedAlerts.push({ msg, to, platforms });
}

async function sendAlerts() {
  for (const currContact of Object.keys(CONTACTS)) {
    const contactAlerts = accumulatedAlerts.filter((alert) => alert.to.includes(currContact));

    const whatsappAlerts = contactAlerts.filter((alert) => alert.platforms.includes(PLATFORMS.WHATSAPP));
    if (whatsappAlerts.length) {
      await _sendWhatsapp(currContact, whatsappAlerts);
    }

    const emailAlerts = contactAlerts.filter((alert) => alert.platforms.includes(PLATFORMS.EMAIL));
    if (emailAlerts.length) {
      await _sendEmail(currContact, emailAlerts);
    }
  }

  accumulatedAlerts = [];
}

async function _sendWhatsapp(contact, alerts) {
  const { callmebotApiKey: apikey, phone } = config.contacts[contact];
  const text = _formatWhatsappMsg(alerts);

  log(`sending whatsapp to ${phone} with text: ${text}`);
  await axios(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${apikey}`);
}

async function _sendEmail(contact, alerts) {
  const { emailAddress } = config.contacts[contact];
  const text = _formatEmailMsg(alerts);
  log(`sending email to ${emailAddress} with text: ${text}`);

  const options = {
    to: emailAddress,
    from: config.sendgrid.sendFrom,
    subject: 'Finance Alert - התרעה פיננסית',
    text,
  };
  await sgMail.send(options);
}

function _formatWhatsappMsg(alerts) {
  let whatsappMsg = '';
  while (true) {
    currAlert = alerts.shift();
    if (!currAlert) break;

    const asciNewline = '%0A';
    const asciPlus = '%2B';
    const currAlertMsg = encodeURI(currAlert.msg).replace(/\n/g, asciNewline).replace(/\+/g, asciPlus) + asciNewline + asciNewline;
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

module.exports = {
  addAlert,
  sendAlerts,
  CONTACTS,
  PLATFORMS,
};
