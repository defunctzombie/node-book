/// add a git_id field to the entry
/// the git_id field is the current git revision of the source tree
module.exports = function() {

    var git_id = null;

    // load git commit id
    // this is done async, which means anything logged before loaded won't
    // have a git id.
    // In practice this isn't much of a problem as the things we want to log are
    // generally not right at startup
    require('child_process').exec('cd ' + __dirname + ' && git rev-parse HEAD',
        function(err, stdout, stderr) {
        if (err) {
            return process.stderr.write(err + '\n');
        }
        git_id = stdout.trim();
    });

    return function() {
        var entry = this;
        if (git_id) {
            entry.git_id = git_id;
        }
    }
};
