/**
 * Created by PotOfCoffee2Go on 1/15/2016.
 *
 */
// Create some functions to be chained:

function first() {return 'world!';}
function second(text) {console.log('hello ' + text);}
// Create an object ‘Test’ and inherit ChainFrame in the usual boilerplate manner:

var ChainFrame = require('../chainframe');

/*************************************
 * Test is subtype of ChainFrame
 */
function Test() {
    ChainFrame.call(this);
}
// Inherit prototype from ChainFrame
Test.prototype = Object.create(ChainFrame.prototype);
Test.prototype.constructor = Test;
// Add functions to Test’s prototype to make them chainable:

Test.prototype.addToPrototype(Test, first);
Test.prototype.addToPrototype(Test, second);
// Create a couple method chains:

var test = new Test();

test.first().second().runChain();               // 'hello world!'
test.first().second('ChainFrame!').runChain();  // 'hello ChainFrame!'
