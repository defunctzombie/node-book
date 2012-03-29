var assert = require('assert');

var logger = require('../');

test('default', function() {

    var log = logger.default({stdout: false});

    var captured;
    function capture() {
        var entry = this;
        // time always changes...
        delete entry.timestamp;
        captured = entry;
    }

    // capture out final log events
    log.push_decorator(capture);

    // always make this variable 1+it's line number
    var lineno = 1 + 21;
    log.warn('help');
    assert.deepEqual({
        level: logger.WARN,
        filename: __filename,
        lineno: lineno,
        message: 'help',
    }, captured);
});

test('blank', function() {

    // use create instead of the global logger to prevent
    // stomping on decorators for other tests
    var log = logger.create();

    var captured;
    function capture() {
        var entry = this;
        captured = entry;
    }

    // capture out final log events
    log.push_decorator(capture);

    log.panic('help');
    assert.deepEqual({level: logger.PANIC}, captured);
});

