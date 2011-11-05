
module.exports.default = function(test) {

    // the default logger provided for the user
    var logger = require('../logger').default();

    var captured;
    function capture(entry) {
        // time always changes...
        delete entry.timestamp;
        captured = entry;
    }

    // capture out final log events
    logger.push_decorator(capture);

    logger.warn('help');
    test.deepEqual({
        level: logger.WARN,
        filename: __filename,
        lineno: 17,
        message: 'help',
    }, captured);

    test.done();
};

// test creating a new blank logger
module.exports.blank = function(test) {

    // use create instead of the global logger to prevent
    // stomping on decorators for other tests
    var logger = require('../logger').create();

    var captured;
    function capture(entry) {
        captured = entry;
    }

    // capture out final log events
    logger.push_decorator(capture);

    logger.panic('help');
    test.deepEqual({level: logger.PANIC}, captured);

    test.done();
};

