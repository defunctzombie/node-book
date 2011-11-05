
/// unpacks and error object if the message is of
/// the builtin error type
module.exports = function() {
    return function(msg, entry) {
        if (msg instanceof Error) {
            entry.message = msg.message;
            return;
        }
        entry.message = msg.toString();
    };
};

