/**
 *
 */
'use strict';

const util = require('util');
const fs = require('fs');
const EventEmitter = require('events');

// Converts arguments to an array
var argsToArray = function () {
    var aArgs = [];
    // when there is an arguments with no defined values - return null
    if (arguments.length === 1 && typeof arguments[0] === 'undefined') {
        return null;
    }
    // push and return the values on an Array
    for (var i = 0, l = arguments.length; i < l; i++) {
        aArgs.push(arguments[i]);
    }
    return aArgs.length === 0 ? null : aArgs;
};


/*************************************
 * Returns a Method object which can be chained with other Method objects
 *
 * @param callbackName      name of callback in fn function signature
 * @param fn                function that this Method calls
 * @param aArgs             arguments passed to 'fn'
 * @constructor
 */
function Method(callbackName, fn, aArgs) {
    // !important - the order of statements below make a difference
    this.setAsPlaceholder();

    // Method() without arguments returns a placeholder
    if (typeof callbackName === 'undefined') return;

    this.callbackName = callbackName;
    this.callbackName = this.callbackName === '' ? null : this.callbackName;
    this.fn = fn || this.fn;
    this.aArgs = aArgs || null;

    // Extract the 'fn' function signature into array so we can pass parameters in proper places
    this.fnSig = this.fn.toString().split('\n')[0];
    this.fnSig = /\((.*?)\)/.exec(this.fnSig)[1].replace(/\s/g, '').split(",");

    // Find the name of the callback in the signature - throw error if not found
    if (this.callbackName && this.fnSig.indexOf(this.callbackName) === -1) {
        throw new Error('CallbackName:"' + this.callbackName + '" is not in "'
                + this.fn.toString().split('\n')[0].replace(' {\r', '') + '"');
    }
}


// The Placeholder Method returns the arguments passed to it
//  (as if it were not even in the Method chain)

// Reset a Method to be a placeholder
Method.prototype.setAsPlaceholder = function () {
    this.prevMethod = null;
    this.callbackName = null;
    this.fn = function () {return argsToArray.apply(this, arguments);};
    this.aArgs = null;
    this.isAsync = false;
    this.fnSig = [];
};

// Returns an array of arguments that is to be passed to 'fn'
//  given prevResult which was returned from the previous Method's 'fn'
Method.prototype.getArguments = function (prevResult) {
    // if aArgs not null then insure that it is an Array
    if (this.aArgs != null) {
        if (Object.prototype.toString.call(this.aArgs) !== '[object Array]') {
            this.aArgs = this.aArgs == null ? [] : new Array(this.aArgs);
        }
    }
    // if prevResult not an Array - make it one
    if (Object.prototype.toString.call(prevResult) !== '[object Array]') {
        prevResult = prevResult == null ? [] : new Array(prevResult);
    }
    // use the arguments that were passed when the Method was created
    //   if none - use arguments that were returned by the previous method
    return this.aArgs != null ? this.aArgs : prevResult;
};

// Insert the given callback function into the Method argument list
//  callbackArgIdx is where to insert it (-1 = the end of list)
Method.prototype.insertCallbackOntoArguments = function (callbackFn) {

    var idx = this.fnSig.indexOf(this.callbackName);
    if (idx !== -1) {
        this.aArgs[idx] = callbackFn;
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
    // if is an async Method - put info in stackControl for processing
    if (this.callbackName) {
        // insert our callback into argument list
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

MethodChainer.prototype.add = function (constructor, instance, methods) {
    methods.forEach(function (method) {
        constructor.prototype[method.fn.name] = function () {
            instance.chainPush(
                    new Method(
                            method.callbackName == null ? null : method.callbackName,
                            method.fn,
                            argsToArray.apply(this, arguments)));
            return this;
        };
    })
};

// Links 'method' to the current Method on the top of the methodStack
//  and makes 'method' the topmost Method on methodStack
MethodChainer.prototype.push = function (method) {
    method.prevMethod = this.methodStack;
    this.methodStack = method;
};

// Sequentially run Methods from the bottom of methodStack to the top
MethodChainer.prototype.run = function callbackFn() {
    // got arguments so place them in the placeholder Method at the bottom of the stack
    if (arguments.length) {
        var bottomMethod = this.methodStack;
        // work our way down to the placeholder Method at the bottom of the stack
        while (bottomMethod.prevMethod) {
            bottomMethod = bottomMethod.prevMethod;
        }
        // set it's arguments
        bottomMethod.aArgs = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            bottomMethod.aArgs.push(arguments[i]);
        }
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
exports.InheritChainerCalls = function InheritChainerCalls() {
    this.methodChainer = new MethodChainer(this);
};

// Push a method onto the methodStack
exports.InheritChainerCalls.prototype.chainAdd = function (constructor, instance, methods) {
    this.methodChainer.add(constructor, instance, methods);
};


// Push a method onto the methodStack
exports.InheritChainerCalls.prototype.chainPush = function (method) {
    this.methodChainer.push(method);
};

// Run Methods on the methodStack
exports.InheritChainerCalls.prototype.chainRun = function (method) {
    this.methodChainer.run(method);
};

// Emit an add, push, or run event to MethodChainer - does same as functions above
exports.InheritChainerCalls.prototype.chainEmit = function (eventName, method) {
    this.methodChainer.emit(eventName, method);
};




