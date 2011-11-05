
// log levels
// numeric for easy filtering
var PANIC = 0;
var ERROR = 1;
var WARN  = 2;
var INFO  = 3;
var DEBUG = 4;
var TRACE = 5;

/// manage logging facilities
var Logger = function() {
    var self = this;

    // setup the initial decorator
    // just creates the entry object and then starts the chain of execution
    // for all of the remaining decorators
    self._last_decorator = self._initial_decorator = function(level, msg) {
        var entry = {
            level: level
        };
        self._initial_decorator.next(msg, entry);
    };
};

// constants
Logger.PANIC = PANIC;
Logger.ERROR = ERROR;
Logger.WARN = WARN;
Logger.INFO = INFO;
Logger.DEBUG = DEBUG;
Logger.TRACE = TRACE;

// add a decorator, order matters
Logger.prototype.push_decorator = function(decorator) {
    var self = this;

    // create a function 'next' on the last decorator
    // that will chain to the newly added decorator
    // this of it like a linked list
    self._last_decorator.next = function(msg, entry) {
        decorator(msg, entry);
        if (decorator.next) {
            decorator.next(msg, entry);
        }
    }

    // newly added decorator is now the last decorator
    self._last_decorator = decorator;
};

Logger.prototype.log = function(level, msg) {
    // start the decorator chain processing
    this._initial_decorator(level, msg);
};

/// log a panic
Logger.prototype.panic = function(msg) {
    return this.log(PANIC, msg);
};

/// log an error
Logger.prototype.error = function(msg) {
    return this.log(ERROR, msg);
};

/// log a warning
Logger.prototype.warn = function(msg) {
    return this.log(WARN, msg);
};

/// log info
Logger.prototype.info = function(msg) {
    return this.log(INFO, msg);
};

/// log debug information
Logger.prototype.debug = function(msg) {
    return this.log(DEBUG, msg);
};

/// log trace info
Logger.prototype.trace = function(msg) {
    return this.log(TRACE, msg);
};

// default logger if user is just using the module
var default_logger = new Logger();

// expose all of the features of a logger
module.exports = default_logger;

// create a new logger, independent of the global logger or any other loggers
module.exports.create = function() {
    return new Logger();
};

// builtin decorators
module.exports.decorators = {
    trace: require('./lib/trace'),
    stdout: require('./lib/stdout'),
    hostname: require('./lib/hostname'),
    timestamp: require('./lib/timestamp'),
    error: require('./lib/error'),
};

