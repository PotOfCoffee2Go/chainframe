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

function getPath() {return '../test/test.json';}
function readFile(inFilePath, cb) {fs.readFile(inFilePath, cb);}
function showData(err, data) {
    if (err) throw err;
    show('Data read:');
    show(data.toString());
    return 'showFile is done'
}

function myEvent(data) {console.log('Got Event: myEvent');console.log(data);}
function getMyEventData(data) {return ['myEvent',data];}
var chain = new ChainFrame();
chain
        .on('myEvent', myEvent)
        .addMethod(show)
        .addMethod(getPath)
        .addMethod(readFile, 'cb') // 'cb' is name of callback in signature of readFile(inFilePath,cb)
        .addMethod(showData)
        .addMethod(getMyEventData);

// Run method chain:
//chain.emitr('myEvent','Hi kim').runChain();
chain
        .getPath()
        .show()
        .readFile()
        .showData()
        .show()
        .getMyEventData('this is myEvent data!')
        .emit()
        .runChain();
