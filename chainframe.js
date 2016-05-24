/**
 * Created by PotOfCoffee2Go on 1/7/2016.
 *
 */
'use strict';

/// This file contains four object definitions:
///  * **Method**       - information about function to be chained
///  * **Stack**        - inherit of Array with a few custom functions added
///  * **MethodStack**  - stacks of Method chains
///  * **ChainFrame**   - High level interface to MethodStack

/// ----
/// Method - object which can be chained with other Method objects
/// ----
///   - @param callbackParam     name of callback in fn function signature
///   - @param fn                function that this Method calls
///   - @param aArgs             arguments passed to 'fn'
///   - @constructor
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
/// Stack - array of a sequence of Methods
/// ----
///   - @constructor
function Stack() {
    // initialize array
    Array.call(this);
}
/// - Inherit prototype from Array
Stack.prototype = Object.create(Array.prototype);
Stack.prototype.constructor = Stack;

/// - Copy a Stack
Stack.prototype.clone = function (dstStack) {
    for (var i = 0, l = this.length; i < l; i++) {
        dstStack.push(this[i].clone());
    }
};

/// - Empty a stack
Stack.prototype.clear = function () {
    this.length = 0;
};

/// ----
/// MethodStack - maintains current and named chain(s) of Methods
/// ----
///  - MethodStack inherits from nodejs EventEmitter
///  - convenience for users of the ChainFrame module
///  - events are not used by ChainFrame itself
const EventEmitter = require('events');

///  - `target` object will be 'this' of functions called by ChainFrame
///  - `buildStack` current sequence of chained Methods that are being built
///  - `runStack` current sequence of chained Methods that are currently running
///  - `namedStacks` Place to store reusable Method stacks
///  - `isRunning` indicator that this ChainFrame's chain is running
/// Initialize the EventEmitter
///  - @param target object which Methods will be bound (ie: 'this')
///  - @constructor
function MethodStack(target) {
    this.target = target;
    this.buildStack = new Stack();
    this.runStack = new Stack();
    this.namedStacks = {};
    this.isRunning = false;
    EventEmitter.call(this);
}
/// Inherit prototype from EventEmitter
MethodStack.prototype = Object.create(EventEmitter.prototype);
MethodStack.prototype.constructor = MethodStack;

/// Push a Method onto buildStack
MethodStack.prototype.push = function (method) {
    this.buildStack.push(method);
};

/// Sequentially run Methods from runStack
MethodStack.prototype.run = function () {
    this.isRunning = true;

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

    // otherwise, is synchronous so run the 'fn'
    //  done with Method so remove from stack
    //  call our self 'this.run()' to process next Method
    var result = method.fn.apply(this.target, method.aArgs);
    this.runStack.shift();
    // run the next method in the chain
    this.run(result);
};

/// Store buildStack to a named Method stack
MethodStack.prototype.set = function (name) {
    this.namedStacks[name] = new Stack();
    this.buildStack.clone(this.namedStacks[name]);
};

// Get a named Method stack into buildStack
MethodStack.prototype.get = function (name) {
    this.namedStacks[name].clone(this.buildStack);
};

/// Get run flag
MethodStack.prototype.getRun = function () {
    return this.isRunning;
};

/// Set run flag
MethodStack.prototype.resetRun = function () {
    this.isRunning = false;
};

/// ----
/// ChainFrame - higher level chaining functions
/// ----
///  - references an instance of MethodStack
///  - @constructor
function ChainFrame() {
    // create a Method stack
    this._methodStack = new MethodStack(this);
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
    //  is a wrapper function that pushes the Method on a Stack
    //   the wrapper function returns 'this' - which is the magic that allows chaining
    //  the chain is not actually run until 'runChain()' is called
    methods.forEach(function (method) {
        ctor.prototype[method.fn.name] = function () {
            this._methodStack.push(
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
    //  is a wrapper function that pushes the Method on a Stack
    //   wrapper function returns 'this' - which is the magic that allows chaining
    //  the chain is not actually run until 'runChain()' is called
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

/// Run the chained Methods
ChainFrame.prototype.runChain = function () {
    // can only run a single chain at a time
    if (this.getRun()) throw new Error('a chain is already running!');

    // move the Methods on the build stack to the run stack
    // push function to reset the running indicator
    this._methodStack.buildStack.clone(this._methodStack.runStack);
    this._methodStack.runStack.push(
            new Method(
                    null,
                    function () {this.resetRun();},
                    arguments));

    // run the chain
    this._methodStack.run();
    return this;
};

/// Give a name to the Methods on the build stack
ChainFrame.prototype.setChain = function (name) {
    this._methodStack.set(name);
    return this;
};

/// Add the Methods named 'name' to the build stack
ChainFrame.prototype.getChain = function (name) {
    this._methodStack.get(name);
    return this;
};

/// Get the running flag
ChainFrame.prototype.getRun = function () {
    return this._methodStack.getRun();
};

/// Reset the running flag
ChainFrame.prototype.resetRun = function () {
    this._methodStack.resetRun();
    return this;
};

/// Add an EventEmitter event listener
ChainFrame.prototype.on = function (event, fn) {
    this._methodStack.on(event, fn);
    return this;
};

/// Emit to Event Emitter listener function(s)
ChainFrame.prototype.emit = function () {
    // need to apply() to 'this._methodStack' (instead of 'this')
    //  (EventEmitter is kinda touchy in referencing it's event listeners)
    this._methodStack.push(
            new Method(
                    null,
                    function () {this._methodStack.emit.apply(this._methodStack, arguments)}.bind(this),
                    arguments));
    return this;
};

/// Expose ChainFrame
module.exports = ChainFrame;
