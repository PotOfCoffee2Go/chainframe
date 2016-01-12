/**
 * Created by PotOfCoffee2Go on 1/11/2016.
 *
 */
'use strict'; // always!

const ChainFrame = require('../chainer').ChainFrame;

// We'll be reading a file
const fs = require('fs');

// Define chainable functions
//  The function name defined in variable 'fn' is important as it will be used as the 'chain' name.
//   For example, the first two functions below ('function1' and 'function2') are chained 
//   by the statement 'test.function1().function2()'

//   Values returned will be passed to the next Method in your chain.

//   For asynchronous functions, the 'callbackParam' is the name of the callback parameter.
//   The absence of the 'callbackParam' variable indicates the function is synchronous

//   Also note: 'this' by default is the instance of your object inherited from ChainFrame.
//    Of course, you can use javascript's 'bind' to change as needed.

var testMethods = [
{
    fn: function function1() {
        console.log('---------------');
        console.log('Chain to sync Method - function1');
        return 'This string was returned by function1';
    }
}, {
    callbackParam: 'callback',
    fn: function function2(previousMethodResults, callback) {
        console.log('---------------');
        console.log('Chain to async Method - function2');
        console.log('Previous method returned: ' + previousMethodResults);
        console.log('wait 4 seconds...');
        setTimeout(function() {
            console.log('...done waiting');
            callback('This string was returned by function2');
        }.bind(this), 4000);
    }
}, {
    callbackParam: 'cb',
    fn: function repeat10Async(cb) {
        console.log('---------------');
        console.log('Chain to async Method - repeat10Async');
        console.log('Repeat a function 10 times...');
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
        console.log(MyData);
    }
}];


var test2Methods = [{
    fn: function function123() {
        console.log('---------------');
        console.log('Chain to sync Method - function1');
        return 'Doctor Who';
    }
}];

/*************************************
 *  Test object inherits ChainFrame
 *
 * Declare 'Test' as object of chainable methods
 *   (of course, you can add additional variables for storing stuff)
 */
function Test() {
    // Init inherited ChainFrame object
    ChainFrame.call(this,Test,testMethods);
}
// Inherit functions from ChainFrame's prototype
Test.prototype = Object.create(ChainFrame.prototype);
// Set Test as the constructor
Test.prototype.constructor = Test;
/*************************************/

// Create an instance of Test
var test = new Test();

// Run a chain
test
    .function1()
    .function2()
    .function2()
    .function2('the old ball and chain')
    .repeat10Async()
    .readTestFile('./test.json')
    .displayTestFile()
    .repeat2Sync()
    .chainRun();
