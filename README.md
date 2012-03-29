node-logger is a flexible logging library for node.js

Instead of trying to solve the problem of figuring out what and how you want to do logging in your project, node-logger provides some basic functions for you to customize and create the logging system you want. Think of it like middleware, except for logging.

## install

npm install https://github.com/shtylman/node-logger/tarball/master

## quickstart

To get started with basic logging, just require and get the default
logger.

```var log = require('logger').default();```

You can now log using the methods: panic, error, warn, info, debug, trace

```log.info('haters be loggin');```

Will output (on stdout):
```[info] haters be loggin```

## details

The above is a basic and quite boring example, the thing that really makes node-logger shine is the flexibility. Almost nothing about the above logging method is required by the library; a logger is composed of 'decorators' which can add arbitrary fields to the logging entry. A decorator can even write the log entry to a file or do anything else you might want.

To recreate the default logger we can use the builtin decorators.

While node-logger can be used to do your logging directly, it is meant to be thinly wrapped and adapted to your project's needs.

```
// this will create a default blank logger for us
// a blank logger just has the panic, error, etc... methods and nothing else
var log = require('logger').create();
```

Our default logger has a few elements:
* git id
* Error stacktrace (if relevant)
* time
* message
* hostname
* stdout printing

We can recreate them with the following:

```
var decorators = require('logger').decorators;

// basic logger functionality
// processes the initial arguments
log.push_decorator(decorators.base());

// adds a timestamp entry (our stdout decorator uses this)
log.push_decorator(decorators.timestamp());

// print the message to console
log.push_decorator(decorators.stdout());
```

That is it! You can now call the panic, error, etc methods and every call will execute the added decorators in the order you specified.

## builtin decorators

node-logger comes with some builtin decorators that you might find useful:

### trace
> provides tracing where the log line was called. Adds 'filename' and 'lineno' fields to the log entry.

### stdout
> basic printing to console

### hostname
> inserts a 'hostname' field into the entry

### timestamp
> inserts a 'timestamp' entry (seconds using Date.now()/1000.0)

### base
> processes the arguments to the logging functions

### git
> inserts a 'git_id' field with the current active git id

## custom decorators

Writing a decorator for your needs is very easy. A decorator is just a function that has the following signature: function(...).

'this' is the object which contains the fields and other modifications from previous decorators.

All other arguments to the function will be passed along. See lib/base.js for an example of how to consume arguments.

a1...a5 are the arguments you passed in when calling your log method. Usually you will just use a1 (as a string or Error object) but node-logger is flexible and you can make whatever decorator you want. A simple decorator would be one that wraps util.format and allows you to format strings while keeping your logging calls concise.
