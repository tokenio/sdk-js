const fs = require('fs');
const path = require('path');

class PromiseFileSystem {

    /**
     * Reads a file from the filesystem (from the given directory)
     *
     * @param {string} filename - file to read
     * @return {Promise} with data
     */
    static readFile(filename) {
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
        return new Promise((resolve, reject) => {
            PromiseFileSystem._ensureExists(PromiseFileSystem.dirRoot, err => {
                if (err) {
                    reject(err);
                }
                fs.writeFile(
                    PromiseFileSystem._getFullFilename(filename),
                    data,
                    PromiseFileSystem._options,
                    err => {
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
        fs.mkdir(path, err => {
            if (err) {
                if (err.code === 'EEXIST') cb(null); // ignore folder already exists
                else cb(err);                        // something else went wrong
            } else cb(null);                         // successfully created folder
        });
    }

    static _getFullFilename(filename) {
        return path.join(PromiseFileSystem.dirRoot, filename);
    }
}

PromiseFileSystem._options = {encoding: 'utf-8', mode: 0o600};
PromiseFileSystem.dirRoot = null;

export default PromiseFileSystem;
