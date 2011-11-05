
module.exports.default = function(test) {

    var cache_loc = require.resolve('../logger');
    var logger = require('../logger');

    var captured;
    function capture(msg, entry) {
        captured = entry;
    }

    // capture out final log events
    logger.push_decorator(capture);

    logger.panic('help');
    test.deepEqual({level: 0}, captured);

    // remove the loaded logger module
    // without this, other tests won't be able to set their own decorators
    delete require.cache[cache_loc];
    test.done();
};

/*
/// all decorators are applied in the order they are added

logger.push_decorator(error_obj_decorator);
logger.push_decorator(time_decorator);
// would discard the top two elements of the stack
// this is used if you are nesting the calls to logger to get an acturate idea of
// where the actual log call came from
logger.push_decorator(trace_decorator(1));
logger.push_decorator(hostname_decorator);

// the stdout decorator requires the time decorator
logger.push_decorator(stdout_decorator);
//logger.push_decorator(git_id_decorator);

// send the log messages to a parent process
// useful if the parent process is writing logs for you
//logger.push_decorator(node_ipc());

// example of how to wrap a call to error
error = function(msg) {
    logger.error(msg);
}

error('fuck!');
*/
