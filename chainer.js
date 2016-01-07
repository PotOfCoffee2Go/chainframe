/**
 *
 */

'use strict';
const util = require('util');
const fs = require('fs');
const EventEmitter = require('events');

/*************************************
 * Returns a Method object which can be chained with other Method objects
 *
 * @param fn                function that this Method calls
 * @param aArgs             arguments passed to 'fn'
 * @param isAsync           is 'fn' an asynchronous function?
 * @param callbackArgIdx    if 'fn' has a callback in 'aArgs' where is it?
 * @constructor
 */
function Method(fn, aArgs, isAsync, callbackArgIdx) {
    this.fn = fn || this.placeholderFn;
    this.aArgs = aArgs || null;
    this.isAsync = isAsync || false;
    this.callbackArgIdx = callbackArgIdx || -1;
    this.prevMethod = null;
}

// Note: a Placeholder Method returns the arguments passed to it
//  (as if it were not even in the Method chain)

// Reset a Method to be a placeholder
Method.prototype.setAsPlaceholder = function () {
    this.fn = this.placeholderFn;
    this.aArgs = null;
    this.isAsync = false;
    this.callbackArgIdx = -1;
    this.prevMethod = null;
};
// The Placeholder function returns the arguments passed to it
Method.prototype.placeholderFn = function () {
    return [].slice.call(arguments);
};

// Run the Methods that have been placed on the Method stack
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
                this.aArgs = prevResult; // previous Method returned an Array - so we are good
            }
            else {
                this.aArgs = new Array(prevResult); // otherwize make an Array
            }
        }
    }
    // if async Method need to stop execution of the stack - resume when async done
    if (this.isAsync) {
        // remember the async function to call and it's arguments
        //  and where the callback is located in the arguments (if any)
        stackControl.fn = this.fn;
        stackControl.aArgs = this.aArgs;
        stackControl.callbackArgIdx = this.callbackArgIdx;
        // make this Method a placeholder function (for re-entry when async function is done)
        this.setAsPlaceholder();
        // signal to exit the stack by returning with the stackControl object
        return stackControl;
    }
    // is a synchronous Method so just run the function
    var result = this.fn.apply(target, this.aArgs);
    this.setAsPlaceholder();
    return result;
};

/*************************************
 * Returns MethodChainer object that maintains the Method List and Method Stack
 * @param target    Methods will be bound (ie: 'this') to 'target' object
 * @constructor
 */
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

// Links 'method' to the current Method on the top of the methodStack
//  and makes 'method' the topmost Method on methodStack
MethodChainer.prototype.push = function (method) {
    method.prevMethod = this.methodStack;
    this.methodStack = method;
};

// Sequentially run Methods from the bottom of methodStack to the top
MethodChainer.prototype.run = function () {
    // got arguments so place them in the placeholder Method at the bottom of the stack
    if (arguments.length) {
        var bottomMethod = this.methodStack;
        // work our way down to the placeholder Method at the bottom of the stack
        while (bottomMethod.prevMethod) {
            bottomMethod = bottomMethod.prevMethod;
        }
        // set it's arguments
        bottomMethod.aArgs = [].slice.call(arguments);
    }
    // Info required to run async functions will be in inserted into stackControl object
    var stackControl = {};
    // run the Method stack
    this.methodStack.run(this.target, stackControl);
    // if stackControl contains an asynchronous function - run it
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


/*************************************
 * Helper object that has commonly used MethodChainer functions in prototype
 *  inherit into your subtypes for easy access to MethodChainer
 * @constructor
 */
function InheritChainerCalls() {
    this.methodChainer = new MethodChainer(this);
}
// Add a Method to the list of chainable Methods
InheritChainerCalls.prototype.chainAdd = function (method) {
    this.methodChainer.add(method);
};

// Push a method onto the methodStack
InheritChainerCalls.prototype.chainPush = function (method) {
    this.methodChainer.push(method);
};

// Run Methods on the methodStack
InheritChainerCalls.prototype.chainRun = function (method) {
    this.methodChainer.run(method);
};

// Emit an add, push, or run event to MethodChainer - does same as functions above
InheritChainerCalls.prototype.chainEmit = function (eventName, method) {
    this.methodChainer.emit(eventName, method);
};


/**
 * Test of chainable object
 * @constructor
 */
function Mine() {
    // init inherited 'InheritChainerCalls'
    InheritChainerCalls.call(this);
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

// Inherit functions from InheritChainerCalls prototype
util.inherits(Mine, InheritChainerCalls);

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
    console.log('read the file: %s', inFilePath);
    fs.readFile(inFilePath, cb);
};
Mine.prototype.processMyFile = function (err, data) {
    if (err) throw err;
    var MyData = JSON.parse(data);
    console.log('what was read :');
    console.log(util.inspect(MyData));
};


var mine = new Mine();


//console.log(util.inspect(chainer.methods));

var counter = 0;

function inc() {
    console.log('counter: ' + counter.toString());

}
