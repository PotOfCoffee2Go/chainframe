/**
 *
 */
'use strict'; // always!

const util = require('util');
const EventEmitter = require('events');

// Converts arguments to an array
var argsToArray = function () {
    var aArgs = [];
    // when there are an arguments but no defined values - return null
    if (arguments.length === 1 && typeof arguments[0] === 'undefined') {
        return null;
    }
    // push arguments onto Array
    for (var i = 0, l = arguments.length; i < l; i++) {
        aArgs.push(arguments[i]);
    }
    // return the Array or null when no arguments
    return aArgs.length === 0 ? null : aArgs;
};


/*************************************
 * Returns a Method object which can be chained with other Method objects
 *
 * @param callbackParam     name of callback in fn function signature
 * @param fn                function that this Method calls
 * @param aArgs             arguments passed to 'fn'
 * @constructor
 */
function Method(callbackParam, fn, aArgs) {
    // !important - the order of statements below make a difference
    this.setAsPlaceholder();

    // new Method() without arguments returns a placeholder
    if (typeof callbackParam === 'undefined') return;

    this.callbackParam = callbackParam;
    this.callbackParam = this.callbackParam === '' ? null : this.callbackParam;
    this.fn = fn || this.fn;
    this.aArgs = aArgs || null;

    // Extract the 'fn' function signature into array so we can pass parameters in proper places
    this.fnSig = this.fn.toString().split('\n')[0];
    this.fnSig = /\((.*?)\)/.exec(this.fnSig)[1].replace(/\s/g, '').split(",");

    // Find the name of the callback in the signature - throw error if not found
    if (this.callbackParam && this.fnSig.indexOf(this.callbackParam) === -1) {
        throw new Error('CallbackName:"' + this.callbackParam + '" is not in "'
                + this.fn.toString().split('\n')[0].replace(' {\r', '') + '"');
    }
}


// The Placeholder Method returns the arguments passed to it
//  (as if it were not even in the Method chain)

// Reset a Method to be a placeholder
Method.prototype.setAsPlaceholder = function () {
    this.prevMethod = null;
    this.callbackParam = null;
    this.fn = function () {return argsToArray.apply(this, arguments);};
    this.aArgs = null;
    this.isAsync = false;
    this.fnSig = [];
};

// Returns an array of arguments that is to be passed to 'fn'
//  given prevResult which was returned from the previous Method's 'fn'
Method.prototype.getArguments = function (prevResult) {
    // if aArgs not null then insure that it is an Array - if not an Array make it one
    if (this.aArgs != null) {
        if (Object.prototype.toString.call(this.aArgs) !== '[object Array]') {
            this.aArgs = this.aArgs == null ? [] : new Array(this.aArgs);
        }
    }
    // similarly, if prevResult not an Array - make it one
    if (Object.prototype.toString.call(prevResult) !== '[object Array]') {
        prevResult = prevResult == null ? [] : new Array(prevResult);
    }
    // use the arguments that were passed when the Method was created
    //   if none - use arguments that were returned by the previous Method
    return this.aArgs != null ? this.aArgs : prevResult;
};

// Insert the given callback function into the Method argument list
Method.prototype.insertCallbackOntoArguments = function (callbackFn) {

    var idx = this.fnSig.indexOf(this.callbackParam);
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
                            method.callbackParam == null ? null : method.callbackParam,
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

// Sequentially run Methods from the first (bottom) Method of methodStack to the last (top)
MethodChainer.prototype.run = function callbackFn() {
    // got arguments from the previous Method executed
    //  so place them in the aArgs variable of the placeholder Method first in the stack
    //  of the methodStack
    if (arguments.length) {
        var firstMethod = this.methodStack;
        // work our way down to the first Method of the stack (will be a placeholded)
        while (firstMethod.prevMethod) {
            firstMethod = firstMethod.prevMethod;
        }
        // set placeholder's aArgs Array to current arguements (which were returned by Method just run)
        firstMethod.aArgs = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            firstMethod.aArgs.push(arguments[i]);
        }
    }
    // pass callback function into stackControl that is to be used to resume processing methodStack
    //  if/when an asynchronous funtion is encountered
    //  note: the callback is myself - MethodChainer.prototype.run()
    var stackControl = {
        callbackFn: this.run.bind(this) 
    };
    // run the Method stack
    this.methodStack.run(this.target, stackControl);
    // if stackControl contains an asynchronous function - run it
    if (stackControl.fn) {
        stackControl.fn.apply(this.target, stackControl.aArgs);
    }
};

/*************************************
 * Exported object that has commonly used MethodChainer functions in its prototype
 * Inherit into your subtypes for easy access to MethodChainer
 * @constructor
 */
exports.ChainFrame = function () {
    this._methodChainer = new MethodChainer(this);
};

// Add methods to the chain framework
exports.ChainFrame.prototype.chainFrameAdd = function (constructor, instance, methods) {
    this._methodChainer.add(constructor, instance, methods);
};


// Push a method onto the chainer's methodStack
exports.ChainFrame.prototype.chainPush = function (method) {
    this._methodChainer.push(method);
};

// Run Methods on the chainer's methodStack
exports.ChainFrame.prototype.chainRun = function (method) {
    this._methodChainer.run(method);
};
