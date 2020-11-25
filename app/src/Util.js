import {Util as CoreUtil} from '@token-io/core';
import config from './config.json';
import {Buffer} from 'buffer';

export default class Util extends CoreUtil {
    static enableIframePassthrough(env) {
        const conf = Util.substituteConfigsTokenPathPart(config,'');
        const suffix = conf.corsDomainSuffix;
        const url = conf.urls[env];
        if (Util.stringEndsWith(document.domain, suffix) ||
            document.domain === suffix.substring(1)) {
            const setupAPI = function() {
                window.oldXMLHttpRequest = window.XMLHttpRequest;
                window.oldFetch = window.fetch;
                window.XMLHttpRequest = this.contentWindow.XMLHttpRequest;
                window.fetch = this.contentWindow.fetch;
            };
            let iframe = document.getElementById('tokenApiIframe');
            if (iframe === null) {
                iframe = document.createElement('iframe');
                iframe.id = 'tokenApiIframe';
                iframe.src = url + '/iframe';
                iframe.style.position = 'absolute';
                iframe.style.left = '-9999px';
                iframe.onload = setupAPI;
                document.body.appendChild(iframe);
            }
        }
    }

    static disableIframePassthrough() {
        const suffix = config.corsDomainSuffix;
        if (Util.stringEndsWith(document.domain, suffix) ||
            document.domain === suffix.substring(1)) {
            if (window.oldXMLHttpRequest) {
                window.XMLHttpRequest = window.oldXMLHttpRequest;
            }
            if (window.oldFetch) {
                window.fetch = window.oldFetch;
            }
            const iframe = document.getElementById('tokenApiIframe');
            if (iframe !== null) {
                document.body.removeChild(iframe);
            }
        }
    }

    static isFirefox() {
        return typeof window.InstallTrigger !== 'undefined';
    }

    static isIE11() {
        return window.MSInputMethodContext && document.documentMode;
    }

    static isEdge() {
        return window.navigator && /Edge/.test(window.navigator.userAgent);
    }

    static btoa(s) {
        return Buffer.from(s).toString('base64');
    }
}
