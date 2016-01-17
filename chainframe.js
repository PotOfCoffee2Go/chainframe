/**
 * Created by PotOfCoffee2Go on 1/6/2016.
 *
 * This file contains three object definitions:
 *   * Method       - information about function to be chained
 *   * MethodStack  - lists of Method chains
 *   * ChainFrame   - contains reference to MethodStack
 *                     and functions exposed to users of the module
 *
 */

'use strict';

// Helper function to convert arguments to Array
//   arguments is 'almost' a JavaScript Array,
//   returns arguments as an 'actual' JavaScript array
function argumentsToArray() {
    var aArgs = [];
    // when there are arguments but none of them defined values - return null
    if (arguments.length === 1 && typeof arguments[0] === 'undefined') {
        return null;
    }
    // push the arguments onto Array
    for (var i = 0, l = arguments.length; i < l; i++) {
        aArgs.push(arguments[i]);
    }
    // return an Array of the arguments - or null if there are still no values
    return aArgs.length === 0 ? null : aArgs;
}

/*************************************
 * Method
 *  object which can be chained with other Method objects
 *
 * @param callbackParam     name of callback in fn function signature
 * @param fn                function that this Method calls
 * @param aArgs             arguments passed to 'fn'
 * @constructor
 */
function Method(callbackParam, fn, aArgs) {
    // start off by initializing as is a placeholder Method
    this.setAsPlaceholder();

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


// Set a Method to be a placeholder
//  the Placeholder 'fn' returns the arguments passed to it
//  (is as if it were not even in the chain)
Method.prototype.setAsPlaceholder = function () {
    this.previousMethod = null;
    this.callbackParam = null;
    this.fn = function () {return argumentsToArray.apply(this, arguments);};
    this.aArgs = null;
    this.signature = [];
};

// Given what was returned from the previous Method's 'fn'
//  return an array of arguments that is to be passed to next Method 'fn'
Method.prototype.getArguments = function (previousResult) {
    // if aArgs not null then insure that it is an Array - if not an Array make it one
    if (this.aArgs != null) {
        if (Array.isArray(this.aArgs) === false) {
            this.aArgs = Array.of(this.aArgs);
        }
    }
    // similarly, if previousResult not an Array - make it one
    if (Array.isArray(previousResult) === false) {
        previousResult = previousResult == null ? [] : Array.of(previousResult);
    }
    // use the arguments that were passed inline when the Method was created
    //   if none - use arguments that were returned by the previous Method
    return this.aArgs != null ? this.aArgs : previousResult;
};

// Insert callback function into the argument list
Method.prototype.insertCallbackOntoArguments = function (callbackFn) {
    var idx = this.signature.indexOf(this.callbackParam);
    if (idx !== -1) {
        this.aArgs[idx] = callbackFn;
    }
};

// Run the Methods that have been placed on the Method stack
Method.prototype.run = function (target, stackControl) {
    // recursive drill down to the placeholder Method at bottom (first) of the Method stack
    if (this.previousMethod) {
        var previousResult = this.previousMethod.run(target, stackControl);
        // if hit an asynchronous Method exit running the stack with info about that Method
        if (previousResult === stackControl) {
            return stackControl;
        }
        // get the arguments that will be passed to this Method
        this.aArgs = this.getArguments(previousResult);
    }
    // if is an async Method - put info in stackControl
    if (this.callbackParam) {
        // insert our callback into argument list
        this.insertCallbackOntoArguments(stackControl.callbackFn);
        // load stackControl with the function to run and it's arguments
        stackControl.fn = this.fn;
        stackControl.aArgs = this.aArgs;
        // make this Method a placeholder function (for re-entry when async function is done)
        this.setAsPlaceholder();
        // return with info required to run the function asynchronously
        return stackControl;
    }
    // otherwise, is a synchronous Method - so just run it
    var result = this.fn.apply(target, this.aArgs);
    // since this method has been run, replace its Method on the methodStack with a placeholder
    this.setAsPlaceholder();
    // and return the result
    return result;
};

// MethodStack will inherit from EventEmitter
//   but only as a convenience for users of the ChainFrame module
//    since events are not used by ChainFrame itself
const EventEmitter = require('events');

/*************************************
 * MethodStack
 *  object that maintains current and named chain(s) of Methods
 * @param target object which Methods will be bound (ie: 'this')
 * @constructor
 */
function MethodStack(target) {
    // the 'target' object will be 'this' of functions called by ChainFrame
    this.target = target;

    // create methodStack which represents the current sequence of chained Methods
    //  start by placing a placeholder Method on it
    //  technically, methodStack is a linked list of Methods via the 'previousMethod' property
    this.methodStack = new Method();

    // initialize the nodejs EventEmitter
    EventEmitter.call(this);
}
// Inherit functions from nodejs EventEmitter
MethodStack.prototype = Object.create(EventEmitter.prototype);
MethodStack.prototype.constructor = MethodStack;

// push takes the the given Method and places on end of the methodStack
MethodStack.prototype.push = function (method) {
    // link the current end Method of methodStack to the given Method
    method.previousMethod = this.methodStack;
    // make the given Method end of methodStack
    this.methodStack = method;
};

// Sequentially run Methods from the first (bottom of methodStack) to the last (top)
MethodStack.prototype.run = function callbackFn() {
    // got arguments returned from the previous Method?
    //  place them in the aArgs variable of the current Method on methodStack
    if (arguments.length) {
        var firstMethod = this.methodStack;
        // work our way down to the first Method of the stack (will be a placeholded)
        while (firstMethod.previousMethod) {
            firstMethod = firstMethod.previousMethod;
        }
        // set aArgs to the arguments returned by Method just run
        firstMethod.aArgs = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            firstMethod.aArgs.push(arguments[i]);
        }
    }
    // pass ChainFrame's callback function into stackControl
    var stackControl = {
        callbackFn: this.run.bind(this)
    };
    // run the Method stack - will return prematurely if/when aysnc function is hit
    //  if an async function has be hit, run it -
    this.methodStack.run(this.target, stackControl);
    // if stackControl contains an asynchronous function - run it
    //   this function (MethodStack.prototype.run) will continue when it does its callback
    if (stackControl.fn) {
        stackControl.fn.apply(this.target, stackControl.aArgs);
    }
};

/*************************************
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
                            argumentsToArray.apply(this, arguments)));
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
                            argumentsToArray.apply(this, arguments)));
            return this;
        };
    }.bind(this));
    return this;
};

// Run Methods on the method stack
ChainFrame.prototype.runChain = function () {
    this._methodStack.run();
    return this;
};

// EventEmitter 'on' function to add an event listener
ChainFrame.prototype.on = function (event, fn) {
    this._methodStack.on(event, fn);
    return this;
};

// EventEmitter 'emit' function to emit an event
ChainFrame.prototype.emit = function () {
    this._methodStack.push(
            new Method(
                    null,
                    function () {this._methodStack.emit.apply(this._methodStack, arguments)}.bind(this),
                    argumentsToArray.apply(this, arguments)));
    return this;
};

// Expose ChainFrame prototype - (sounds kinda naughty)
module.exports = ChainFrame;
