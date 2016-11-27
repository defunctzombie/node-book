# book [![Build Status](https://secure.travis-ci.org/defunctzombie/node-book.svg?branch=master)](http://travis-ci.org/defunctzombie/node-book) #

book is a flexible and extensible logging library for node.js

Instead of trying to solve the problem of figuring out what and how you want to do logging in your project, book provides some basic functions for you to customize and create the logging system you want. Think of it like middleware, except for logging.

## install

```
npm install book
```

## quickstart

To get started with basic logging, just ```require('book')``` and start logging!

```javascript
var log = require('book');

// You can now log using the methods: panic, error, warn, info, debug, trace
log.info('haters be loggin');
```

Will output (on stdout):
```
[info] haters be loggin
```

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

// will print the message 'foo bar', however the {something: 'bad'} object can be accessed in your custom middleware as you please.
[warn] foo bar
```

Note: Only when a string is encountered are all of the remaining arguments consumed. Until then, each argument is processed independently as if it appeared first.

If you want your logs to go to a file, use the [book-file](https://github.com/defunctzombie/node-book-file) module.

## options

The default logging setup will write logs to stdout. If you would like to disable this behavior use the following:

```javascript
var log = require('book').default({
  stdout: false
});
```

This will give you a new default logger with no output to stdout. For more flexible configuration read about middleware below.

## middleware

The entire functionality of the default logger is built using middleware. These create pipeline of 'features' for the logger. You can customize loggers to include/exclude any features you want. Middleware can add fields to the logging output our it can act as a transport to send the log entry someplace else.

The 'default' logger is simply a certain selection of middleware provided with the library. You are not required to use it and can roll your own custom solution.

### make your own

Middleware is simply a function which will do some processing on the logging entry. It is passed all of the arguments of the original log call (info, error, etc) and the 'this' is set to the logging entry. Your middleware should modify the fields of 'this' to add or remove relevant entries.

```javascript
// simple middleware that adds a timestamp to the entry
function sample_middleware() {
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

### using your middleware

```javascript
// book.blank creates a logging object with no middleware
var log = require('book').blank();

// remember, middleware is processed in the order you use it
log.use(sample_middleware);

// you can now call any of the logging functions
log.info('hello');

// output will depend on any middleware you have added
// use any of the provided middleware to build up your own logger
```

### attaching middleware

You can add middleware to the default logger similar to the blank logger above. Lets say we want to provide out own middleware to print to stdout. We can disable the default stdout and provide out own.

```javascript
// create a default logger with no stdout middleware
var log = require('book').default({
  stdout: false
});

log.use(function() {
  var entry = this;

  // our own code for printing to stdout
  // console.log(...);
});

// this will use our own stdout middleware
log.info('hello world!');
```

### provided middleware

Book ships with some builtin middleware. You can access it with:

```javascript
var book_middleware = require('book').middleware;
```

The default logger is composed from this middleware. Use a blank logger if you want to pick and choose which ones to use.

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

### middleware modules ###

There are a number of npm modules which provide various transports and other logging features.

#### book-file ####

[book-file](https://github.com/defunctzombie/node-book-file) records your log entries to a file.

You can add the file transport to your logger using the following:

```javascript
log.use(require('book-file')({
      filename: '/path/to/file.log'
});
```

#### book-email ####

[book-email](https://github.com/defunctzombie/node-book-email) sends your log messages over email.

#### book-git ####

[book-git](https://github.com/defunctzombie/node-book-git) adds a ```commit``` field to your log entry which has the deployed git commit id.
