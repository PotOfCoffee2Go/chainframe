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

// Returns an array of arguments that is to be passed to 'fn'
//  prevResult is what was returned from the previous Method's 'fn'
Method.prototype.getArguments = function (prevResult) {
    // if aArgs not an Array - make it one
    if (Object.prototype.toString.call(this.aArgs) !== '[object Array]') {
        this.aArgs = this.aArgs == null ? [] : new Array(this.aArgs);
    }
    // if prevResult not an Array - make it one
    if (Object.prototype.toString.call(prevResult) !== '[object Array]') {
        prevResult = prevResult == null ? [] : new Array(prevResult);
    }
    // use the arguments that were passed when the Method was created
    //   if none - use arguments that were returned by the previous method
    return this.aArgs.length > 0 ? this.aArgs : prevResult;
};

Method.prototype.insertCallbackOntoArguments = function (callbackFn) {
    if (this.callbackArgIdx === -1) {
        this.aArgs.push(callbackFn)
    }
    else {
        this.aArgs.splice(this.callbackArgIdx, 0, callbackFn);
    }
};

// Run the Methods that have been placed on the Method stack
Method.prototype.run = function (target, stackControl) {
    // recursive drill down to the placeholder Method at bottom of the Method stack
    if (this.prevMethod) {
        var prevResult = this.prevMethod.run(target, stackControl);
        // if hit an asynchronous Method exit the stack with info about that Method
        if (prevResult === stackControl) {
            return stackControl;
        }
        // get the arguments that will be passed to this 'fn'
        this.aArgs = this.getArguments(prevResult);
    }
    // if is async Method need to stop execution of the stack - resume when async done
    if (this.isAsync) {
        // insert our callback (this.run) into argument list
        this.insertCallbackOntoArguments(stackControl.callbackFn);
        // load stackControl with the function to run and it's arguments
        stackControl.fn = this.fn;
        stackControl.aArgs = this.aArgs;
        // make this Method a placeholder function (for re-entry when async function is done)
        this.setAsPlaceholder();
        // return with info required to run the asynchronous function
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
    // pass callback function that is to be used to resume processing methodStack
    var stackControl = {
        callbackFn: this.run.bind(this) // the callback is myself - so we resume processing methodStack
    };
    // run the Method stack
    this.methodStack.run(this.target, stackControl);
    // if stackControl contains an asynchronous function - run it
    if (stackControl.fn) {
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
InheritChainerCalls.prototype.chainAdd = function (methods) {
    this.methodChainer.add(methods);
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
    this.chainPush(new Method(this.hi1));
    this.chainEmit('push', new Method(this.hi2, null, true));
    this.chainEmit('push', new Method(this.hi3));
    this.chainEmit('push', new Method(this.hi4));
    this.chainPush(new Method(this.readMyFile, ['./logs/myfile.json'], true));
    this.chainPush(new Method(this.processMyFile));
    //    this.chainEmit('run');
    // this.chainRun();
}

// Inherit functions from InheritChainerCalls prototype
util.inherits(Mine, InheritChainerCalls);

Mine.prototype.chainAdd = function (methods) {
    methods.forEach(function (method) {
        Mine.prototype[method.fn.name] = method.fn;
    })
};
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
var implement = [
    {
        isAsync: true,
        fn: function tryit10(cb) {
            for (var i = 0; i < 10; i++) {
                console.log('tryit10 at number: %d', i);
            }
            setTimeout(function () {
                console.log('hi2');
                cb();
            }.bind(this), 4000);

            console.log(this.hi1);
        }
    },
    {
        isAsync: false,
        fn: function tryit2() {
            for (var i = 0; i < 2; i++) {
                console.log('tryit2 at number: %d', i);
            }
        }
    }
];

//mine.chainAdd(implement);
mine.chainPush(new Method(implement[0].fn, [], implement[0].isAsync, 0));
mine.chainPush(new Method(implement[1].fn, null, implement[1].isAsync));
mine.chainRun();