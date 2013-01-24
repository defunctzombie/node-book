
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
                // custom fields are captured by whatever wants to capture them
                continue;
            }
        }
    };
};
