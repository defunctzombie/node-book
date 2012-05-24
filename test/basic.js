var assert = require('assert');

var book = require('../');

test('default', function() {

    var log = book.default({stdout: false});

    var captured;
    function capture() {
        var entry = this;
        // time always changes...
        delete entry.timestamp;
        captured = entry;
    }

    // capture out final log events
    log.use(capture);

    log.info('help');
    assert.deepEqual({
        level: book.INFO,
        message: 'help',
    }, captured);
});

test('string format', function() {

    var log = book.default({stdout: false});

    var captured;
    function capture() {
        var entry = this;
        // time always changes...
        delete entry.timestamp;
        captured = entry;
    }

    // capture out final log events
    log.use(capture);

    log.info('help %s %d', 'me', 2);
    assert.deepEqual({
        level: book.INFO,
        message: 'help me 2',
    }, captured);
});

test('blank', function() {

    var captured;
    function capture() {
        var entry = this;
        captured = entry;
    }

    // use create instead of the global book to prevent
    // stomping on middleware for other tests
    var log = book.blank([capture]);

    log.debug('help');
    assert.deepEqual({level: book.DEBUG}, captured);
});

