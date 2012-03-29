
/// timestamp decorator
/// adds a timestamp field with current time in second
module.exports = function() {
    return function() {
        var entry = this;

        // timestamp in seconds
        entry.timestamp = Date.now()/1000.0;
    };
};

