var book = require('./logger').blank();

var winston = new (require('winston').Logger)({
    transports: []
});

function nulldecorator(){};
book.use(nulldecorator);

function run_sample(name, func) {
    var start = Date.now()/1000.0;
    for (var i=0 ; i<1000000 ; ++i) {
        func('test');
    }
    var delta = Date.now()/1000.0 - start;
    console.log(name, delta);
}

function basic_logging(s) {
    var entry = {
        level: 0,
        message: s.toString(),
    }
}

run_sample('no op', function(s) {});
run_sample('simple', function(s) { basic_logging(s)});
run_sample('book', function(s) { book.info(s); });
run_sample('winston', function(s) { winston.info(s); });
