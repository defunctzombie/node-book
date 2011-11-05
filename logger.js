
// log levels
// numeric for easy filtering
var PANIC = 0;
var ERROR = 1;
var WARN  = 2;
var INFO  = 3;
var DEBUG = 4;
var TRACE = 5;

// first decorator which will start off the process chain
var initial_decorator = function(level, msg) {
    var entry = {
        level: level
    };
    initial_decorator.next(msg, entry);
};

// the last decorator to be added
// this is tracked because decorators are executed in order
var last_decorator = initial_decorator;

// simple wrapper to start the decorator chain processing
var logger = function(level, msg) {
    // start the decorator chain processing
    initial_decorator(level, msg);
};

// expose the base logger which just creates a basic entry with a log level
// and then delegates work to the registered decorators
module.exports = logger;

module.exports.PANIC = PANIC;
module.exports.ERROR = ERROR;
module.exports.WARN = WARN;
module.exports.INFO = INFO;
module.exports.DEBUG = DEBUG;
module.exports.TRACE = TRACE;

/// add a new decorator to be applied when a new message is logged
/// decorators are applied in the order added
module.exports.push_decorator = function(decorator) {
    last_decorator.next = function(msg, entry) {
        decorator(msg, entry);
        if (decorator.next) {
            decorator.next(msg, entry);
        }
    }
    last_decorator = decorator;
};

/// log a panic
module.exports.panic = function(msg) {
    return logger(PANIC, msg);
};

/// log an error
module.exports.error = function(msg) {
    return logger(ERROR, msg);
};

/// log a warning
module.exports.warn = function(msg) {
    return logger(WARN, msg);
};

/// log info
module.exports.info = function(msg) {
    return logger(INFO, msg);
};

/// log debug information
module.exports.debug = function(msg) {
    return logger(DEBUG, msg);
};

/// log trace info
module.exports.trace = function(msg) {
    return logger(TRACE, msg);
};

module.exports.level_toa = function(level) {
    switch (level) {
        case PANIC:
            return 'panic';
        case ERROR:
            return 'error';
        case WARN:
            return 'warn';
        case INFO:
            return 'info';
        case DEBUG:
            return 'debug';
        case TRACE:
            return 'trace';
    }
    return 'unknown';
};

module.exports.decorators = {
    trace: require('./lib/trace'),
    stdout: require('./lib/stdout'),
    hostname: require('./lib/hostname'),
    timestamp: require('./lib/timestamp'),
    error: require('./lib/error'),
};

