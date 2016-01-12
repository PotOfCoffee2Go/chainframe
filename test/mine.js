/**
 * Created by PotOfCoffee2Go on 1/11/2016.
 *
 */
'use strict'; // always!

// util needed to inherit ChainFrame prototype functions
//  and of course - we require ChainFrame itself
const util = require('util');
const ChainFrame = require('../chainer').ChainFrame;

/*************************************
 * Define Test object of chainable objects
 *  Minimum requied to implement ChainFrame
 *   (of course, you can add additional variables for storing stuff)
 * @constructor
 */
function Test() {
    // Init inherited ChainFrame object
    ChainFrame.call(this);
}
// Inherit functions from ChainFrame's prototype
util.inherits(Test, ChainFrame);
/*************************************/


// We'll be reading a file
var fs = require('fs');

// Define chainable functions
//  The function name defined in variable 'fn' is important - it will be used as the 'chain' name.
//   For example, the first two functions below ('function1' and 'function2') are chained 
//   by the statement 'test.function1().function2()'

//   The values returned by functions will be passed to the next Method in your chain

//   For asynchronous functions, the 'callbackParam' informs ChainFrame the parameter which is
//     the callback called by the async function when complete.
//   The absence of the 'callbackParam' variable indicates the function is synchronous

//   Also note: 'this' by default is the instance of your Test object. Of course, you can use 
//    javascript's 'bind' to change as needed.

var testMethods = [{
    fn: function function1(previousMethod) {
        console.log('---------------');
        console.log('Chain to sync Method - function1');
        console.log('Previous method returned: ' + previousMethod);
        return 'value returned by function1';
    }
}, {
    callbackParam: 'callback',
    fn: function function2(previousMethod, callback) {
        console.log('---------------');
        console.log('Chain to async Method - function2');
        console.log('Previous method returned: ' + previousMethod);
        console.log('wait 4 seconds...');
        setTimeout(function() {
            console.log('...done waiting');
            callback('value returned by function2');
        }.bind(this), 4000);
    }
}, {
    callbackParam: 'cb',
    fn: function repeat10Async(cb) {
        console.log('---------------');
        console.log('Chain to async Method - repeat10Async');
        console.log('Repeat a function 10 times....');
        var interval = null, intervalCounter = 0;
        var repeatFn = function(){
             if(intervalCounter++ <= 9) {
                  console.log('     number: %d', intervalCounter);
             } else {
                    clearInterval(interval);
                    console.log('...repeating done');
                    cb();
             }
        };
        interval = setInterval(repeatFn,1000)
    }
}, {
    fn: function repeat2Sync() {
        console.log('---------------');
        console.log('Chain to sync Method - repeat2Sync');
        for (var i = 1; i < 3; i++) {
            console.log('     number: %d', i);
        }
    }
}, {
    callbackParam: 'cb',
    fn: function readTestFile(inFilePath, cb) {
        console.log('---------------');
        console.log('Chain to async Method - readTestFile');
        console.log('Read the file: %s', inFilePath);
        console.log("  and pass fs.readFile()'s callback arguments (err, data) to next in chain");
        fs.readFile(inFilePath, cb);
    }
}, {
    fn: function displayTestFile(err, data) {
        console.log('---------------');
        console.log('Chain to sync Method - displayTestFile');
        if (err) throw err;
        var MyData = JSON.parse(data);
        console.log('Content read :');
        console.log(util.inspect(MyData));
    }
}];

// Create an instance of 'Test' object
var test = new Test();
// Add the functions defined in 'testMethods' to the instance
//  @param Test is the constructor
//  @param test is the instance
//  @param testMethods is an Array of chainable functions
test.chainFrameAdd(Test, test, testMethods);

// Run a chain
test
    .function1()
    .function2()
    .function2('arguments overridden - see the chain!')
    .repeat10Async()
    .readTestFile('./test.json')
    .displayTestFile()
    .repeat2Sync()
    .chainRun();
