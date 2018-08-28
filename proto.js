/* eslint-disable no-console, max-len */
const TOKEN_PROTO_VER = process.argv[2];

if (!TOKEN_PROTO_VER) throw 'Must specify a Token protobuf version!';

const file = `tokenio-proto-common-${TOKEN_PROTO_VER}.jar`;
const url = `https://token.jfrog.io/token/libs-release/io/token/proto/tokenio-proto-common/${TOKEN_PROTO_VER}/${file}`;

const fs = require('fs');
const util = require('util');
const axios = require('axios');
const {resolve} = require('path');
const exec = util.promisify(require('child_process').exec);

async function downloadProtoAndGenerateClasses() {
    await exec('rm -rf proto');
    const path = resolve(__dirname, 'proto', 'proto.jar');
    console.log(`Downloading proto version ${TOKEN_PROTO_VER}...`);
    const res = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
    });
    await exec('mkdir proto');
    console.log('Writing proto to file...');
    res.data.pipe(fs.createWriteStream(path));
    res.data.on('end', async () => {
        console.log('Unzipping proto JAR...');
        await exec('unzip -d proto proto/proto.jar *.proto');
        console.log('Generating classes...');
        await exec('yarn pbjs -t static-module -w es6 --no-encode --no-decode --no-verify --no-delimited --no-beautify --no-comments -o src/proto/gen/proto.js proto/*.proto');
        console.log('Cleaning up...');
        await exec('rm -rf proto');
        console.log('Done!');
    });
    res.data.on('error', (e) => Promise.reject(e));
}

downloadProtoAndGenerateClasses();
