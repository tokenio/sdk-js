const fs = require('fs');
fs.readFile('./src/index.js.flow', 'utf8', function (err,data) {
    if (err) {
        throw err;
    }
    const result = data.replace(/.\/proto\/classes/g, '../src/proto/classes');

    fs.writeFile('dist/tokenio.js.flow', result, 'utf8', function (err) {
        if (err) throw err;
    });
});
