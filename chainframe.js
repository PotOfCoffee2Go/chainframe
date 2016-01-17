/**
 * Created by PotOfCoffee2Go on 1/6/2016.
 *
 * This file contains three object definitions:
 *   * Method       - information about function to be chained
 *   * MethodStack  - lists of Method chains
 *   * ChainFrame   - contains reference to MethodStack
 *                     and functions exposed to users of the module
 */

'use strict';

/**************************************************************************
 * Method
 *  object which can be chained with other Method objects
 *
 * @param callbackParam     name of callback in fn function signature
 * @param fn                function that this Method calls
 * @param aArgs             arguments passed to 'fn'
 * @constructor
 */
function Method(callbackParam, fn, aArgs) {
    // start off by initializing a placeholder Method
    this.init();

    // new Method() without arguments? return the placeholder
    if (typeof callbackParam === 'undefined') return;

    // function to run - if not given then use the placeholder function
    this.fn = fn || this.fn;
    // arguments that where passed inline in the chain statement
    this.aArgs = aArgs || null;
    // callbackParam indicates 'fn' is an async function
    this.callbackParam = callbackParam || null;
    // callbackParam that's an empty string is same as a null
    this.callbackParam = this.callbackParam === '' ? null : this.callbackParam;

    // for async functions insure name of the callback is in the signature
    if (this.callbackParam) {
        // get the first line of 'fn's definition
        var fnFirstLine = this.fn.toString().split('\n')[0];
        // parse the signature parameters into an Array - ie: what is between the '()'s
        this.signature = /\((.*?)\)/.exec(fnFirstLine)[1].replace(/\s/g, '').split(",");

        // if callbackParam not in the signature? sadly, gotta throw an error
        if (this.signature.indexOf(this.callbackParam) === -1) {
            throw new Error("callbackParam: '" + this.callbackParam + "' is not in signature of - '"
                    + fnFirstLine.substring(0, fnFirstLine.indexOf(')') + 1)) + "'";
        }
    }
}

// Copy a Method
Method.prototype.clone = function () {
    var copy = new Method();
    copy.callbackParam = this.callbackParam;
    copy.fn = this.fn;
    copy.aArgs = this.aArgs;
    copy.signature = this.signature;
    return copy;
};

// Set a Method to be a placeholder
//  the Placeholder 'fn' returns the arguments passed to it
//  (is as if it were not even in the chain)
Method.prototype.init = function () {
    this.callbackParam = null;
    this.fn = function () {};
    this.aArgs = null;
    this.signature = [];
};

/**************************************************************************/
// MethodStack inherits from nodejs EventEmitter
//   but only as a convenience for users of the ChainFrame module
//    since events are not used by ChainFrame itself
const EventEmitter = require('events');

/**
 * MethodStack
 *  object that maintains current and named chain(s) of Methods
 *
 * @param target object which Methods will be bound (ie: 'this')
 * @constructor
 */
function MethodStack(target) {
    // the 'target' object will be 'this' of functions called by ChainFrame
    this.target = target;
    // create buildStack by placing a placeholder Method on it
    //   is the current sequence of chained Methods that are being built
    this.buildStack = [];
    // create runStack by placing a placeholder Method on it
    //   is the current sequence of chained Methods that are currently executing
    this.runStack = [];
    // Place to store stacks named by the module user
    this.namedStacks = {};
    // initialize the EventEmitter
    EventEmitter.call(this);
}
// Inherit functions from EventEmitter
MethodStack.prototype = Object.create(EventEmitter.prototype);
MethodStack.prototype.constructor = MethodStack;

// push the given Method and places on end of the buildStack
MethodStack.prototype.push = function (method) {
    // link the current end Method of runStack to the given Method
    this.buildStack.push(method);
};

