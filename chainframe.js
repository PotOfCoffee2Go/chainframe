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
    // callbackParam indicates parameter that is callback in fn signature
    // function to run - if not given then use a placeholder
    // arguments to pass to fn
    this.callbackParam = callbackParam || null;
    this.fn = fn || function () {};
    this.aArgs = aArgs || null;

    // for async functions, insure name of the callback is in the signature
    //  get the first line of 'fn's definition
    //  parse the signature parameters into an Array - ie: what is between the '()'s
    //  sadly, gotta throw an error if callbackParam not in the signature
    this.signature = [];
    if (this.callbackParam) {
        var fnFirstLine = this.fn.toString().split('\n')[0];
        this.signature = /\((.*?)\)/.exec(fnFirstLine)[1].replace(/\s/g, '').split(",");

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

/**************************************************************************/
// MethodStacks inherits from nodejs EventEmitter
//   but only as a convenience for users of the ChainFrame module
//    since events are not used by ChainFrame itself
const EventEmitter = require('events');

/**
 * MethodStacks
 *  object that maintains current and named chain(s) of Methods
 *
 * @param target object which Methods will be bound (ie: 'this')
 * @constructor
 */
function MethodStacks(target) {
    // the 'target' object will be 'this' of functions called by ChainFrame
    // current sequence of chained Methods that are being built
    // current sequence of chained Methods that are currently running
    // Place to store stacks named by the module user
    // initialize the EventEmitter
    this.target = target;
    this.buildStack = [];
    this.runStack = [];
    this.namedStacks = {};
    EventEmitter.call(this);
}
// Inherit prototype from EventEmitter
MethodStacks.prototype = Object.create(EventEmitter.prototype);
MethodStacks.prototype.constructor = MethodStacks;

// Push a Method onto buildStack
MethodStacks.prototype.push = function (method) {
    this.buildStack.push(method);
};

// Sequentially run Methods from runStack
MethodStacks.prototype.run = function () {
    // runStack is empty so all done
    if (this.runStack.length === 0) {
        return;
    }

    var method = this.runStack[0];
    // if no arguments given when Method built
    //  use the arguments returned from previous method
    if (method.aArgs.length < 1) {
        method.aArgs = arguments;
    }

    // callbackParam indicates the Method is asynchronous
    //  insert our self 'this.run()' as callback parameter into argument list
    //  done with Method so remove from stack
    //  run the async fn
    if (method.callbackParam) {
        var idx = method.signature.indexOf(method.callbackParam);
        method.aArgs[idx] = this.run.bind(this);
        method.aArgs.length = method.signature.length;
        var methodInfo = {fn: method.fn, aArgs: method.aArgs};
        this.runStack.shift();
        methodInfo.fn.apply(this.target, method.aArgs);
        return;
    }

    // otherwise, is synchronous so run 'fn'
    //  done with Method so remove from stack
    //  call our self 'this.run()' to process next Method
    var result = method.fn.apply(this.target, method.aArgs);
    this.runStack.shift();
    // run the next method in the chain
    this.run(result);
};

// Copy a Method Stack
MethodStacks.prototype.clone = function (srcStack, dstStack) {
    for (var i = 0, l = srcStack.length; i < l; i++) {
        dstStack.push(srcStack[i].clone());
    }
};

// Store buildStack to a named Method stack
MethodStacks.prototype.set = function (name) {
    this.namedStacks[name] = [];
    this.clone(this.buildStack, this.namedStacks[name]);
};

// Get a named Method stack into buildStack
MethodStacks.prototype.get = function (name) {
    this.clone(this.namedStacks[name], this.buildStack);
};

// Empty a stack
MethodStacks.prototype.clear = function (stack) {
    stack = [];
};

/**************************************************************************
 * ChainFrame
 *  object that exposes higher level chaining functions
 *  references an instance of MethodStacks
 *
 * @constructor
 */
function ChainFrame() {
    // create a Method stack
    this._methodStack = new MethodStacks(this);
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
