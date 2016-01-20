/**
 * Created by PotOfCoffee2Go on 1/18/2016.
 *
 */

var ChainFrame = require('../../ChainFrame');

function log(text) {
    console.log(text);
}

function returnExample() {
    return 'Example of return   - hello world';
}

function callbackExample(callback) {
    callback('Example of callback - hello world');
}

function asyncExample(callback) {
    setTimeout(function () {
        callback('Example of async    - hello world');
    }, 4000)
}

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
        .callbackExample()
        .log()
        .asyncExample()
        .log()
        .log('end of hello world example')
        .log('')
        .log('All of the above functions were virtually identical to ChainFrame');

// Run chain
helloWorld
        .runChain();

