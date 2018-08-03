let fs;
let path;

if (!BROWSER) {
    fs = require('fs');
    path = require('path');
}

class PromiseFileSystem {

    /**
     * Reads a file from the filesystem (from the given directory)
     *
     * @param {string} filename - file to read
     * @return {Promise} promise - with data
     */
    static readFile(filename) {
        if (BROWSER) return Promise.reject('Not available on browser');

        return new Promise((resolve, reject) => {
            fs.readFile(
                PromiseFileSystem._getFullFilename(filename),
                PromiseFileSystem._options,
                (err, buffer) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(buffer);
                    }
                });
        });
    }

    static writeFile(filename, data) {
        if (BROWSER) return Promise.reject('Not available on browser');

        return new Promise((resolve, reject) => {
            PromiseFileSystem._ensureExists(PromiseFileSystem.dirRoot, (err) => {
                if (err) {
                    reject(err);
                }
                fs.writeFile(
                    PromiseFileSystem._getFullFilename(filename),
                    data,
                    PromiseFileSystem._options,
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
            });
        });
    }

    static _ensureExists(path, cb) {
        if (BROWSER) return Promise.reject('Not available on browser');

        fs.mkdir(path, (err) => {
            if (err) {
                if (err.code === 'EEXIST') cb(null); // ignore folder already exists
                else cb(err);                        // something else went wrong
            } else cb(null);                         // successfully created folder
        });
    }

    static _getFullFilename(filename) {
        if (BROWSER) return Promise.reject('Not available on browser');

        return path.join(PromiseFileSystem.dirRoot, filename);
    }
}

PromiseFileSystem._options = {encoding: 'utf-8', mode: 0o600};
PromiseFileSystem.dirRoot = null;

export default PromiseFileSystem;
