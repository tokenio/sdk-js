import FileSystem from '../../src/security/PromiseFileSystem';
import Util from '../../src/Util';
const {assert} = require('chai');
const fs = require('fs-extra');
const path = require('path');
const testDir = path.join(__dirname, 'testDir');

describe('Filesystem', () => {
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
});