// Sequentially run Methods from runStack
MethodStack.prototype.run = function () {
    // runStack is empty
    if (this.runStack.length === 0) return;

    var method = this.runStack[0];
    // when no arguments passed when chain built - use the arguments for previous method
    if (method.aArgs.length < 1) {
        method.aArgs = arguments;
    }
    // if is an asynchronous Method - make us (this.run()) the callback
    if (method.callbackParam) {
        var methodInfo = {
            fn: method.fn,
            aArgs: method.aArgs
        };
        // insert our callback into argument list
        var idx = method.signature.indexOf(method.callbackParam);
        method.aArgs[idx] = this.run.bind(this);
        method.aArgs.length = method.signature.length;
        // load methodInfo with the function to run and it's arguments
        // make this Method a placeholder function (for re-entry when async function is done)
        // return with info required to run the function asynchronously
        this.runStack.shift();
        methodInfo.fn.apply(this.target, method.aArgs);
        return;
    }
    // otherwise, is a synchronous Method - so just run it and return the result
    var result = method.fn.apply(this.target, method.aArgs);
    // run the Method stack - will return prematurely if/when aysnc function is hit
    //  if an async function has be hit, run it -
    this.runStack.shift();
    // run the next method in the chain
    this.run(result);
    // We are at the end of the runStack
};

// Copy a Method Stack
MethodStack.prototype.clone = function (srcStack, dstStack) {
    for (var i = 0, l = srcStack.length; i < l; i++) {
        dstStack.push(srcStack[i].clone());
    }
};

// Store buildStack to a named Method stack
MethodStack.prototype.set = function (name) {
    this.namedStacks[name] = [];
    this.clone(this.buildStack, this.namedStacks[name]);
};

// Get a named Method stack into buildStack
MethodStack.prototype.get = function (name) {
    this.clone(this.namedStacks[name], this.buildStack);
};

/**************************************************************************
 * ChainFrame
 *  object that exposes higher level chaining functions
 *  references an instance of MethodStack
 *
 * @constructor
 */
function ChainFrame() {
    // create a Method stack
    this._methodStack = new MethodStack(this);
}

// Add chain-able function(s) to the prototype
ChainFrame.prototype.addPrototype = function (ctor, methods, callbackParam) {
    if (Object.prototype.toString.call(methods) === '[object Function]') {
        methods = new Array({callbackParam: callbackParam, fn: methods});
    }
    // Add the functions defined in 'methods' array to prototype
    methods.forEach(function (method) {
        // Wrapper around the function that returns 'this' - allows chaining
        ctor.prototype[method.fn.name] = function () {
            this._methodStack.push(
                    new Method(
                            method.callbackParam == null ? null : method.callbackParam,
                            method.fn,
                            arguments));
            return this;
        };
    });
    return this;
};

// Add chain-able functions to an instance
ChainFrame.prototype.addMethod = function (methods, callbackParam) {
    // Allow a single function to be added to instance - just make array with one function
    if (Object.prototype.toString.call(methods) === '[object Function]') {
        methods = new Array({callbackParam: callbackParam, fn: methods});
    }
    // Add the functions defined in 'methods' array to instance
    methods.forEach(function (method) {
        // Wrapper around the function that returns 'this' - allows chaining
        this[method.fn.name] = function () {
            this._methodStack.push(
                    new Method(
                            method.callbackParam == null ? null : method.callbackParam,
                            method.fn,
                            arguments));
            return this;
        };
    }.bind(this));
    return this;
};

// Run Methods on the method stack
ChainFrame.prototype.runChain = function () {
    this._methodStack.clone(this._methodStack.buildStack, this._methodStack.runStack);
    this._methodStack.run();
    return this;
};

// Set a name to the Methods on the method stack
ChainFrame.prototype.setChain = function (name) {
    this._methodStack.set(name);
    return this;
};

// Get the Methods on the method stack by name
ChainFrame.prototype.getChain = function (name) {
    this._methodStack.get(name);
    return this;
};

// EventEmitter 'on' function to add an event listener
ChainFrame.prototype.on = function (event, fn) {
    this._methodStack.on(event, fn);
    return this;
};

// Apply to EventEmitter's emit() function to emit an event
ChainFrame.prototype.emit = function () {
    this._methodStack.push(
            new Method(
                    null,
                    // need to apply() to 'this._methodStack' (instead of 'this')
                    //  (EventEmitter is kinda touchy in referencing it's event listeners)
                    function () {this._methodStack.emit.apply(this._methodStack, arguments)}.bind(this),
                    arguments));
    return this;
};

// Expose ChainFrame prototype - (sounds kinda naughty)
module.exports = ChainFrame;
