const config = require('../../../config');
const spawn = require('child_process').spawn;

const {stdout, stderr} = process;

module.exports = () => {
    const ps = spawn('node', [config.src.serv.output.entry]);

    ps.stdout.on('data', data => stdout.write(data.toString()));
    ps.stderr.on('data', data => stderr.write(data.toString()));
    ps.on('exit', code => stdout.write(`node exited (${code.toString()})`));
};