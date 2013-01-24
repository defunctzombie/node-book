var assert = require('assert');
var os = require('os');

var hostname = os.hostname();

var book = require('../');

test('trace', function() {
    var log = book.default({stdout: false, trace: book.WARN});

    var captured;
    function capture() {
        var entry = this;
        // time always changes...
        delete entry.timestamp;
        captured = entry;
    }

    // capture out final log events
    log.use(capture);

    // always make this variable 1+it's line number
    var lineno = 1 + 23;
    log.warn('help');
    assert.deepEqual({
        level: book.WARN,
        filename: __filename,
        lineno: lineno,
        message: 'help',
        hostname: hostname
    }, captured);
});

