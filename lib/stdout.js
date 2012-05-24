
// builtin
var tty = require('tty');
var path = require('path');

// local
var logger = require('../');

var isatty = tty.isatty(1) && tty.isatty(2);

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

        // color?
        var color;
        if (isatty) {
            switch (entry.level) {
                case logger.PANIC:
                    color = '91';
                    stream = process.stderr;
                    break;
                case logger.ERROR:
                    color = '31';
                    stream = process.stderr;
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

        if (entry.error) {
            out += '\n\033[90m' + entry.error.stack + '\033[0m';
        }

        stream.write(out + '\n');
    };
};

