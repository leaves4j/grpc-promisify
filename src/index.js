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
    // Members starting with '$' are internal only, gRPC methods cannot start with '$'
    if (functionName.startsWith('$')) {
      return;
    }
    const originalFunction = client[functionName];

    client[functionName] = (request, callback) => {
      if (callback && typeof callback === 'function') {
        return originalFunction.call(client, request, (error, response) => {
          callback(error, response);
        });
      }

      return new Promise((resolve, reject) => {
        originalFunction.call(client, request, (error, response) => {
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
      });
    };
    // Reattach the client interceptors
    client[functionName].interceptors = originalFunction.interceptors;
  });
}

module.exports = promisify;
