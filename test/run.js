var Mocha = require('mocha');

var mocha = new Mocha;
mocha.reporter('list').ui('qunit');

mocha.addFile('test/basic.js');

mocha.run();

