
/// manage logging facilities
var Logger = function() {
    var self = this;

    // setup the initial decorator
    // just creates the entry object and then starts the chain of execution
    // for all of the remaining decorators
    self._last_decorator = self._initial_decorator = {};

    // constants
    // repeated here for easy acces since usually we have an instance
    Object.defineProperty(self, 'PANIC', { value: 0 });
    Object.defineProperty(self, 'ERROR', { value: 1 });
    Object.defineProperty(self, 'WARN',  { value: 2 });
    Object.defineProperty(self, 'INFO',  { value: 3 });
    Object.defineProperty(self, 'DEBUG', { value: 4 });
    Object.defineProperty(self, 'TRACE', { value: 5 });
};

// add a decorator, order matters
Logger.prototype.push_decorator = function(decorator) {
    var self = this;

    // create a function 'next' on the last decorator
    // that will chain to the newly added decorator
    // this of it like a linked list
    self._last_decorator.next = function(entry, a1, a2, a3, a4, a5) {
        decorator(entry, a1, a2, a3, a4, a5);
        if (decorator.next) {
            decorator.next(entry, a1, a2, a3, a4, a5);
        }
    }

    // newly added decorator is now the last decorator
    self._last_decorator = decorator;
    return self;
};

Logger.prototype.log = function(level, a1, a2, a3, a4, a5) {
    var self = this;

    var entry = {
        level: level
    };

    self._initial_decorator.next(entry, a1, a2, a3, a4, a5);
};

/// log a panic
Logger.prototype.panic = function(a1, a2, a3, a4, a5) {
    return this.log(this.PANIC, a1, a2, a3, a4, a5);
};

/// log an error
Logger.prototype.error = function(a1, a2, a3, a4, a5) {
    return this.log(this.ERROR, a1, a2, a3, a4, a5);
};

/// log a warning
Logger.prototype.warn = function(a1, a2, a3, a4, a5) {
    return this.log(this.WARN, a1, a2, a3, a4, a5);
};

/// log info
Logger.prototype.info = function(a1, a2, a3, a4, a5) {
    return this.log(this.INFO, a1, a2, a3, a4, a5);
};

/// log debug information
Logger.prototype.debug = function(a1, a2, a3, a4, a5) {
    return this.log(this.DEBUG, a1, a2, a3, a4, a5);
};

/// log trace info
Logger.prototype.trace = function(a1, a2, a3, a4, a5) {
    return this.log(this.TRACE, a1, a2, a3, a4, a5);
};

// create a default logger with some helpful decorators
module.exports.default = function(options) {

    // some builtin decorators for the default logger
    var trace = require('./lib/trace');
    var timestamp = require('./lib/timestamp');
    var error = require('./lib/error');
    var stdout = require('./lib/stdout');

    var options = options || {};

    var logger = new Logger()
        .push_decorator(trace(Logger.prototype.log, 1))
        .push_decorator(timestamp())
        .push_decorator(error());

    // did the user want stdout?
    if (options.stdout) {
        logger.push_decorator(stdout());
    }

    return logger;
};

// constants, for reference, chaning has no affect
module.exports.PANIC = 0;
module.exports.ERROR = 1;
module.exports.WARN =  2;
module.exports.INFO =  3;
module.exports.DEBUG = 4;
module.exports.TRACE = 5;

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
    git: require('./lib/git'),
};

