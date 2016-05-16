## ChainFrame
<img src="images/under-construction.png" width=64 style="float:left;" />
> ChainFrame is not ready for prime-time yet - there are features that are
 being added, still needs a test suite, etc. Comments are welcome.

<br />

### Summary
ChainFrame is a nodejs framework which allows building of [fluent interfaces](https://en.wikipedia.org/wiki/Fluent_interface)
to asynchronous and synchronous functions using JavaScript Dot Notation.
No special coding is required when composing functions to make them _chainable_. Arguments to methods in
the chain can be entered as parameters or passed from the return value of the previous method.

### Design goals
  - Non-invasive, predictable, and easy to use
  - Single, concise, and lightweight source code file
  - All JavaScript
    - No builds or packages external to nodejs
    - No events or promises used by ChainFrame
      - (though your functions can use them)
  - Transparent to functions being chained
    - Functions return values for next method in chain
      - returning of `this` for chaining is transparent
      - returned values are passed as arguments to next method in chain
  - Serialization of asynchronous functions
    - Chain is executed in sequence regardless of async or sync
    - However, an async task can be launched from a chain (see Advanced Usage)
  - Documented (well, we try!)

### How is ChainFrame used
Examples best show the capabilities of ChainFrame

#### Hello World

    var ChainFrame = require('ChainFrame');
    
    // Create instance 'helloWorld' of ChainFrame
    var helloWorld = new ChainFrame();
    
    // Synchronous function (with a parameter) to be chain-able
    function log(text) { console.log(text); }
    
    // Add the above log() function to the helloWorld instance
    helloWorld.addToInstance(log);
    
    // Build method chain
    helloWorld.log( 'Hello World!' );
    
    // Run the chain
    helloWorld.runChain();

Notice that in the above example the parameter to the `log` function is being passed with in the
chain itself. `helloWorld.log(` **'Hello World!'** `);`

#### Parameter passing from previous chained method
We will add the following function which returns a string 
and write a method chain which passes the value returned by `sayHello()` to the `log()` function :

    function sayHello() { return 'I say Hello World!'; }
    ...
    helloWorld.addToInstance(sayHello);
    ...
    helloWorld.sayHello().log();


Like so:

    var ChainFrame = require('ChainFrame');

    // Create instance 'helloWorld' of ChainFrame
    var helloWorld = new ChainFrame();

    // Synchronous functions
    function log(text)  { console.log(text); }
    function sayHello() { return 'I say Hello World!'; } // <----

    // Add the functions to the helloWorld instance
    helloWorld.addToInstance(log);
    helloWorld.addToInstance(sayHello); // <----

    // Build method chain
    helloWorld.sayHello().log(); // <----

    // Run the chain
    helloWorld.runChain();

The above example passes the arguments returned by the sayHello() function to the log() function.




#### Handling of asynchronous functions
We will add the following asynchronous function (using a timer) which returns a string 
and write a method chain which passes the value returned by `sayHello()` to the `log()` function :


    var ChainFrame = require('ChainFrame');
    
    // Create some functions to be chained:
    
    // Synchronous function with parameters
    function log(text) { console.log(text); }
    
    // Synchronous function which returns value
    function returnExample() { return 'returnExample says   - hello world'; }
    
    // Asynchronous function
    function asyncExample(callback) {
      setTimeout(function () {
            callback('asyncExample says    - hello world');
        }, 4000)
    }

    function callbackExample(callback) { callback('callbackExample says - hello world'); }
    
    // Create instance ‘helloWorld’ of ChainFrame
    var helloWorld = new ChainFrame();
    
    // Add functions to the helloWorld instance
    helloWorld
            .addToInstance(log)
            .addToInstance(returnExample)
            .addToInstance(callbackExample)
            .addToInstance(asyncExample);
    
    // Build method chain
    helloWorld
            .log('beginning hello world example')
            .returnExample()
            .log()
            .asyncExample()
            .log()
            .callbackExample()
            .log()
            .log('end of hello world example')
            .log('')
            .log('All of the above functions were virtually identical to ChainFrame');
    
    // Run chain
    helloWorld.runChain();


    var fluffy = new Kitten();
    fluffy
        .setName('Fluffy')
        .setColor('black')
        .setGender('questionable')
        .save();


Some of the design goals :

  - No builds, external packages, events, or promises
  - All JavaScript
  - Transparent to functions being chained
  - Non-invasive, predictable, and easy to use
  - Concise and lightweight
  - Well documented (ok, five out of the six goals - not bad!)

###Why ChainFrame?
ChainFrame is an attempt to allow easy implementation of a sequence of code in Nodejs/JavaScript,
be the functions synchronous, asynchronous, or a combination of both.

A very common sequence of tasks are :

1.  Get data from somewhere
2.  Transform to make usable by JavaScript (into data objects)
3.  Consume, correlate, and process the data objects into useful information
3.  Insert/update database(s) with the information

These four steps are a simple sequence.  However in Nodejs it is easy to end up in Callback Hell, Pyramid of Doom;
stringing together events and promises; or resorting to [step](https://www.npmjs.com/package/step) or
[async](https://www.npmjs.com/package/async) modules.
Meanwhile buried somewhere in all this code that's handling arrays of 'callbacks', 'on's, 'when's, 'then's, 'series',
'parallel's, and 'waterfall's are the few lines that are actually doing the work!
When there are problems, it is not uncommon for the problem to have nothing to do with the code doing the
task - but a mistake in my implementation of async stuff.

Remember, all I want to do is :

    fluffy.getData().transform().process().updateMyDatabase();

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
