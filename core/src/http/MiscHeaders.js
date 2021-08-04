/**
 * Class to add misc headers
 */
 class MiscHeaders {
  /**
   * Adds the misc headers
   *
   * @param {Object} config - config of the request
   * @param {AuthContext} context - auth context for access token redemption
   */
  setMiscHeaders(config, context) {
      if(context && Object.keys(context.miscHeaders).length > 0){
          if (context.miscHeaders.jsonError){
              config.headers['token-json-error'] = context.miscHeaders.jsonError;
          }
      }
  }
}

export default MiscHeaders;
