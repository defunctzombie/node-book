
var util = require('util');

module.exports = function() {
    return function() {
        var entry = this;

        for (var i = 0; i<arguments.length ; ++i) {
            var arg = arguments[i];

            if (typeof arg === 'string') {
                // skip format if no arguments
                if (i + 1 >= arguments.length) {
                    return entry.message = arg;
                }

                entry.message = util.format.apply(util,
                        Array.prototype.slice.call(arguments, i));
                return;
            }
            else if (arg instanceof Error) {
                entry.message = arg.message;
                entry.error = {
                    stack: arg.stack,
                    name: arg.name,
                }
                continue;
            }

            // arg1 is additional fields
            var fields = Object.keys(arg);
            fields.forEach(function(key) {
                entry[key] = arg[key];
            });
        }
    };
};
