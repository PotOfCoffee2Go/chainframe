/**
 * Created by PotOfCoffee2Go on 1/18/2016.
 *
 */

function log(text) {
    console.log(text);
}

function returnExample() {
    return 'returnExample says   - hello world';
}

function asyncExample(callback) {
    setTimeout(function () {
        callback('asyncExample says    - hello world');
    }, 4000)
}

function callbackExample(callback) {
    callback('callbackExample says - hello world');
}

var ChainFrame = require('../../ChainFrame');
var helloWorld = new ChainFrame();

// Add functions to ChainFrame
helloWorld
        .addToInstance(log)
        .addToInstance(returnExample)
        .addToInstance(callbackExample)
        .addToInstance(asyncExample);

// Build method chain
helloWorld
        .log('beginning hello world example')
        .returnExample()
        .log()
        .asyncExample()
        .log()
        .callbackExample()
        .log()
        .log('end of hello world example')
        .log('')
        .log('All of the above functions were virtually identical to ChainFrame');

// Run chain
helloWorld
        .runChain();

