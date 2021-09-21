const retry = require('retry');
const { log } = require('./logger');

function withRetry(callback) {
  return (...args) => {
    const operation = retry.operation({ retries: 0 });

    return new Promise((resolve, reject) => {
      operation.attempt(async function (currentAttempt) {
        try {
          const result = await callback(...args);
          resolve(result);
        } catch (err) {
          log(`attempt #${currentAttempt} failed. error: ${err.message}`);
          if (operation.retry(err)) {
            return;
          }
          reject(err);
        }
      });
    });
  };
}

module.exports = withRetry;
