var logger = require('./logger').create();

function nulldecorator(){};
logger.push_decorator(nulldecorator);

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
run_sample('logger', function(s) { logger.info(s); });
