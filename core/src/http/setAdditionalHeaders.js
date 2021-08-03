export default function setAdditionalHeaders(config, defaultHeaders = {}) {
  // defaultHeaders are set when the http client class is instantiated and applies to all requests 
  if (defaultHeaders) {
    config.headers = {...config.headers, ...defaultHeaders}
  }

  // requestHeaders are set when a method fires and applies to only one request
  if (config.requestHeaders) {
     config.headers = {...config.headers, ...config.requestHeaders}
  }
};
