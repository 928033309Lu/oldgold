const fs = require('fs');

module.exports = function (env) {

    process.env.NODE_ENV = env;

    fs.open('./build/env.js', 'w', function(err, fd) {
        const buf = `export default "${env}";`;
        fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
    });

    return require(`./webpack.prod.config.js`)
}