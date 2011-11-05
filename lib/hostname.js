// builtin
var os = require('os');

var hostname = os.hostname();

/// create a hostname decorator
module.exports = function() {
    return function(entry) {
        entry.hostname = hostname;
    }
};
