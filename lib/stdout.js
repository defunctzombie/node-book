var tty = require('tty');
var path = require('path');

var logger = require('../');

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

// TODO option to use colors

/// basic print to screen
/// just print the error message to stdout
module.exports = function(opt) {
    return function() {

        var entry = this;
        var level = level_toa(entry.level);
        var stream = process.stdout;

        if (entry.level <= logger.ERROR) {
            stream = process.stderr;
        }

        var color;
        if (stream.isTTY) {
            switch (entry.level) {
                case logger.PANIC:
                    color = '91';
                    break;
                case logger.ERROR:
                    color = '31';
                    break;
                case logger.WARN:
                    color = '33';
                    break;
                case logger.INFO:
                    color = '36';
                    break;
                default:
                    color = '90';
                    break;
            }
        }

        var out = '';
        if (color) {
            out += '\033[' + color + 'm';
        }

        out += '[' + level + ']\t\033[0m';

        if (entry.filename && entry.lineno) {
            out += path.basename(entry.filename) + ':' + entry.lineno + ' ';
        }

        out += entry.message;

        // if first argument is an error, print the stack
        if (arguments[0] instanceof Error) {
            out += '\n\033[90m' + arguments[0].stack + '\033[0m';
        }

        stream.write(out + '\n');
    };
};

