function run_sample(name, func) {
    var start = Date.now()/1000.0;
    var count = 1000000;
    for (var i=0 ; i<count ; ++i) {
        func('test');
    }
    var delta = Date.now()/1000.0 - start;
    var msg_per_sec = count / delta;
    console.log('%s %d (%d msg/sec)', name, delta, msg_per_sec);
}

// baseline no-op
run_sample('no op', function(s) {});

(function() {
    var log = {
        info: function (s) {
            var entry = {
                level: 0,
                message: s.toString(),
            }
        }
    };

    run_sample('simple', function(s) { log.info(s)});
})();

(function() {
    var book = require('./logger');
    var log = book.default({stdout: false});
    run_sample('book', function(s) { log.info(s); });
    run_sample('book-format', function(s) { log.info('cat: %s', s); });

    var log = book.default({trace: book.TRACE, stdout: false});
    run_sample('book-trace', function(s) { log.info(s); });

    var log = require('./logger').blank();
    log.use(function(){});
    run_sample('book-blank', function(s) { log.info(s); });
})();

(function() {
    var log = new (require('winston').Logger)();
    run_sample('winston', function(s) { log.info(s); });
})();

(function() {
    var null_stream = {
        write: function() {}
    };

    var bunyan = require('bunyan');
    var log = bunyan.createLogger({name: 'myapp', stream: null_stream});

    run_sample('bunyan', function(s) { log.info(s); });
    run_sample('bunyan-format', function(s) { log.info('cat: %s', s); });
})();

