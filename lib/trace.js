
/// create a trace decorator
/// trace decorators add a filename and lineno to the entry
/// the filename and lineno are the locations of where the log message was
/// initially called from
module.exports = function(discard, num) {
    // used to pull out where were were called from for log messages
    var stack_capture = function(error, trace) {
        return trace[num];
    }

    return function(entry) {
        var stack_obj = {};

        // capture our call stack
        Error.captureStackTrace(stack_obj, discard);

        // override the stack trace renderer
        // this allows us to get to the actual stack object
        var save = Error.prepareStackTrace;
        Error.prepareStackTrace = stack_capture;

        // capture the stack from where we were called
        // stack is now where we were called from
        var stack = stack_obj.stack;

        // return the function to its previosu state
        Error.prepareStackTrace = save;

        entry.filename = stack.getFileName();
        entry.lineno = stack.getLineNumber();
    };
}

