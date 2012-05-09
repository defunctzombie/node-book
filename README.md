[![Build Status](https://secure.travis-ci.org/shtylman/node-logger.png?branch=master)](http://travis-ci.org/shtylman/node-logger)

node-logger is a flexible and extensible logging library for node.js

Instead of trying to solve the problem of figuring out what and how you want to do logging in your project, node-logger provides some basic functions for you to customize and create the logging system you want. Think of it like middleware, except for logging.

## install

npm install https://github.com/shtylman/node-logger/tarball/master

## quickstart

To get started with basic logging, just require and initialize the default
logger.

```javascript
  var log = require('logger').default();
```

You can now log using the methods: panic, error, warn, info, debug, trace

```javascript
  log.info('haters be loggin');
```

Will output (on stdout):
```[info] haters be loggin```

## how to log

Below are the basics of logging using the default logger.

There are 6 log levels ( panic | error | warn | info | debug | trace ). See the examples.

The arguments you pass to the logging functions will determine how they are processed.

```javascript
  // if the first argument is a string, it is assumed to be a format string
  // it will consume all of the remaining arguments when formatting
  log.info('hello world');
  [info] hello world
    
  log.info('secret: %d', 42);
  [info] secret 42
    
  log.info('json: %j', { secret: 42 });
  [info] { "secret": 42 }
```

```javascript
  // if the first argument is an Error
  // the logger will capture the stacktrace into error.stack of the final log entry
  log.error(new Error('fail!'));
  [error] fail!
   
  // any arguments after the first Error arg are processed as if they appeared as the first
  // you can capture an error and print other messages
  log.error(new Error('again?'), 'another %s', 'cat');
  [error] another cat
```

```javascript
  // lastly, the first argument can be an object
  // this will cause the fields of the object to the added to the fields of the final log entry
  // after the first arguments, remaining arguments are again treated as if they were the first
  log.warn({ something: 'bad' }, 'foo %s', 'bar');
  
  // will print the message, however something: 'bad' will be added to the final log item
  [warn] foo bar
```

Note: Only when a string is encountered are all of the remaining arguments consumed. Until then, each argument is processed independently as if it appeared first.

## decorators

The entire functionality of the default logger is built using 'decorators'. These act just like middleware to create a pipeline of 'features' for the logger. You can customize loggers to include/exclude any features you want.

The 'default' logger is simply a certain selection of decorators provided with the library. You are not required to use it and can roll your own custom solution.

### make your own

A decorator is simply a function which will do some processing on the logging entry. It is passed all of the arguments of the original log call (info, error, etc) and the 'this' is set to the logging entry. Your decorator should modify the fields of 'this' to add or remove relevant entries.

```javascript
  // simple decorator that adds a timestamp to the entry
  function sample_decorator() {
    var entry = this;
    
    // this is the only provided field
    // set to [0..5] 0=panic, by the called log functions
    // usually you won't change this
    entry.level; 
    
    // add a new field to our entry
    entry.timestamp = Date.now();
  }
```

Decorators are processed in the order you push them onto a logger.

### using your decorators

```javascript
  // logger.blank creates a logging object with no decorators
  var log = require('logger').blank();
  
  // remember, decorators are processed in the order you push them
  log.push_decorator(sample_decorator);
  
  // you can now call any of the logging functions
  log.info('hello');
  
  // output will depent on your decorators
  // use any of the provided decorators to build up your own logger
```

### provided decorators

There are a number of decorators shipped with the library. You can access them with:

```javascript
  var decorators = require('logger').decorators;
```

The default logger is composed of these builtin decorators. Use a blank logger if you want to pick and choose which ones to use.

#### base
> provides the basic argument processing outlined above

#### trace
> provides tracing where the log line was called. Adds 'filename' and 'lineno' fields to the log entry.
  This is different from the stack trace of Errors. This is the filename and lineno of the call site of the log line.

#### stdout
> basic printing to console

#### hostname
> inserts a 'hostname' field into the entry

#### timestamp
> inserts a 'timestamp' entry (seconds using Date.now()/1000.0)

#### git
> inserts a 'git_id' field with the current active git commit id

