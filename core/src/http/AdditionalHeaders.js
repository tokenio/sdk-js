/**
 * Class to add additional headers.
 */
 class AdditionalHeaders {
  /**
   * Adds additional headers to request config.
   *
   * @param {Object} config - config of the request
   */
  addAdditionalHeaders(config) {
    if (config.additionalHeaders) {
      config.headers = {...config.headers, ...config.additionalHeaders}
    }
  }
}

export default AdditionalHeaders;
