
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
    self._last_decorator.next = function(entry, args) {

        decorator.apply(entry, args);
        if (decorator.next) {
            decorator.next(entry, args);
        }
    }

    // newly added decorator is now the last decorator
    self._last_decorator = decorator;
    return self;
};

/// this exists so that the trace decorator can trim off library calls
var log = function(level, args) {
    var self = this;

    var entry = {
        level: level
    };

    self._initial_decorator.next(entry, args);
    return self;
}

function mk_log(level) {
    return function() {
        return log.call(this, level, arguments);
    }
}

// actual methods the user calls
Logger.prototype.panic = mk_log(0);
Logger.prototype.error = mk_log(1);
Logger.prototype.warn = mk_log(2);
Logger.prototype.info = mk_log(3);
Logger.prototype.debug = mk_log(4);
Logger.prototype.trace = mk_log(5);

var decorators = {
    base: require('./lib/base'),
    trace: require('./lib/trace'),
    stdout: require('./lib/stdout'),
    hostname: require('./lib/hostname'),
    timestamp: require('./lib/timestamp'),
    git: require('./lib/git'),
};

/// constants
module.exports.PANIC = 0;
module.exports.ERROR = 1;
module.exports.WARN =  2;
module.exports.INFO =  3;
module.exports.DEBUG = 4;
module.exports.TRACE = 5;

/// builtin decorators
module.exports.decorators = decorators;

/// create a new logger with no decorators
module.exports.blank = function(decorators) {
    var log = new Logger();

    if (decorators) {
        decorators.forEach(function(decorator) {
            log.push_decorator(decorator);
        });
    }

    return log;
};

/// create a default logger with some helpful decorators
module.exports.default = function(options) {
    var options = options || {};

    var logger = new Logger()
        .push_decorator(decorators.base())
        .push_decorator(decorators.timestamp())
        .push_decorator(decorators.hostname())
        .push_decorator(decorators.trace(log, 1))
        .push_decorator(decorators.git())

    // did the user want stdout?
    if (options.stdout === undefined || options.stdout === true) {
        logger.push_decorator(decorators.stdout());
    }

    return logger;
};

