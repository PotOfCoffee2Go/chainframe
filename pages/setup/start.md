## Starting the server

### For a complete and quick startup :
Open a console window and paste:

```
mkdir gui
cd gui
npm install app-http-gui
node
require('app-http-gui')();
console.log('Thanks for trying app-http-gui');
```

Which:
 1. `mkdir gui` make a project directory.
 2. `cd gui` go to it.
 3. `npm install app-http-gui` install the app-http-gui server.
 4. `node` to bring up the node shell **'> '** prompt).
 5. `require('app-http-gui')();` load and show site in your default browser.

To shutdown the server and exit node shell: Press `ctrl-c` twice.
 
> Note: the default port 8080 can not be in use on **_localhost_** or will get: **_Error: listen EADDRINUSE 127.0.0.1:8080_**

> If that happens could use a command like `require('app-http-gui')({server_port: 3000});` which would
use port 3000 instead of 8080. See below for other server configuration options.

### Similarly, can startup the sample site in a .js file.
Create a .js file named `tryit.js` and paste the code :

<pre style='color:#000000;background:#E0EEEE;'><span style='color:#800000; font-weight:bold; '>var</span> server <span style='color:#808030; '>=</span> require<span style='color:#808030; '>(</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>app-http-gui</span><span style='color:#800000; '>'</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
<span style='color:#696969; '>// Start server</span>
server<span style='color:#808030; '>()</span><span style='color:#800080; '>;</span>
</pre>

and from the command line type `node tryit`.


### or in `tryit.js` could customize the server configuration options on startup :

<pre style='color:#000000;background:#E0EEEE;'><span style='color:#800000; font-weight:bold; '>var</span> server <span style='color:#808030; '>=</span> require<span style='color:#808030; '>(</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>app-http-gui</span><span style='color:#800000; '>'</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>

<span style='color:#696969; '>// These are also the server configuration defaults :</span>
<span style='color:#800000; font-weight:bold; '>var</span> config <span style='color:#808030; '>=</span> <span style='color:#800080; '>{</span>
    server_name<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>App-http-gui Node Module</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span>
    server_root<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>./site</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span>
    server_host<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>localhost</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span>
    server_port<span style='color:#800080; '>:</span> <span style='color:#008c00; '>8080</span><span style='color:#808030; '>,</span>
    launch_browser<span style='color:#800080; '>:</span> <span style='color:#008c00; '>true</span>
<span style='color:#800080; '>}</span><span style='color:#800080; '>;</span>

<span style='color:#696969; '>// Start server</span>
server<span style='color:#808030; '>(</span>config<span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
</pre>

from the command line type `node tryit`.

### or Below is the `helloworld.js` application that is in `./node_modules/app-http-gui` which adds a handler :

<pre style='color:#000000;background:#E0EEEE;'><span style='color:#800000; font-weight:bold; '>var</span> server <span style='color:#808030; '>=</span> require<span style='color:#808030; '>(</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>./server</span><span style='color:#800000; '>'</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>

<span style='color:#696969; '>/*</span>
<span style='color:#696969; '>// These are the server configuration defaults :</span>
<span style='color:#696969; '>var defaultConfig = {</span>
<span style='color:#696969; '>&#xa0;&#xa0;&#xa0;&#xa0;server_name: 'App-http-gui Node Module - Hello World!',</span>
<span style='color:#696969; '>&#xa0;&#xa0;&#xa0;&#xa0;server_root: './site',</span>
<span style='color:#696969; '>&#xa0;&#xa0;&#xa0;&#xa0;server_host: 'localhost',</span>
<span style='color:#696969; '>&#xa0;&#xa0;&#xa0;&#xa0;server_port: 8080</span>
<span style='color:#696969; '>};</span>
<span style='color:#696969; '>*/</span>

<span style='color:#696969; '>// Is common to specify the server name, site directory, and port</span>
<span style='color:#800000; font-weight:bold; '>var</span> cfg <span style='color:#808030; '>=</span> <span style='color:#800080; '>{</span>
    server_name<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>Hello World!</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span>
    server_root<span style='color:#800080; '>:</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>./site</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span>
    server_port<span style='color:#800080; '>:</span> <span style='color:#008c00; '>8080</span>
<span style='color:#800080; '>}</span><span style='color:#800080; '>;</span>


<span style='color:#696969; '>/**</span>
<span style='color:#696969; '>&#xa0;* A server handler has the signature of (req, res, sendContent)</span>
<span style='color:#696969; '>&#xa0;* @param req is the incoming request (from nodejs built-in 'http')</span>
<span style='color:#696969; '>&#xa0;* @param res is the response (also from nodejs built-in 'http')</span>
<span style='color:#696969; '>&#xa0;* @param sendContent is called to respond to the request (normally a browser)</span>
<span style='color:#696969; '>&#xa0;*/</span>
<span style='color:#800000; font-weight:bold; '>function</span> helloWorld<span style='color:#808030; '>(</span>req<span style='color:#808030; '>,</span> res<span style='color:#808030; '>,</span> sendContent<span style='color:#808030; '>)</span> <span style='color:#800080; '>{</span>
    <span style='color:#800000; font-weight:bold; '>var</span> page <span style='color:#808030; '>=</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>&lt;p>This is a handler that says :&lt;/p>&lt;h1>Hello World!&lt;/h1></span><span style='color:#800000; '>'</span>
            <span style='color:#808030; '>+</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>&lt;p>To check out where this is coming from go to the </span><span style='color:#800000; '>'</span>
            <span style='color:#808030; '>+</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>&lt;a href = "click/menu-setup/pages/setup/start.md">helloworld&lt;/a> program&lt;/p></span><span style='color:#800000; '>'</span><span style='color:#800080; '>;</span>
    sendContent<span style='color:#808030; '>(</span>page<span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
<span style='color:#800080; '>}</span>
<span style='color:#696969; '>// Let's add the Hello World handler above to the server</span>
<span style='color:#696969; '>//  first param is the a site resource</span>
<span style='color:#696969; '>//   in this case the helloworld function will be called when</span>
<span style='color:#696969; '>//   given 'http://localhost:8080/helloworld' in links or browser address line</span>
<span style='color:#696969; '>//  second param is the handler (ie: function) to run</span>
server<span style='color:#808030; '>.</span>registerHandler<span style='color:#808030; '>(</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>helloworld</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span> helloWorld<span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>

<span style='color:#696969; '>// Fire up the server</span>
server<span style='color:#808030; '>(</span>cfg<span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
</pre>

from the command line type `node ./node_modules/app-http-gui/helloworld.js`.
