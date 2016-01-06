/**
 *
 */

'use strict';
const util = require('util');
const EventEmitter = require('events');

function Method(fn, aArgs, isasync) {
    this.fn = fn;
    this.aArgs = aArgs || null;
    this.isasync = isasync || false;
    this.prevMethod = null;
}
Method.prototype.run = function(target, stackControl) {
    if (this.prevMethod) {
        var prevResult = this.prevMethod.run(target, stackControl);
        if (prevResult === stackControl) {
          return stackControl;
        }
        this.aArgs = this.aArgs || new Array(prevResult);
        this.prevMethod = null;
    }
    if (this.isasync) {
      this.fn.apply(target, this.aArgs);
      this.isasync = false;
      this.fn = function(){console.log('after async returns');}
      console.log('async triggered');
      return stackControl;
    }
      
    return this.fn.apply(target, this.aArgs);
}

function Chainer(target) {
    // Initialize necessary properties from `EventEmitter` in this instance
    EventEmitter.call(this);

    this.target = target;
    this.methodStack = new Method(function(){console.log('base');});
    this.listeners();
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(Chainer, EventEmitter);

Chainer.prototype.listeners = function() {
    this
        .on('push', this.push)
        .on('run', this.run);
}

Chainer.prototype.push = function(method) {
    method.prevMethod = this.methodStack;
    this.methodStack = method;
}
Chainer.prototype.run = function(data) {
    this.methodStack.run(this.target,{});
    this.methodStack.run(this.target,{});
}

function Mine() {
    this.chainer = new Chainer(this);
    this.hello = 'kimmm';
    this.chainer.push(new Method(this.hi1,['starter']));
    this.chainer.emit('push', new Method(this.hi2,null,true));
    this.chainer.emit('push', new Method(this.hi3));
    this.chainer.emit('push', new Method(this.hi4));
    this.chainer.emit('run');
    //    this.chainer.emit('next', {
    //        fn: this.hi
    //    });
}


//    console.log(util.inspect(this.chainer.methods));

Mine.prototype.hi1 = function(lastguy) {

    console.log('last guy:' + lastguy);
    console.log('hi1');
    return 'hi1';
}
Mine.prototype.hi2 = function(lastguy) {
    console.log('last guy:' + lastguy);
    console.log('hi2');
    return 'hi2';
}
Mine.prototype.hi3 = function(lastguy) {
    console.log('last guy:' + lastguy);
    console.log('hi3');
    return 'hi3';
}
Mine.prototype.hi4 = function(lastguy) {
    console.log('last guy:' + lastguy);
    console.log('hi4');
    return 'hi4';
}

var mine = new Mine();





//console.log(util.inspect(chainer.methods));

var counter = 0;

function inc() {
    console.log('counter: ' + counter.toString());

}
