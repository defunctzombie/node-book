
/// manage logging facilities
var Logger = function() {
    var self = this;

    // setup the initial middleware
    // just creates the entry object and then starts the chain of execution
    // for all of the remaining middleware
    self._last_middlware = self._initial_middleware = {};

    // constants
    // repeated here for easy acces since usually we have an instance
    Object.defineProperty(self, 'PANIC', { value: 0 });
    Object.defineProperty(self, 'ERROR', { value: 1 });
    Object.defineProperty(self, 'WARN',  { value: 2 });
    Object.defineProperty(self, 'INFO',  { value: 3 });
    Object.defineProperty(self, 'DEBUG', { value: 4 });
    Object.defineProperty(self, 'TRACE', { value: 5 });
};

// add middleware, order matters
Logger.prototype.use = function(fn) {
    var self = this;

    // create a function 'next' on the last decorator
    // that will chain to the newly added decorator
    // this of it like a linked list
    self._last_middlware.next = function(entry, args) {

        fn.apply(entry, args);
        if (fn.next) {
            fn.next(entry, args);
        }
    }

    // newly added decorator is now the last decorator
    self._last_middlware = fn;
    return self;
};

/// DEPRECATED
Logger.prototype.push_decorator = Logger.prototype.use;

/// this exists so that the trace decorator can trim off library calls
var log = function(level, args) {
    var self = this;

    var entry = {
        level: level
    };

    self._initial_middleware.next(entry, args);
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

var middleware = {
    base: require('./lib/base'),
    trace: require('./lib/trace'),
    stdout: require('./lib/stdout'),
    hostname: require('./lib/hostname'),
    timestamp: require('./lib/timestamp'),
};

/// constants
module.exports.PANIC = 0;
module.exports.ERROR = 1;
module.exports.WARN =  2;
module.exports.INFO =  3;
module.exports.DEBUG = 4;
module.exports.TRACE = 5;

/// builtin middleware
module.exports.middleware = middleware;

// DEPRECATED
module.exports.decorators = middleware;

/// create a new logger with no middleware
module.exports.blank = function(middleware) {
    var log = new Logger();

    if (middleware) {
        middleware.forEach(function(fn) {
            log.use(fn);
        });
    }

    return log;
};

/// create a default logger with some helpful middleware
module.exports.default = function(options) {
    var options = options || {};

    var logger = new Logger()
        .use(middleware.base())
        .use(middleware.timestamp())
        .use(middleware.hostname())

    // default trace level is warnings only
    if (options.trace === undefined) {
        options.trace = module.exports.WARN;
    }

    // if user wanted a higher trace level, use it
    if (options.trace !== false) {
        logger.use(middleware.trace(log, 1, options.trace));
    }

    // did the user want stdout?
    if (options.stdout === undefined || options.stdout === true) {
        logger.use(middleware.stdout());
    }

    return logger;
};

// automatically created logger if user called panic, error, warn, etc
// on the module directly
var auto;

function mk_module_log(level) {
    return function() {
        if (!auto) {
            auto = module.exports.default();
        }
        return log.call(auto, level, arguments);
    }
}

// module level methods for those that just want to start logging
// and don't want to fuss with any setup
module.exports.panic = mk_module_log(0);
module.exports.error = mk_module_log(1);
module.exports.warn = mk_module_log(2);
module.exports.info = mk_module_log(3);
module.exports.debug = mk_module_log(4);
module.exports.trace = mk_module_log(5);

