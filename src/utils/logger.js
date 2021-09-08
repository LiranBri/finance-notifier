var logger = require('node-log-rotate');
logger.setup({
  appName: 'finance-notifier',
  maxSize: 10 * 1024 * 1024,
});

function log(msg) {
  console.log(msg);
  logger.log(msg);
}

module.exports = {
  log,
};
