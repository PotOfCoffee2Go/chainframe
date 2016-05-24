/**
 * Created by PotOfCoffee2Go on 1/7/2016.
 *
 */
'use strict';

/// This file contains four object definitions:
///  * **Method**       - information about function to be chained
///  * **Queue**        - inherit of Array making a FIFO queue
///  * **MethodQueue**  - queues of Method chains
///  * **ChainFrame**   - High level interface to MethodQueue

/// ----
/// Method - object which can be chained with other Method objects
/// ----
///   - `callbackParam`     name of callback in fn function signature
///   - `fn`                function that this Method calls
///   - `aArgs`             arguments passed to 'fn'
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
    var fnFirstLine = this.fn.toString().split('\n')[0];
    this.signature = /\((.*?)\)/.exec(fnFirstLine)[1].replace(/\s/g, '').split(",");

    // look for the default parameter name of 'callback'
    if (this.signature.indexOf('callback') !== -1) {
        this.callbackParam = 'callback';
    }

    // sadly, gotta throw an error if callbackParam not in the signature
    if (this.callbackParam) {
        if (this.signature.indexOf(this.callbackParam) === -1) {
            throw new Error("callbackParam: '" + this.callbackParam + "' is not in signature of - '"
                    + fnFirstLine.substring(0, fnFirstLine.indexOf(')') + 1)) + "'";
        }
    }
}

///   - Copy a Method
Method.prototype.clone = function () {
    var copy = new Method();
    copy.callbackParam = this.callbackParam;
    copy.fn = this.fn;
    copy.aArgs = this.aArgs;
    copy.signature = this.signature;
    return copy;
};

/// ----
/// Queue - array of a sequence of Methods
/// ----
function Queue() {
    // initialize array
    Array.call(this);
}
/// - Inherit prototype from Array
Queue.prototype = Object.create(Array.prototype);
Queue.prototype.constructor = Queue;

/// - Copy a Queue
Queue.prototype.clone = function (dstQueue) {
    for (var i = 0, l = this.length; i < l; i++) {
        dstQueue.push(this[i].clone());
    }
};

/// - Empty a queue
Queue.prototype.clear = function () {
    this.length = 0;
};

/// ----
/// MethodQueue - maintains current and named chain(s) of Methods
/// ----
///  - MethodQueue inherits from nodejs EventEmitter
///  - convenience for users of the ChainFrame module
///  - events are not used by ChainFrame itself
const EventEmitter = require('events');

///  - `target` object will be 'this' of functions called by ChainFrame
///  - `buildQueue` current sequence of chained Methods that are being built
///  - `runQueue` current sequence of chained Methods that are currently running
///  - `namedQueues` Place to store reusable Method queues
///  - `isRunning` indicator that this ChainFrame's chain is running
///  - Initialize the EventEmitter
function MethodQueue(target) {
    this.target = target;
    this.buildQueue = new Queue();
    this.runQueue = new Queue();
    this.namedQueues = {};
    this.isRunning = false;
    EventEmitter.call(this);
}
/// Inherit prototype from EventEmitter
MethodQueue.prototype = Object.create(EventEmitter.prototype);
MethodQueue.prototype.constructor = MethodQueue;

/// Push a Method onto buildQueue
MethodQueue.prototype.push = function (method) {
    this.buildQueue.push(method);
};

/// Sequentially run Methods from runQueue
MethodQueue.prototype.run = function () {
    this.isRunning = true;

    // runQueue is empty so all done
    if (this.runQueue.length === 0) {
        return;
    }

    var method = this.runQueue[0];
    // if no arguments given when Method built
    //  use the arguments returned from previous method
    if (method.aArgs.length < 1) {
        method.aArgs = arguments;
    }

    // callbackParam indicates the Method is asynchronous
    //  insert our self 'this.run()' as callback parameter into argument list
    //  done with Method so remove from queue
    //  run the async fn
    if (method.callbackParam) {
        var idx = method.signature.indexOf(method.callbackParam);
        method.aArgs[idx] = this.run.bind(this);
        method.aArgs.length = method.signature.length;
        var methodInfo = {fn: method.fn, aArgs: method.aArgs};
        this.runQueue.shift();
        methodInfo.fn.apply(this.target, method.aArgs);
        return;
    }

    // otherwise, is synchronous so run the 'fn'
    //  done with Method so remove from queue
    //  call our self 'this.run()' to process next Method
    var result = method.fn.apply(this.target, method.aArgs);
    this.runQueue.shift();
    // run the next method in the chain
    this.run(result);
};

