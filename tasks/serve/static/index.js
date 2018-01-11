const config = require('../../../config');
const spawn = require('child_process').spawn;

module.exports = () => {
    const ps = spawn('node', [config.src.serv.output.entry]);

    ps.stdout.on('data', data => console.log(data.toString()));
    ps.stderr.on('data', data => console.log(data.toString()));
    ps.on('exit', code => console.log(`node exited (code ${code.toString()})`));
};