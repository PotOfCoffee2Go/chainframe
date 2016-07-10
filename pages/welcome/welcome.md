## ChainFrame
<img src="images/under-construction.png" width=64 style="float:left;" />
> ChainFrame is not ready for prime-time yet - there are features that are
 being added, still needs a test suite, etc.
 Will be uploaded to [npm](https://www.npmjs.com/) when ready for release.
 [Comments](https://github.com/PotOfCoffee2Go/chainframe/issues) are welcome.

<br />

### Summary
ChainFrame is a nodejs framework which allows building of [fluent interfaces](https://en.wikipedia.org/wiki/Fluent_interface)
to asynchronous and synchronous functions using JavaScript Dot Notation.
No special coding is required when composing functions. Returning of `this` 
(required to [cascade](https://en.wikipedia.org/wiki/Method_cascading) or 
[chain](https://en.wikipedia.org/wiki/Method_chaining) functions in Javascript) is transparent.
The values returned by a method are passed to the next method in the chain eliminating
programming concerns and time spent [yak shaving](https://en.wiktionary.org/wiki/yak_shaving)
`binding` and **this** issues.

Arguments to methods can be passed from the return value of the previous method or entered as parameters.

Building and executing a chain are independent, thus a chain can be constructed
and run several times (with possibly different return values being passed along the
method chain). The advantages become self apparent once you use it for a while.

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

#### Install

    npm install chainframe --save

#### Hello World

    var ChainFrame = require('ChainFrame');

    // Create instance 'helloWorld' of ChainFrame
    var helloWorld = new ChainFrame();

    // Synchronous functions
    function log(text)  { console.log(text); }
    function sayHello() { return 'I say Hello World!'; }

    // Add the functions to the helloWorld instance
    helloWorld.addToInstance(log);
    helloWorld.addToInstance(sayHello);

    // Build method chain
    helloWorld.sayHello().log();

    // Run the chain
    helloWorld.runChain();

The above example passes the values returned by the sayHello() function to the log() function.

Normally, to chain methods in JavaScript the functions being chained need to
return `this`. ChainFrame handles that for you, allowing functions to return
a value - which ChainFrame will pass on as arguments to the next function in the
chain.

#### Handling of asynchronous functions
Below I am creating a set of functions to demonstrate 
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
    
    // Create instance 'helloWorld' of ChainFrame
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


