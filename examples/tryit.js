/**
 * Created by PotOfCoffee2Go on 1/15/2016.
 *
 * Example of inheriting ChainFrame and adding prototypes to inherited object
 */
var ChainFrame = require('../chainframe');

// Create some functions to be chained:
function first() {return 'world!';}
function second(text) {console.log('hello ' + text);}

// Create object ‘Test’ and inherit ChainFrame in the usual boilerplate manner:
function Test() {ChainFrame.call(this);}

// Inherit prototype from ChainFrame
Test.prototype = Object.create(ChainFrame.prototype);
Test.prototype.constructor = Test;

// Add functions to Test’s prototype to make them chainable:
Test.prototype.addToPrototype(Test, first);
Test.prototype.addToPrototype(Test, second);

// Create a couple method chains:
var test = new Test();

// Run a couple chains
test.first().second().runChain();               // 'hello world!'
test.first().second('ChainFrame!').runChain();  // 'hello ChainFrame!'
