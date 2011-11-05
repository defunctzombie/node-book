
/// unpacks and error object if the message is of
/// the builtin error type
module.exports = function() {
    return function(entry, msg) {
        if (msg instanceof Error) {
            entry.message = msg.message;
            return;
        }
        entry.message = msg.toString();
    };
};

