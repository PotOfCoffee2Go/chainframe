/**
 *
 */
'use strict';

const util = require('util');
const fs = require('fs');
const EventEmitter = require('events');

function argsToArray() {
    var aArgs = [];
    if (arguments.length === 1 && typeof arguments[0] === 'undefined') {
        return null;
    }
    for (var i = 0, l = arguments.length; i < l; i++) {
        aArgs.push(arguments[i]);
    }
    return aArgs.length === 0 ? null : aArgs;
}

var chainAddMethods = function (constructor, instance, methods) {
    methods.forEach(function (method) {
        constructor.prototype[method.fn.name] = function () {
            instance.chainPush(new Method(method.callbackName, method.fn, argsToArray.apply(this, arguments)));
            return this;
        };
    })
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
    // !important - order of execution makes a difference
    this.setAsPlaceholder();
    if (typeof callbackName === 'undefined') return;

    this.callbackName = callbackName;
    this.callbackName = this.callbackName === '' ? null : this.callbackName;
    this.fn = fn || this.placeholderFn;
    this.aArgs = aArgs || null;

    this.fnSig = this.fn.toString().split('\n')[0];
    this.fnSig = this.fnSig.slice(this.fnSig.indexOf('(') + 1).replace(') {\r', '').replace(/\s/g, '').split(",");

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
    this.fn = this.placeholderFn;
    this.aArgs = null;
    this.isAsync = false;
    this.fnSig = [];
};

// The function of the Placeholder returns the arguments passed to it
Method.prototype.placeholderFn = function () {
    var aArgs = [];
    if (arguments.length === 1 && typeof arguments[0] === 'undefined') {
        return aArgs;
    }
    for (var i = 0, l = arguments.length; i < l; i++) {
        aArgs.push(arguments[i]);
    }
    return aArgs;
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


/*************************************
 * Test of chainable object
 * @constructor
 */
function Mine() {
    InheritChainerCalls.call(this);
}
// Inherit functions from InheritChainerCalls prototype
util.inherits(Mine, InheritChainerCalls);

var implementation = [
    {
        callbackName: '',
        fn: function hi1(lastguy) {
            console.log('hi1');
            return 'hi1';
        }
    },
    {
        callbackName: 'callback',
        fn: function hi2(lastguy, callback) {
            console.log('wait a bit...');
            setTimeout(function () {
                console.log('last guy: ' + lastguy);
                console.log('hi2');
                console.log('...done waiting');
                callback('hi2');
            }.bind(this), 4000);
            return 'hi2';
        }
    },
    {
        callbackName: '',
        fn: function hi3(lastguy) {
            console.log('last guy: ' + lastguy);
            console.log('hi3');
            return 'hi3';
        }
    },
    {
        callbackName: '',
        fn: function hi4(lastguy) {
            console.log('last guy: ' + lastguy);
            console.log('hi4');
            return 'hi4';
        }
    },
    {
        callbackName: 'cb',
        fn: function tryit10(cb) {
            var s = arguments;
            for (var i = 0; i < 10; i++) {
                console.log('tryit10 at number: %d', i);
            }
            setTimeout(function () {
                console.log('tryit10');
                cb();
            }.bind(this), 4000);

            console.log(this.hi1);
        }
    },
    {
        callbackName: '',
        fn: function tryit2() {
            for (var i = 0; i < 2; i++) {
                console.log('tryit2 at number: %d', i);
            }
        }
    },
    {
        callbackName: 'cb',
        fn: function readMyFile(inFilePath, cb) {
            console.log('read the file: %s', inFilePath);
            fs.readFile(inFilePath, cb);
        }
    },
    {
        callbackName: '',
        fn: function processMyFile(err, data) {
            if (err) throw err;
            var MyData = JSON.parse(data);
            console.log('what was read :');
            console.log(util.inspect(MyData));
        }
    }
];

var mine = new Mine();
chainAddMethods(Mine, mine, implementation);


mine.hi1().hi2().tryit10().readMyFile('./logs/myfile.json').processMyFile().tryit2();
mine.chainRun();


