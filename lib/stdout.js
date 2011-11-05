
/// basic print to screen
/// just print the error message to stdout
module.exports = function() {
    return function(entry) {
        console.log(entry);
    };
};

