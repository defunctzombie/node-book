// get a basic logger that will write the final entry to stdout
var log = require('..').default({stdout: true});

log.panic('panic log line');
log.error('error log line');
log.warn('warn log line');
log.info('info log line');
log.debug('debug log line');
log.trace('trace log line');

log.info('paramters: %s %s', 'foo', 'bar');
log.info('paramters: %j', {magic: 'bus'});

log.info({extra: 'payload'}, 'extra payload');

// example of difference between log line location
// and error stacktrace
function has_error(cb) {
    cb(new Error('some error'));
}

has_error(function(err) {
    log.error(err);
});