/// Store buildQueue to a named Method queue
MethodQueue.prototype.set = function (name) {
    this.namedQueues[name] = new Queue();
    this.buildQueue.clone(this.namedQueues[name]);
};

// Get a named Method queue into buildQueue
MethodQueue.prototype.get = function (name) {
    this.namedQueues[name].clone(this.buildQueue);
};

/// Get run flag
MethodQueue.prototype.getRun = function () {
    return this.isRunning;
};

/// Set run flag
MethodQueue.prototype.resetRun = function () {
    this.isRunning = false;
};

/// ----
/// ChainFrame - higher level chaining functions
/// ----
///  - references an instance of MethodQueue
function ChainFrame() {
    // create a Method queue
    this._methodQueue = new MethodQueue(this);
}

///  - addToPrototype() and addToInstance() do the same thing
///  - except as their names imply -
///    - addToPrototype() adds the chain-able function to the prototype
///    - addToInstance()  adds the chain-able function to the instance only
///  - if you are uncertain, you should probably use addToInstance()

/// Add chain-able function(s) to the prototype
ChainFrame.prototype.addToPrototype = function (ctor, methods, callbackParam) {
    // Allow a single function to be added to prototype - just make array with one function
    if (Object.prototype.toString.call(methods) === '[object Function]') {
        methods = new Array({callbackParam: callbackParam, fn: methods});
    }
    // add the functions defined in 'methods' array to prototype
    //  is a wrapper function that pushes the Method on a Queue
    //   the wrapper function returns 'this' - which is the magic that allows chaining
    //  the chain is not actually run until 'runChain()' is called
    methods.forEach(function (method) {
        ctor.prototype[method.fn.name] = function () {
            this._methodQueue.push(
                    new Method(
                            method.callbackParam == null ? null : method.callbackParam,
                            method.fn,
                            arguments));
            return this; // return this to allow Methods to be chained
        };
    });
    // return this to allow 'addToPrototype()'s to be chained
    return this;
};

/// Add chain-able functions to an instance
ChainFrame.prototype.addToInstance = function (methods, callbackParam) {
    // Allow a single function to be added to instance - just make array with one function
    if (Object.prototype.toString.call(methods) === '[object Function]') {
        methods = new Array({callbackParam: callbackParam, fn: methods});
    }
    // add the functions defined in 'methods' array to the instance
    //  is a wrapper function that pushes the Method on a Queue
    //   wrapper function returns 'this' - which is the magic that allows chaining
    //  the chain is not actually run until 'runChain()' is called
    methods.forEach(function (method) {
        // Wrapper around the function that returns 'this' - allows chaining
        this[method.fn.name] = function () {
            this._methodQueue.push(
                    new Method(
                            method.callbackParam == null ? null : method.callbackParam,
                            method.fn,
                            arguments));
            return this;
        };
    }.bind(this));
    return this;
};

/// Run the chained Methods
ChainFrame.prototype.runChain = function () {
    // can only run a single chain at a time
    if (this.getRun()) throw new Error('a chain is already running!');

    // move the Methods from the build queue to the run queue
    // push function to reset the running indicator
    this._methodQueue.buildQueue.clone(this._methodQueue.runQueue);
    this._methodQueue.runQueue.push(
            new Method(
                    null,
                    function () {this.resetRun();},
                    arguments));

    // run the chain
    this._methodQueue.run();
    return this;
};

/// Give a name to the Methods on the build queue
ChainFrame.prototype.setChain = function (name) {
    this._methodQueue.set(name);
    return this;
};

/// Add the Methods named 'name' to the build queue
ChainFrame.prototype.getChain = function (name) {
    this._methodQueue.get(name);
    return this;
};

/// Get the running flag
ChainFrame.prototype.getRun = function () {
    return this._methodQueue.getRun();
};

/// Reset the running flag
ChainFrame.prototype.resetRun = function () {
    this._methodQueue.resetRun();
    return this;
};

/// Add an EventEmitter event listener
ChainFrame.prototype.on = function (event, fn) {
    this._methodQueue.on(event, fn);
    return this;
};

/// Emit to Event Emitter listener function(s)
ChainFrame.prototype.emit = function () {
    // need to apply() to 'this._methodQueue' (instead of 'this')
    //  (EventEmitter is kinda touchy in referencing it's event listeners)
    this._methodQueue.push(
            new Method(
                    null,
                    function () {this._methodQueue.emit.apply(this._methodQueue, arguments)}.bind(this),
                    arguments));
    return this;
};

/// Expose ChainFrame
module.exports = ChainFrame;
