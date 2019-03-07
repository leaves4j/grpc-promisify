/**
 * Created by jiangq on 2016/11/1.
 * Description: a grpc promisify hack module
 */

/**
 * promisify
 * @param client grpc client
 */
function promisify(client) {
  Object.keys(Object.getPrototypeOf(client)).forEach(functionName => {
    const originalFunction = client[functionName];

    client[functionName] = (request, options, callback) => {
      if (options && typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (!options) {
        options = {};
      }

      if (callback && typeof callback === 'function') {
        return originalFunction.call(client, request, options, (error, response) => {
          callback(error, response);
        });
      }

      return new Promise((resolve, reject) => {
        originalFunction.call(client, request, options, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
      });
    };
  });
}

module.exports = promisify;
