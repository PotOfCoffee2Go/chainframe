/**
 * Created by PotOfCoffee2Go on 1/16/2016.
 *
 */
"use strict";

var fs = require('fs');
var ChainFrame = require('../chainframe');

// Create some functions to be chained:
function show(text) {
    console.log(text);
    return text;
}
var counter = 0;
function incCounter() {
    counter++;
    return counter;
}

function getPath() {return '../test/test.json';}
function readFile(inFilePath, cb) {fs.readFile(inFilePath, cb);}
function showData(err, data) {
    if (err) throw err;
    show('Data read:');
    show(data.toString());
    return ['myEvent', 'showFile is done']
}

function myEvent(data) {
    console.log('Got Event: myEvent');
    console.log(data);
}
function getMyEventData(data) {return ['myEvent', data];}
var chain = new ChainFrame();
chain
        .on('myEvent', myEvent)
        .addPrototype(ChainFrame, show)
        .addInstance(getPath)
        .addInstance(readFile, 'cb') // 'cb' is name of callback in signature of readFile(inFilePath,cb)
        .addInstance(showData)
        .addInstance(getMyEventData);

// Run method chain:

chain
        .show('hi kim')
        .getPath()
        .readFile()
        .showData()
        .setChain('kimmy');

chain
        .getChain('kimmy')
        .getChain('kimmy')
        .getChain('kimmy');
chain
        .runChain();

/*
 for(var i=0; i < 100; i++) {
 chain
 .show(incCounter())
 .getPath()
 .show()
 .readFile()
 .showData()
 }
 for(var i=0; i < 100; i++) {
 chain
 .show(incCounter())
 .getPath()
 .show()
 .readFile()
 .showData()
 }
 chain.runChain();


 console.log('--------------------------------------------');

 for(var i=0; i < 10; i++) {
 chain
 .show(incCounter())
 .getPath()
 .show()
 .readFile()
 .showData()
 }


 setInterval(function () {
 chain
 .runChain();
 chain
 .getPath()
 .show()
 .readFile()
 .showData()
 .show()
 .getMyEventData('this is myEvent data!')
 .emit()
 .runChain();


 }, 4000);
 */
