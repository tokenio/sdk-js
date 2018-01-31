const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';
import FileSystem from '../../src/security/PromiseFileSystem';
import Util from '../../src/Util';

let fs;
let path;
let testDir;

if (!BROWSER) {
    fs = require('fs-extra');
    path = require('path');

    // Goes back four dirs to find project base. Does this in order to create the testing dir
    // in the right place. Assumes process argv[1] is mocha binary
    testDir = path.join(path.join(
            path.dirname(path.dirname(path.dirname(path.dirname(process.argv[1])))),
            'test'), 'testDir');
}

describe('Filesystem', () => {
    if (!BROWSER) {
        before('Should clean up the test directory', async () => {
            await fs.remove(testDir);
            const dirExists = await fs.exists(testDir);
            assert(!dirExists);
            FileSystem.dirRoot = testDir;
        });

        it('should write and read a file', async () => {
            const randomFilename = Util.generateNonce();

            await FileSystem.writeFile(randomFilename, '12345');
            const result = await FileSystem.readFile(randomFilename);

            const fileExists = await fs.exists(path.join(testDir, randomFilename));

            assert(fileExists);
            assert.equal(result, '12345');
        });

        it('should fail to read a nonexistant file', async () => {
            const randomFilename = Util.generateNonce();
            try {
                await FileSystem.readFile(randomFilename);
                return Promise.reject('Should throw an error');
            } catch (error) {
                assert.equal(error.code, 'ENOENT');
            }
        });

        it('should create an empty file', async () => {
            const randomFilename = Util.generateNonce();

            await FileSystem.writeFile(randomFilename, '');
            const result = await FileSystem.readFile(randomFilename);

            const fileExists = await fs.exists(path.join(testDir, randomFilename));

            assert(fileExists);
            assert.equal(result, '');
        });

        it('should override a file', async () => {
            const randomFilename = Util.generateNonce();

            await FileSystem.writeFile(randomFilename, '12345');
            await FileSystem.writeFile(randomFilename, JSON.stringify({a: 1, b: 2}));
            const result = await FileSystem.readFile(randomFilename);

            const fileExists = await fs.exists(path.join(testDir, randomFilename));

            assert(fileExists);
            assert.deepEqual(JSON.parse(result), {a: 1, b: 2});
        });

        after('Should clean up the test directory', async () => {
            await fs.remove(testDir);
            const dirExists = await fs.pathExists(testDir);
            assert(!dirExists);
        });
    }
});
