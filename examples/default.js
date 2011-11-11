// get a basic logger that will write the final entry to stdout
var log = require('../logger').default({stdout: true});

log.info('hello world');

process.on('exit', function() {
    log.panic('exiting!');
});

