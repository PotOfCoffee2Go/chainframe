/**
 *
 */

'use strict';
const util = require('util');
const EventEmitter = require('events');

function Method(fn, aArgs, isasync) {
    if (typeof fn === 'Object') {
        console.log('Hi');
    }
    this.fn = fn;
    this.aArgs = aArgs || null;
    this.isasync = isasync || false;
    this.prevMethod = null;
}
Method.prototype.run = function (target, stackControl) {
    // drill down to the placeholder Method at bottom of the Method stack
    if (this.prevMethod) {
        var prevResult = this.prevMethod.run(target, stackControl);
        // if the result is the stackControl object - exit - do not process remaining Methods
        if (prevResult === stackControl) {
            return stackControl;
        }
        // use the arguments that were passed when the Method was created
        //   if none - use arguments that were returned by the previous method
        this.aArgs = this.aArgs || new Array(prevResult);
        // this current Method is the new bottom of the Method stack
        this.prevMethod = null;
    }
    // if async will stop execution of the stack
    if (this.isasync) {
        // remember the async function with arguments that is to be run
        stackControl.fn = this.fn;
        stackControl.aArgs = this.aArgs;
        // update this Method to be a placeholder function (for re-entry when async function is done)
        this.isasync = false;
        this.aArgs = null;
        this.fn = function () {return [].slice.call(arguments);};
        // signal to exit by returning with the stackControl object
        console.log('async triggered');
        return stackControl;
    }
    // run the function
    return this.fn.apply(target, this.aArgs);
};

function Chainer(target) {
    // Initialize necessary properties from `EventEmitter` in this instance
    EventEmitter.call(this);

    this.target = target;
    this.methodStack = new Method(function () {
        console.log('base');
    });
    this.listeners();
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(Chainer, EventEmitter);

Chainer.prototype.listeners = function () {
    this
            .on('push', this.push)
            .on('run', this.run);
};

Chainer.prototype.push = function (method) {
    method.prevMethod = this.methodStack;
    this.methodStack = method;
};
Chainer.prototype.run = function () {
    // got arguments so place them in the placeholder Method on the bottom of the stack
    if (arguments.length) {
        var bottomMethod = this.methodStack;
        while (bottomMethod.prevMethod) {
            bottomMethod = bottomMethod.prevMethod;
        }
        bottomMethod.aArgs = [].slice.call(arguments);
    }
    var stackControl = {};
    this.methodStack.run(this.target, stackControl);
    if (stackControl.fn) {
        stackControl.fn.apply(this.target, stackControl.aArgs);
    }
};

/**
 * Test of chainable object
 * @constructor
 */
function Mine() {
    this.chainer = new Chainer(this);
    this.chainer.push(new Method(this.hi1, ['starter']));
    this.chainer.emit('push', new Method(this.hi2, null, true));
    this.chainer.emit('push', new Method(this.hi3));
    this.chainer.emit('push', new Method(this.hi4));
    this.chainer.emit('run');
    //    this.chainer.emit('next', {
    //        fn: this.hi
    //    });
}


//    console.log(util.inspect(this.chainer.methods));

Mine.prototype.hi1 = function (lastguy) {

    console.log('last guy:' + lastguy);
    console.log('hi1');
    return 'hi1';
};
Mine.prototype.hi2 = function (lastguy) {
    setTimeout(function () {
        console.log('last guy:' + lastguy);
        console.log('hi2');
        this.chainer.run('hi2');
    }.bind(this), 4000);
    return 'hi2';
};
Mine.prototype.hi3 = function (lastguy) {
    console.log('last guy:' + lastguy);
    console.log('hi3');
    return 'hi3';
};
Mine.prototype.hi4 = function (lastguy) {
    console.log('last guy:' + lastguy);
    console.log('hi4');
    return 'hi4';
};

var mine = new Mine();


//console.log(util.inspect(chainer.methods));

var counter = 0;

function inc() {
    console.log('counter: ' + counter.toString());

}
