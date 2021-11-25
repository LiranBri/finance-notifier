const retry = require('retry');
const { log } = require('./logger');

function withRetry(callback) {
  return (...args) => {
    const operation = retry.operation({ retries: 6, factor: 4 });

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
