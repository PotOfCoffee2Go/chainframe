/**
 * Created by PotOfCoffee2Go on 1/11/2016.
 *
 */
"use strict";

var util = require('util');
var fs = require('fs');
var InheritChainerCalls = require('../chainer').InheritChainerCalls;


/*************************************
 * Test of chainable object
 * @constructor
 */
function Mine() {
    InheritChainerCalls.call(this);
}
// Inherit functions from InheritChainerCalls prototype
util.inherits(Mine, InheritChainerCalls);

var implementation = [
    {
        fn: function hi1(lastguy) {
            console.log('hi1');
            return 'hi1';
        }
    },
    {
        callbackName: 'callback',
        fn: function hi2(lastguy, callback) {
            console.log('wait a bit...');
            setTimeout(function () {
                console.log('last guy: ' + lastguy);
                console.log('hi2');
                console.log('...done waiting');
                callback('hi2');
            }.bind(this), 4000);
            return 'hi2';
        }
    },
    {
        fn: function hi3(lastguy) {
            console.log('last guy: ' + lastguy);
            console.log('hi3');
            return 'hi3';
        }
    },
    {
        fn: function hi4(lastguy) {
            console.log('last guy: ' + lastguy);
            console.log('hi4');
            return 'hi4';
        }
    },
    {
        callbackName: 'cb',
        fn: function tryit10(cb) {
            for (var i = 0; i < 10; i++) {
                console.log('tryit10 at number: %d', i);
            }
            console.log('start wait...');
            setTimeout(function () {
                console.log('...done wait');
                cb();
            }.bind(this), 4000);
        }
    },
    {
        fn: function tryit2() {
            for (var i = 0; i < 2; i++) {
                console.log('tryit2 at number: %d', i);
            }
        }
    },
    {
        callbackName: 'cb',
        fn: function readMyFile(inFilePath, cb) {
            console.log('read the file: %s', inFilePath);
            fs.readFile(inFilePath, cb);
        }
    },
    {
        fn: function processMyFile(err, data) {
            if (err) throw err;
            var MyData = JSON.parse(data);
            console.log('what was read :');
            console.log(util.inspect(MyData));
        }
    }
];

var mine = new Mine();
mine.chainAdd(Mine, mine, implementation);


mine
        .hi1()
        .hi2()
        .hi2('hi kim')
        .tryit10()
        .readMyFile('../logs/myfile.json')
        .processMyFile()
        .hi3()
        .tryit2()
        .tryit10()
        .chainRun();

