// import Crypto from '../Crypto';
import config from "../../config.json";

class BrowserKeyStore {
    checkSchemaVersion() {
        // Clears the storage if we are using an old schema
        let savedSchemaVersion = 0;
        try {
            savedSchemaVersion = JSON.parse(window.localStorage.schemaVersion);
        } catch (syntaxError) {
            // If nothing yet in localStorage, continue
        }

        if (savedSchemaVersion < config.localStorageSchemaVersion) {
            window.localStorage.clear();
            window.localStorage.schemaVersion = JSON.stringify(config.localStorageSchemaVersion);
        }
    }

    async put(memberId, keypair) {
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (!keypair) {
            throw new Error("Don't know what key to put");
        }
        if (!keypair.level) {
            throw new Error("Invalid key structure: has no privilege level");
        }
        if (!BROWSER) {
            throw new Error("Browser Only");
        }
        this.checkSchemaVersion();

        if (!localStorage.members) {
            localStorage.members = JSON.stringify([]);
        }
        if (!JSON.parse(localStorage.members).memberId) {
            localStorage[memberId] = {};
        }
    }
    async getByLevel(memberId, level) {
        console.log("MKS.getByLevel", memberId, level);
        if (!memberId) {
            throw new Error("Invalid memberId");
        }
        if (!level) {
            throw new Error("Don't know what key level to get");
        }
    }
    async getById(memberId, keyId) {
        throw new Error(`No key with id ${keyId} found`);
    }
    async listKeys(memberId) {
    }

    static setActiveMemberId(memberId) {
    }

    static getActiveMemberId() {
    }
}

export default BrowserKeyStore;
