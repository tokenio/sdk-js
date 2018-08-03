var utils = require('axios/lib/utils');
var buildURL = require('axios/lib/helpers/buildURL');
var isURLSameOrigin = require('axios/lib/helpers/isURLSameOrigin');
var btoa = (typeof window !== 'undefined' && window.btoa) || require('axios/lib/helpers/btoa');

/**
 * Axios adapter to create a blocking XMLHttpRequest
 * @param  {Object} config  configuration for the request
 * @return {Promise}        response - response object with a 'dispatchRequest' function
 *                          to trigger the blocking request
 */
export default function BlockingAdapter(config) {
  if (typeof XMLHttpRequest === 'undefined' && typeof process !== 'undefined') {
      // for node ignore request
      return new Promise(function ignoreRequest(resolve) {
        resolve({
          data: {
            dispatchRequest: function dispatchRequest() {
              // Send the request
              throw new Error('BlockingAdapter does not support node.js');
            }
          }
        });
      });
  }
  var requestData = config.data;
  var requestHeaders = config.headers;

  if (utils.isFormData(requestData)) {
    delete requestHeaders['Content-Type']; // Let the browser set it
  }

  var request = new XMLHttpRequest();

  // For IE 8/9 CORS support
  // Only supports POST and GET calls and doesn't returns the response headers.
  // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
  if (typeof window !== 'undefined' &&
      window.XDomainRequest && !('withCredentials' in request) &&
      !isURLSameOrigin(config.url)) {
    request = new window.XDomainRequest();
  }

  // HTTP basic authentication
  if (config.auth) {
    var username = config.auth.username || '';
    var password = config.auth.password || '';
    requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
  }

  request.open(config.method.toUpperCase(),
    buildURL(config.url, config.params, config.paramsSerializer), false);

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.
  if (utils.isStandardBrowserEnv()) {
    var cookies = require('axios/lib/helpers/cookies');

    // Add xsrf header
    var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) &&
        config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

    if (xsrfValue) {
      requestHeaders[config.xsrfHeaderName] = xsrfValue;
    }
  }

  // Add headers to the request
  if ('setRequestHeader' in request) {
    utils.forEach(requestHeaders, function setRequestHeader(val, key) {
      if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
        // Remove Content-Type if data is undefined
        delete requestHeaders[key];
      } else {
        // Otherwise add header to the request
        request.setRequestHeader(key, val);
      }
    });
  }

  // Add withCredentials to request if needed
  if (config.withCredentials) {
    request.withCredentials = true;
  }

  // Add responseType to request if needed
  if (config.responseType) {
    try {
      request.responseType = config.responseType;
    } catch (e) {
      if (request.responseType !== 'json') {
        throw e;
      }
    }
  }

  if (requestData === undefined) {
    requestData = null;
  }

  // Return a promise with 'dispatchRequest' function to execute the synchronous call
  return new Promise(function dispatchXhrRequest(resolve) {
    resolve({
      data: {
        dispatchRequest: function dispatchRequest() {
          // Send the request
          const res = request.send(requestData);
          return res;
        }
      }
    });
  });
};
