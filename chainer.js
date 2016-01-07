/**
 *
 */

'use strict';
const util = require('util');
const fs = require('fs');
const EventEmitter = require('events');

function Method(fn, aArgs, isasync, callbackArgIdx) {
    this.fn = fn || this.placeholder;
    this.aArgs = aArgs || null;
    this.isasync = isasync || false;
    this.callbackArgIdx = callbackArgIdx || -1;
    this.prevMethod = null;
}

// Placeholder Method returns the arguments passed to it (as if it were not even in the Method chain)
Method.prototype.setPlaceholder = function () {
    this.fn = this.placeholder;
    this.aArgs = null;
    this.isasync = false;
    this.callbackArgIdx = -1;
    this.prevMethod = null;
};
// Placeholder function returns the arguments passed to it
Method.prototype.placeholder = function () {
    return [].slice.call(arguments);
};
Method.prototype.run = function (target, stackControl) {
    // drill down to the placeholder Method at bottom of the Method stack
    if (this.prevMethod) {
        var prevResult = this.prevMethod.run(target, stackControl); // recursive
        // if the result is the stackControl object - exit - do not process remaining Methods
        if (prevResult === stackControl) {
            return stackControl;
        }
        // use the arguments that were passed when the Method was created
        //   if none - use arguments that were returned by the previous method
        if (!this.aArgs) {
            if (Object.prototype.toString.call(prevResult) === '[object Array]') {
                this.aArgs = prevResult;
            }
            else {
                this.aArgs = new Array(prevResult);
            }
        }
    }
    // if async will stop execution of the stack
    if (this.isasync) {
        // remember the async function to call and it's arguments
        //  and where the callback is located in the arguments (if any)
        stackControl.fn = this.fn;
        stackControl.aArgs = this.aArgs;
        stackControl.callbackArgIdx = this.callbackArgIdx;
        // make this Method a placeholder function (for re-entry when async function is done)
        this.setPlaceholder();
        // signal to exit by returning with the stackControl object
        return stackControl;
    }
    // run the function
    var result = this.fn.apply(target, this.aArgs);
    this.setPlaceholder();
    return result;
};

function MethodChainer(target) {
    // Methods will be bound ('this') to target object
    this.target = target;

    // create empty list of Methods that can be chained in a sequence using . (Dot Notation)
    this.methodList = {};

    // create the Method stack which represents the sequence of chained Methods
    //  put a placeholder Method on it
    //  note: technically methodStack is a linked list via method.prevMethod
    this.methodStack = new Method();

    // init inherited nodejs 'EventEmitter'
    //  emitter use is convenient but optional, direct callbacks are faster
    EventEmitter.call(this);
    // setup event listeners that push/run Methods on the methodStack
    this
            .on('push', this.push)
            .on('run', this.run);
}

// Inherit functions from 'EventEmitter' prototype
util.inherits(MethodChainer, EventEmitter);

MethodChainer.prototype.push = function (method) {
    method.prevMethod = this.methodStack;
    this.methodStack = method;
};
MethodChainer.prototype.run = function () {
    // got arguments so place them in the placeholder Method at the bottom of the stack
    if (arguments.length) {
        var bottomMethod = this.methodStack;
        // work our way to the placeholder Method at the bottom of the stack
        while (bottomMethod.prevMethod) {
            bottomMethod = bottomMethod.prevMethod;
        }
        // set it's arguments
        bottomMethod.aArgs = [].slice.call(arguments);
    }
    // run the Method stack - info will be in stackControl
    var stackControl = {};
    this.methodStack.run(this.target, stackControl);
    // if stackControl contains a function - run it - (will be an asynchronous function)
    if (stackControl.fn) {
        if (stackControl.callbackArgIdx === -1) {
            stackControl.aArgs.push(this.run.bind(this))
        }
        else {
            stackControl.aArgs.splice(stackControl.callbackArgIdx, 0, this.run.bind(this));
        }
        stackControl.fn.apply(this.target, stackControl.aArgs);
    }
};


function InheritChainCalls() {
    this.chainer = new MethodChainer(this);
}
InheritChainCalls.prototype.chainPush = function (method) {
    this.chainer.push(method);
};

InheritChainCalls.prototype.chainRun = function (method) {
    this.chainer.run(method);
};

InheritChainCalls.prototype.chainEmit = function (eventName, method) {
    this.chainer.emit(eventName, method);
};


/**
 * Test of chainable object
 * @constructor
 */
function Mine() {
    // init inherited 'MixinChain'
    InheritChainCalls.call(this);
//    this.chainer.push(new Method(this.hi1, ['starter'])); // overriding args
    this.chainPush(new Method(this.hi1));
    this.chainEmit('push', new Method(this.hi2, null, true));
    this.chainEmit('push', new Method(this.hi3));
    this.chainEmit('push', new Method(this.hi4));
    this.chainPush(new Method(this.readMyFile, ['./logs/myfile.json'], true));
    this.chainPush(new Method(this.processMyFile));
//    this.chainEmit('run');
    this.chainRun();
}

// Inherit functions from InheritChainCalls prototype
util.inherits(Mine, InheritChainCalls);

Mine.prototype.hi1 = function (lastguy) {
    console.log('hi1');
    return 'hi1';
};
Mine.prototype.hi2 = function (lastguy, callback) {
    console.log('wait a bit...');
    setTimeout(function () {
        console.log('last guy: ' + lastguy);
        console.log('hi2');
        console.log('...done waiting');
        callback('hi2');
    }.bind(this), 4000);
    return 'hi2';
};
Mine.prototype.hi3 = function (lastguy) {
    console.log('last guy: ' + lastguy);
    console.log('hi3');
    return 'hi3';
};
Mine.prototype.hi4 = function (lastguy) {
    console.log('last guy: ' + lastguy);
    console.log('hi4');
    return 'hi4';
};

Mine.prototype.readMyFile = function (inFilePath, cb) {
    fs.readFile(inFilePath, cb);
};
Mine.prototype.processMyFile = function (err, data) {
    if (err) throw err;
    var MyData = JSON.parse(data);
    console.log(util.inspect(MyData));
};


var mine = new Mine();


//console.log(util.inspect(chainer.methods));

var counter = 0;

function inc() {
    console.log('counter: ' + counter.toString());

}
