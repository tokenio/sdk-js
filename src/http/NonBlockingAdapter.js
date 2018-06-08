var utils = require('axios/lib/utils');
var settle = require('axios/lib/core/settle');
var buildURL = require('axios/lib/helpers/buildURL');
var parseHeaders = require('axios/lib/helpers/parseHeaders');
var isURLSameOrigin = require('axios/lib/helpers/isURLSameOrigin');
var btoa = (typeof window !== 'undefined' && window.btoa) || require('axios/lib/helpers/btoa');

/**
 * Axios adapter to create a non-blocking XMLHttpRequest
 * @param  {Object} config  configuration for the request
 * @return {Promise}        response - response object with a 'dispatchRequest' function
 *                          to trigger the non-blocking request
 */
module.exports = function NonBlockingAdapter(config) {
  var res;

  var resolve = function(r) {
    res = r;
  };

  var reject = function(e) {
    res = e;
  };

  var requestData = config.data;
  var requestHeaders = config.headers;

  if (utils.isFormData(requestData)) {
    delete requestHeaders['Content-Type']; // Let the browser set it
  }

  var request = new XMLHttpRequest();
  var loadEvent = 'onreadystatechange';
  var xDomain = false;

  // For IE 8/9 CORS support
  // Only supports POST and GET calls and doesn't returns the response headers.
  // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
  if (process.env.NODE_ENV !== 'test' &&
      typeof window !== 'undefined' &&
      window.XDomainRequest && !('withCredentials' in request) &&
      !isURLSameOrigin(config.url)) {
    request = new window.XDomainRequest();
    loadEvent = 'onload';
    xDomain = true;
    request.onprogress = function handleProgress() {};
    request.ontimeout = function handleTimeout() {};
  }

  // HTTP basic authentication
  if (config.auth) {
    var username = config.auth.username || '';
    var password = config.auth.password || '';
    requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
  }

  request.open(config.method.toUpperCase(),
    buildURL(config.url, config.params, config.paramsSerializer), false);

  // Listen for ready state
  request[loadEvent] = function handleLoad() {
    if (!request || (request.readyState !== 4 && !xDomain)) {
      return;
    }

    // The request errored out and we didn't get a response, this will be
    // handled by onerror instead
    if (request.status === 0) {
      return;
    }

    // Prepare the response
    var responseHeaders = 'getAllResponseHeaders' in request ?
        parseHeaders(request.getAllResponseHeaders()) : null;
    var responseData = !config.responseType || config.responseType === 'text' ?
        request.responseText : request.response;
    var response = {
      data: responseData,
      // IE sends 1223 instead of 204 (https://github.com/mzabriskie/axios/issues/201)
      status: request.status === 1223 ? 204 : request.status,
      statusText: request.status === 1223 ? 'No Content' : request.statusText,
      headers: responseHeaders,
      config: config,
      request: request
    };

    settle(resolve, reject, response);

    // Clean up request
    request = null;
  };

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

  // Handle progress if needed
  if (typeof config.onDownloadProgress === 'function') {
    request.addEventListener('progress', config.onDownloadProgress);
  }

  // Not all browsers support upload events
  if (typeof config.onUploadProgress === 'function' && request.upload) {
    request.upload.addEventListener('progress', config.onUploadProgress);
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
          request.send(requestData);
          request[loadEvent].call(null);
          if (res instanceof Error) {
            throw res;
          }
          return res;
        }
      }
    });
  });
};
