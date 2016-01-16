
## ChainFrame
ChainFrame is a framework which allows JavaScript asynchronous and synchronous functions to be method chained using JavaScript Dot Notation. No special coding is required when composing functions to make them _chainable_. Arguments to methods in the chain can be entered as parameters or passed from the return value of the previous method.

Some of the design goals :

  - No builds, external packages, events, or promises
  - All JavaScript
  - Transparent to functions being chained
  - Non-invasive, predictable, and easy to use
  - Concise, lean, mean, tight, and lightweight
  - Well documented (ok, five out of the six goals - not bad!)

###Example of what a method chain looks like

You probably have already used method chaining, but if not, they look like this:

    var fluffy = new Kitten();
    fluffy
        .setName('Fluffy')
        .setColor('black')
        .setGender('questionable')
        .save();

Checkout [Method Chaining in JavaScript](http://schier.co/blog/2013/11/14/method-chaining-in-javascript.html) by Gregory Schier for a concise writeup about method chaining.

Method chains are really cool 'cause they simplify using modules - an example would be [d3js](http://d3js.org/) the Data-Driven Documents package. d3js does complex things (well beyond my pea sized brain); but its use of method chaining helps tremendously in writing code to create striking visualizations of data documents.

Implementing method chaining is really straight forward - as long as all the functions are _synchronous_ - call the function, do the task, return 'this'. The fly-in-the-ointment is chaining _asynchronous_ functions, and guess what... it seems I **always** to have to do things that are asynchronuous!  Read a file, request data from a web site, hit an API, write a file, query a database, update the database, ~~continue rant~~... 

###Why ChainFrame?
In my job, a very common task is:

1.  Get data from somewhere
2.  Transform to make usable by JavaScript (into data objects)
3.  Consume, correlate, and process the data objects into useful information
3.  Insert/update database(s) with the information

Before I start - Nodejs, npm, and contributions are the greatest and most awesome things - ever!

That being said, in most enviroments/languages, these four steps would be a simple sequence.  However in Nodejs, au contraire; I either end up in Callback Hell, Pyramid of Doom; stringing together events and promises; or resorting to [step](https://www.npmjs.com/package/step) or [async](https://www.npmjs.com/package/async) modules. Meanwhile buried somewhere in all this code that's handling arrays of 'callbacks', 'on's, 'when's, 'then's, 'series', 'parallel's, and 'waterfall's are the few lines that are actually doing the work! When there are problems, it is not uncommon for the problem to have nothing to do with the code doing the task - but a mistake of my implementation of async stuff - like, its callback is on the same tick in the JavaScript event loop - or something else I have no idea how to fix - thank God for [stackoverflow](http://stackoverflow.com/)!

Remember, all I want to do is :

    fluffy.getData().transform().process().updateMyDatabase();

ChainFrame is an attempt to allow easy implementation of a sequence of code in Nodejs/JavaScript, be the functions synchronous, asynchronous, or a combination of both.

###Creating a simple method chain

Install ChainFrame into your project directory, from command prompt:

    npm install chainframe

Copy the following code into a 'tryit.js' file.

// Create some functions to be chained:

    function first() {return 'world!';}
    function second(text) {console.log('hello ' + text);}
    
// Create an object 'Test' and inherit ChainFrame in the usual boilerplate manner:
 
    var ChainFrame = require('chainframe');

    /*************************************
     * Test is subtype of ChainFrame
     */
    function Test() {
            ChainFrame.call(this);
    }
    // Inherit prototype from ChainFrame
    Test.prototype = Object.create(ChainFrame.prototype);
    Test.prototype.constructor = Test;

// Add functions to Test's prototype which makes them _chainable_:

    Test.prototype.addChainable(Test, first);
    Test.prototype.addChainable(Test, second);

// Create a couple method chains:

    var test = new Test();
    
    test.first().second().runChain();               // 'hello world!'
    test.first().second('ChainFrame!').runChain();  // 'hello ChainFrame!'

From command prompt:

    node tryit

There are a few things worth noting. Notice the 'runChain()' method at the end of the method chains. ChainFrame chains do not actually execute until instructed to do so via the runChain() command. Thus :

    test.first().second();
    test.first().second('ChainFrame!').runChain();

or :

    test.first().second().first().second('ChainFrame!').runChain();

or :

    test.first().second();
    test.first();
    test.second('ChainFrame!');
    test.runChain();

are effectively the same and will produce the same output
