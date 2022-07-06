const retry = require('retry');
const { log } = require('./logger');

const { NO_RETRY } = process.env;

function withRetry(callback) {
  return (...args) => {
    // allows to run with env variable NO_RETRY=true to disable retries
    const retries = NO_RETRY ? 0 : 2;

    const operation = retry.operation({ retries, factor: 4, minTimeout: 5000 });

    return new Promise((resolve, reject) => {
      operation.attempt(async function (currentAttempt) {
        try {
          const result = await callback(...args);
          log(`received result successfully for ${args[0]}. result: ${JSON.stringify(result, null, 3)}`);
          resolve(result);
        } catch (err) {
          log(`attempt #${currentAttempt} for ${args[0]} failed. error: ${err.message}`);
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
