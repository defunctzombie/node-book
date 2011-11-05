
var logger = require('../logger');

function level_toa(level) {
    switch (level) {
        case logger.PANIC:
            return 'panic';
        case logger.ERROR:
            return 'error';
        case logger.WARN:
            return 'warn';
        case logger.INFO:
            return 'info';
        case logger.DEBUG:
            return 'debug';
        case logger.TRACE:
            return 'trace';
    }

    return 'unknown';
};

/// basic print to screen
/// just print the error message to stdout
module.exports = function() {
    return function(entry) {
        console.log(entry.timestamp +
            ' [' + level_toa(entry.level) + '] ' +
            entry.message);
    };
};

