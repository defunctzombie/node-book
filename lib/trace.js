var ErrorStackParser = require('error-stack-parser');

/// create a trace decorator
/// trace decorators add a filename and lineno to the entry
/// the filename and lineno are the locations of where the log message was
/// initially called from
module.exports = function(discard, num, ignore) {

    return function() {
        var entry = this;

        // don't add trace info to ignored levels
        if (entry.level > ignore) {
            return;
        }

        var stack_obj = {};

        // capture our call stack
        // discarding anything after the "discard" function
        Error.captureStackTrace(stack_obj, discard);

        var frames = ErrorStackParser.parse(stack_obj);
        if (num >= frames.length) {
            return;
        }


        var frame = frames[num];
        entry.filename = frame.fileName;
        entry.lineno = frame.lineNumber;
    };
}

