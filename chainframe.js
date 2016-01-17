/**
 *
 */
'use strict';

// Convert arguments (which is 'almost' a JavaScript Array) to an 'actual' JavaScript array
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
 * Returns a Method object which can be chained with other Method objects
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
    // arguments that have been passed directly within the chain statement
    this.aArgs = aArgs || null;
    // callbackParam indicates 'fn' is an async function
    this.callbackParam = callbackParam || null;
    // make empty string a null
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


// The Placeholder Method returns the arguments passed to it
//  (as if it were not even in the Method chain)

// Reset a Method to be a placeholder
Method.prototype.setAsPlaceholder = function () {
    this.prevMethod = null;
    this.callbackParam = null;
    this.fn = function () {return argumentsToArray.apply(this, arguments);};
    this.aArgs = null;
    this.signature = [];
};

// Returns an array of arguments that is to be passed to 'fn'
//  given prevResult which was returned from the previous Method's 'fn'
Method.prototype.getArguments = function (prevResult) {
    // if aArgs not null then insure that it is an Array - if not an Array make it one
    if (this.aArgs != null) {
        if (Array.isArray(this.aArgs) === false) {
            this.aArgs = Array.of(this.aArgs);
        }
    }
    // similarly, if prevResult not an Array - make it one
    if (Array.isArray(prevResult) === false) {
        prevResult = prevResult == null ? [] : Array.of(prevResult);
    }
    // use the arguments that were passed when the Method was created
    //   if none - use arguments that were returned by the previous Method
    return this.aArgs != null ? this.aArgs : prevResult;
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
    // recursive drill down to the placeholder Method at first Method of the Method stack
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
    if (this.callbackParam) {
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

// MethodStack wiil inherit from EventEmitter
//   but only as a user convenience, since events are not used by ChainFrame itself
const EventEmitter = require('events');

/*************************************
 * MethodStack object that maintains the currently chained Methods in a linked list
 * @param target    Methods will be bound (ie: 'this') to 'target' object
 * @constructor
 */
function MethodStack(target) {
    // 'this' of functions called by ChainFrame will be the 'target' object
    this.target = target;

    // create methodStack which represents the current sequence of chained Methods
    //  start by placing a placeholder Method on it
    //  technically, methodStack is a linked list via the 'prevMethod' property
    this.methodStack = new Method();

    // initialize 'EventEmitter'
    EventEmitter.call(this);
}
// Inherit functions from nodejs 'EventEmitter'
MethodStack.prototype = Object.create(EventEmitter.prototype);
MethodStack.prototype.constructor = MethodStack;

// push takes the the given Method and places on top of methodStack
MethodStack.prototype.push = function (method) {
    // link the cureent top method on methodStack to the given Method
    method.prevMethod = this.methodStack;
    // make the given Method top of methodStack
    this.methodStack = method;
};

// Sequentially run Methods from the first (bottom of methodStack) to the last (top)
MethodStack.prototype.run = function callbackFn() {
    // got arguments returned from the previous Method?
    //  place them in the aArgs variable of the current Method on methodStack
    if (arguments.length) {
        var firstMethod = this.methodStack;
        // work our way down to the first Method of the stack (will be a placeholded)
        while (firstMethod.prevMethod) {
            firstMethod = firstMethod.prevMethod;
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
 * ChainFrame itself - exposes higher level chaining functions
 *
 * @constructor
 */
function ChainFrame() {
    // create a Method stack
    this._methodStack = new MethodStack(this);
}

// Add chained functions to the prototype
ChainFrame.prototype.addPrototype = function (ctor, methods, callbackParam) {
    if (Object.prototype.toString.call(methods) === '[object Function]') {
        methods = new Array({callbackParam: callbackParam, fn: methods});
    }
    if (Object.prototype.toString.call(methods) !== '[object Array]') {
        methods = new Array(methods);
    }
    // Add the functions defined in 'methods' array to prototype
    methods.forEach(function (method) {
        // Wrapper of the Method that returns 'this' to allow chaining
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

// Add chained functions to an instance
ChainFrame.prototype.addMethod = function (methods, callbackParam) {
    // Allow a single function to be added to instance - just make array with one function
    if (Object.prototype.toString.call(methods) === '[object Function]') {
        methods = new Array({callbackParam: callbackParam, fn: methods});
    }
    // Allow an Array of functions to be added to instance
    if (Object.prototype.toString.call(methods) !== '[object Array]') {
        methods = new Array(methods);
    }
    // Add the functions defined in 'methods' array to prototype
    methods.forEach(function (method) {
        // Wrapper of the Method that returns 'this' to allow chaining
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

// EventEmitter 'on' function to add event listener
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

// ChainFrame blushes - it's exposed
module.exports = ChainFrame;
