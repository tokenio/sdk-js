/**
 * RPC error handler that facilitates handling cross-cutting API errors. Converts generic
 * StatusRuntimeException instances into specific Exception types to be handled by the callers.
 *
 * The globalRpcErrorCallback is invoked with a {name, message} error object any time
 * a custom RPC error occurs.
 */
class ErrorHandler {
    /**
     * Creates the error handler instance.
     *
     * @param {function} globalRpcErrorCallback - callback to invoke on any cross-cutting RPC
     * call error. For example: SDK version mismatch
     */
    constructor(globalRpcErrorCallback) {
        this._globalRpcErrorCallback = globalRpcErrorCallback;
    }

    /**
     * Handles RPC error and calls the globalRpcErrorCallback.
     *
     * @param {object} error - error to handle
     * @return {object} original RPC error
     */
    handleError(error) {
        if (error.response && error.response.headers) {
            const tokenError = error.response.headers['token-error'];
            const tokenErrorDetails = error.response.headers['token-error-details'];

            if (tokenErrorDetails) {
                // Log optional error details to ease up troubleshooting.
                // Available only in non-prod deployments.
                console.log('Error details: ', tokenErrorDetails); // eslint-disable-line
            }

            if (this._globalRpcErrorCallback) {
                const name = tokenError ? tokenError : 'UNKNOWN';
                const mappedError = {
                    name,
                    message: error.response.data,
                };
                this._globalRpcErrorCallback(mappedError);
                return mappedError;
            }
        }
        return error;
    }
}

export default ErrorHandler;
