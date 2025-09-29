export default class AxiosHelpers {
    static isURLSameOrigin(requestURL) {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return true;
        }

        let product;
        if (typeof navigator !== 'undefined' && (
            (product = navigator.product) === 'ReactNative' ||
            product === 'NativeScript' ||
            product === 'NS')
        ) {
            return true;
        }

        const msie = /(msie|trident)/i.test(navigator.userAgent);
        const urlParsingNode = document.createElement('a');

        function resolveURL(url) {
            let href = url;
            if (msie) {
                urlParsingNode.setAttribute('href', href);
                href = urlParsingNode.href;
            }
            urlParsingNode.setAttribute('href', href);
            return {
                protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
                host: urlParsingNode.host
            };
        }

        const originURL = resolveURL(window.location.href);
        const parsed = (typeof requestURL === 'string') ? resolveURL(requestURL) : requestURL;

        return (parsed.protocol === originURL.protocol && parsed.host === originURL.host);
    }

    static encodeURLParam(val) {
        return encodeURIComponent(val)
            .replace(/%3A/gi, ':')
            .replace(/%24/g, '$')
            .replace(/%2C/gi, ',')
            .replace(/%20/g, '+')
            .replace(/%5B/gi, '[')
            .replace(/%5D/gi, ']');
    }

    static buildURL(url, params, options) {
        if (!params) {
            return url;
        }

        const hashmarkIndex = url.indexOf('#');

        if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
        }

        const _encode = options && options.encode || this.encodeURLParam;
        const serializeFn = options && options.serialize;

        let serializedParams;

        if (serializeFn) {
            serializedParams = serializeFn(params, options);
        } else {
            const parts = [];
            Object.keys(params).forEach(function(key) {
                const val = params[key];
                if (val !== null && typeof val !== 'undefined') {
                    parts.push(_encode(key) + '=' + _encode(val));
                }
            });
            serializedParams = parts.join('&');
        }

        if (serializedParams) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }

        return url;
    }

    static isFormData(thing) {
        const pattern = '[object FormData]';
        return thing && (
            (typeof FormData === 'function' && thing instanceof FormData) ||
            Object.prototype.toString.call(thing) === pattern ||
            (typeof thing.toString === 'function' && thing.toString() === pattern)
        );
    }

    static isStandardBrowserEnv() {
        let product;
        if (typeof navigator !== 'undefined' && (
            (product = navigator.product) === 'ReactNative' ||
            product === 'NativeScript' ||
            product === 'NS')
        ) {
            return false;
        }
        return typeof window !== 'undefined' && typeof document !== 'undefined';
    }

    static forEach(obj, fn) {
        if (obj === null || typeof obj === 'undefined') {
            return;
        }

        if (typeof obj !== 'object') {
            obj = [obj];
        }

        if (Array.isArray(obj)) {
            for (let i = 0, l = obj.length; i < l; i++) {
                fn.call(null, obj[i], i, obj);
            }
        } else {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    fn.call(null, obj[key], key, obj);
                }
            }
        }
    }

    static cookieRead(name) {
        const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return match ? decodeURIComponent(match[3]) : null;
    }
}
