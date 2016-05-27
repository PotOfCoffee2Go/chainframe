/**
 * Created by PotOfCoffee2Go on 1/18/2016.
 *
 */
'use strict';

var ChainFrame = require('../../ChainFrame');

/// ### Create some functions to be chained:
///   - log to console
function log(text) {
    console.log(text);
}

///   - return a value
function returnExample() {
    return 'returnExample says   - hello world';
}

///   - asynchronous passing a value to a callback function
function asyncExample(callback) {
    setTimeout(function () {
        callback('asyncExample says    - hello world');
    }, 2000)
}

///   - synchronous passing a value to a callback function
function callbackExample(callback) {
    callback('callbackExample says - hello world');
}

/// ### Create instance `helloWorld` of ChainFrame
var helloWorld = new ChainFrame();

/// Add the functions to the helloWorld instance
helloWorld
        .addToInstance(log)
        .addToInstance(returnExample)
        .addToInstance(callbackExample)
        .addToInstance(asyncExample);

/// Build method chain
helloWorld
        .log('Start hello world example')
        .returnExample()
        .log()
        .asyncExample()
        .log()
        .callbackExample()
        .log()
        .log('End of hello world example');

/// ### Run the chain
helloWorld.runChain();

