export default function setAdditionalHeaders(config) {
  // requestHeaders are set when a method fires and applies to only one request
  if (config.requestHeaders) {
     config.headers = {...config.headers, ...config.requestHeaders}
  }
};
