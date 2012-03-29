
var util = require('util');

module.exports = function() {
    return function() {
        var entry = this;

        for (var i = 0; i<arguments.length ; ++i) {
            var arg = arguments[i];

            if (arg instanceof Error) {
                entry.message = arg.message;
                entry.error = {
                    stack: arg.stack,
                    name: arg.name,
                }
                continue;
            }
            else if (typeof arg === 'string') {
                entry.message = util.format.apply(util,
                        Array.prototype.slice.call(arguments, i));
                return;
            }

            // arg1 is additional fields
            var fields = Object.keys(arg);
            fields.forEach(function(key) {
                entry[key] = arg[key];
            });
        }
    };
};
