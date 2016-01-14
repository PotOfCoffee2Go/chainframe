/**
 * Created by PotOfCoffee2Go on 1/11/2016.
 *
 */
'use strict';

// 
const ChainFrame = require('../chainframe');

// Define some functions 
//  The function name defined in variable 'fn' is important as it will be used as the 'chain' name.
//   For example, the first two functions below ('function1' and 'function2') are chained 
//   by the statement 'test.function1().function2()'

//   Values returned will be passed to the next Method in the chain.

//   For asynchronous functions, 'callbackParam' is the name of the callback parameter.
//   ChainFrame passes its own function in that parameter to process the callback

//   The absence of the 'callbackParam' variable indicates the function is synchronous

//   Also note: 'this' by default is the instance of your object.
//    Of course, you can use javascript's 'bind' to change as needed.

const fs = require('fs');

var testMethods = [
    {    // Synchronous function named 'function1'
        fn: function function1(text1, text2) {
            console.log('---------------');
            console.log('text1: %s text2: %s', text1, text2);
            console.log('Chain to sync Method - function1');
            return text1 + ' ' + text2;
        }
    }, { // Asynchronous function named 'function2'
         //  The callback parameter is 'allDone'
        callbackParam: 'allDone',
        fn: function function2(previousMethodResults, allDone) {
            console.log('---------------');
            console.log('Chain to async Method - function2');
            console.log('Previous method returned: ' + previousMethodResults);
            console.log('wait 4 seconds...');
            setTimeout(function () {
                console.log('...done waiting');
                allDone(previousMethodResults);
            }.bind(this), 4000);
        }
    }, {
        callbackParam: 'cb',
        fn: function repeat10Async(cb) {
            console.log('---------------');
            console.log('Chain to async Method - repeat10Async');
            console.log('Repeat a function 10 times...');
            var interval = null, intervalCounter = 0;
            var repeatFn = function () {
                if (intervalCounter++ <= 9) {
                    console.log('     number: %d', intervalCounter);
                } else {
                    clearInterval(interval);
                    console.log('...repeating done');
                    cb();
                }
            };
            interval = setInterval(repeatFn, 1000)
        }
    }, {
        fn: function repeat2Sync() {
            console.log('---------------');
            console.log('Chain to sync Method - repeat2Sync');
            for (var i = 1; i < 3; i++) {
                console.log('     number: %d', i);
            }
            return 2;
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

/*************************************/
function function3(nbr) {
    console.log('---------------');
    console.log('Chain to sync Method - function3');
    console.log('Got the number %d',nbr);
}

 /*************************************
 *  Test object inherits ChainFrame
 *
 * Declare 'Test' as object of chainable methods
 *   (of course, you can add additional variables for storing stuff)
 */
function Test() {
    // Init inherited ChainFrame object
    ChainFrame.call(this);
}
// Inherit functions from ChainFrame's prototype
Test.prototype = Object.create(ChainFrame.prototype);
// Set Test as the constructor
Test.prototype.constructor = Test;

// Different ways to add chainable functions
// Add to prototype methods defined in testMethods
Test.prototype.addChainPrototype(Test, testMethods); // Array of methods
// Add to prototype function3 
Test.prototype.addChainPrototype(Test, function3);   // Single function
// Add to prototype another function - function4
Test.prototype.addChainPrototype(Test,               // Inline
    {    // Synchronous function named 'function4'
        fn: function function4() {
            console.log('---------------');
            console.log('Chain to sync Method - function4');
    }
});

/*************************************/

// Create an instance of Test
var test = new Test();

// Run a chain
test
        .function1('hello', 'world')
        .function2()
        .function2()
        .function2('the old ball and chain')
        .repeat10Async()
        .readTestFile('../test/test.json')
        .displayTestFile()
        .repeat2Sync()
        .function3()
        .function4()
        .chainRun();
