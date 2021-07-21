/**
 * Class to add sdk version and type.
 */
 class AdditionalHeaders {
  /**
   * Adds the sdk type and version to the request config.
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
