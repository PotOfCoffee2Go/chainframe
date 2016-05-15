### helpful tip

to push changes to both BitBucket and OpenShift :
be on master branch
merge develop
git push all



### Credit

http://www.wpclipart.com/ gold arrow button
http://www.wpclipart.com/signs_symbol/button/metal_buttons/arrow_button_metal_gold_down.png.html
[//]: # (Markdown comment)

http://www.bestcssbuttongenerator.com/#/14
https://tohtml.com/
http://stackoverflow.com/questions/4823468/comments-in-markdown
http://jsonplaceholder.typicode.com/users

### Submit form flotsam

Trivial change to setup source control between bitbucket and openshift

There are three components to implement a form.  In this case I am placing the form in a Markdown (.md) file.
(which is the page that you are looking at right now!)

Add the menu option to `./site/menu.html` to display the Markdown file which contains the form:

<pre style='color:#000000;background:#E0EEEE;'><span style='color:#808030; '>&lt;</span>div id<span style='color:#808030; '>=</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>cssmenu</span><span style='color:#800000; '>'</span><span style='color:#808030; '>></span>
    <span style='color:#808030; '>&lt;</span>ul<span style='color:#808030; '>></span>
        <span style='color:#696969; '>// ... (other menu options)</span>
        <span style='color:#808030; '>&lt;</span>li <span style='color:#800000; font-weight:bold; '>class</span><span style='color:#808030; '>=</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>has-sub</span><span style='color:#800000; '>'</span><span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span>a id<span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>menu-examples</span><span style='color:#800000; '>"</span> href<span style='color:#808030; '>=</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>#</span><span style='color:#800000; '>'</span><span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span>span<span style='color:#808030; '>></span>Examples<span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>span<span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>a<span style='color:#808030; '>></span>
            <span style='color:#808030; '>&lt;</span>ul<span style='color:#808030; '>></span>
                <span style='color:#808030; '>&lt;</span>li<span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span>a id<span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>helloworld</span><span style='color:#800000; '>"</span> href<span style='color:#808030; '>=</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>#</span><span style='color:#800000; '>'</span><span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span>span<span style='color:#808030; '>></span>Hello World<span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>span<span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>a<span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>li<span style='color:#808030; '>></span>
                <span style='background-color: #b3ffb3;'><strong><span style='color:#808030; '>&lt;</span>li<span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span>a id<span style='color:#808030; '>=</span><span style='color:#800000; '>"</span><span style='color:#0000e6; '>pages/examples/submitform.md</span><span style='color:#800000; '>"</span> href<span style='color:#808030; '>=</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>#</span><span style='color:#800000; '>'</span><span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span>span<span style='color:#808030; '>></span>Submit Form<span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>span<span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>a<span style='color:#808030; '>></span><span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>li<span style='color:#808030; '>></span></strong></span>
            <span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>ul<span style='color:#808030; '>></span>
        <span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>li<span style='color:#808030; '>></span>
        <span style='color:#696969; '>// ... (other menu options)</span>
    <span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>ul<span style='color:#808030; '>></span>
<span style='color:#808030; '>&lt;</span><span style='color:#808030; '>/</span>div<span style='color:#808030; '>></span>
</pre>

the form markup. Note the action and method attributes which we'll discuss later, the rest of the form layout is up to you :

<pre style='color:#000000;background:#E0EEEE;'><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>form</span><span style='color:#274796; '> </span><span style='color:#074726; '>action</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '><span style='background-color: #b3ffb3;'>"submit/menu-examples/submitform"</span></span><span style='color:#274796; '> </span><span style='color:#074726; '>method</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '><span style='background-color: #b3ffb3;'>"post"</span></span><span style='color:#274796; '> </span><span style='color:#074726; '>id</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"customers"</span><span style='color:#a65700; '>></span>
  <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>fieldset</span><span style='color:#a65700; '>></span>
    <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>legend</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>strong</span><span style='color:#a65700; '>></span>Example of a form<span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>strong</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>legend</span><span style='color:#a65700; '>></span>
    <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>dl</span><span style='color:#a65700; '>></span>
      <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>dt</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>label</span><span style='color:#274796; '> </span><span style='color:#074726; '>for</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"txt_customerid"</span><span style='color:#274796; '> </span><span style='color:#074726; '>id</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"customerid-ariaLabel"</span><span style='color:#a65700; '>></span>id<span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>label</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>dt</span><span style='color:#a65700; '>></span>
      <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>dd</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>input</span><span style='color:#274796; '> </span><span style='color:#074726; '>id</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"txt_customerid"</span><span style='color:#274796; '> </span><span style='color:#074726; '>name</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"txt_customerid"</span><span style='color:#274796; '> </span><span style='color:#074726; '>type</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"text"</span><span style='color:#274796; '> aria-labelledby</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"customerid-ariaLabel"</span><span style='color:#274796; '> </span><span style='color:#a65700; '>/></span><span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>dd</span><span style='color:#a65700; '>></span>
      <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>dt</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>label</span><span style='color:#274796; '> </span><span style='color:#074726; '>for</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"txt_limit"</span><span style='color:#274796; '> </span><span style='color:#074726; '>id</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"limit-ariaLabel"</span><span style='color:#a65700; '>></span>limit<span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>label</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>dt</span><span style='color:#a65700; '>></span>
      <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>dd</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>input</span><span style='color:#274796; '> </span><span style='color:#074726; '>id</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"txt_limit"</span><span style='color:#274796; '> </span><span style='color:#074726; '>name</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"txt_limit"</span><span style='color:#274796; '> </span><span style='color:#074726; '>type</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"text"</span><span style='color:#274796; '> aria-labelledby</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"limit-ariaLabel"</span><span style='color:#274796; '> </span><span style='color:#a65700; '>/></span><span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>dd</span><span style='color:#a65700; '>></span>
      <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>input</span><span style='color:#274796; '> </span><span style='color:#074726; '>type</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"submit"</span><span style='color:#274796; '> </span><span style='color:#074726; '>value</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"Submit"</span><span style='color:#274796; '> </span><span style='color:#a65700; '>/></span>
    <span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>dl</span><span style='color:#a65700; '>></span>
  <span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>fieldset</span><span style='color:#a65700; '>></span>
<span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>form</span><span style='color:#a65700; '>></span>
</pre>

and a handler to process the data submitted :

<pre style='color:#000000;background:#E0EEEE;'><span style='color:#800000; font-weight:bold; '>var</span> server <span style='color:#808030; '>=</span> require<span style='color:#808030; '>(</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>app-http-gui</span><span style='color:#800000; '>'</span><span style='color:#808030; '>)</span><span style='color:#800080; '>;</span> <span style='color:#696969; '>// You probably already did this</span>

<span style='color:#696969; '>/**</span>
<span style='color:#696969; '>&#xa0;* Helpful Handler that displays the fields in the form submitted</span>
<span style='color:#696969; '>&#xa0;* @param req incoming request</span>
<span style='color:#696969; '>&#xa0;* @param res outgoing response</span>
<span style='color:#696969; '>&#xa0;* @param sendContent called to send html content</span>
<span style='color:#696969; '>&#xa0;*/</span>
<span style='color:#800000; font-weight:bold; '>function</span> submitform<span style='color:#808030; '>(</span>req<span style='color:#808030; '>,</span> res<span style='color:#808030; '>,</span> sendContent<span style='color:#808030; '>)</span> <span style='color:#800080; '>{</span>
    <span style='color:#800000; font-weight:bold; '>var</span> page <span style='color:#808030; '>=</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>&lt;p>This is a handler that accepts a form :&lt;/p>&lt;h3></span><span style='color:#800000; '>'</span>
            <span style='color:#808030; '>+</span> JSON<span style='color:#808030; '>.</span>stringify<span style='color:#808030; '>(</span>req<span style='color:#808030; '>.</span>recvData<span style='color:#808030; '>)</span>
            <span style='color:#808030; '>+</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>&lt;/h3></span><span style='color:#800000; '>'</span>
            <span style='color:#808030; '>+</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>&lt;p>To check out where this is coming from go to the </span><span style='color:#800000; '>'</span>
            <span style='color:#808030; '>+</span> <span style='color:#800000; '>'</span><span style='color:#0000e6; '>&lt;a href = "click/menu-setup/pages/setup/start.md">helloworld&lt;/a> program&lt;/p></span><span style='color:#800000; '>'</span><span style='color:#800080; '>;</span>
    sendContent<span style='color:#808030; '>(</span>page<span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
<span style='color:#800080; '>}</span>

server<span style='color:#808030; '>.</span>registerHandler<span style='color:#808030; '>(</span><span style='color:#800000; '>'</span><span style='color:#0000e6; '>submitform</span><span style='color:#800000; '>'</span><span style='color:#808030; '>,</span> submitform<span style='color:#808030; '>)</span><span style='color:#800080; '>;</span>
</pre>



### Dependencies
 - The app-http-gui server is built upon the nodejs built-in [http](https://nodejs.org/api/http.html) module
to keep it lean and mean. Do not mis-interpret 'mean' as the
[MVC paradigm](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) running
MongoDB, Express, Angular, Node stack... Nope, just a simple HTTP server.

 - I generally build content using a combination of Markdown (parsed to HTML using
[marked](https://www.npmjs.com/package/marked)), and when needed run the markdown through
[mustache](https://www.npmjs.com/package/mustache) to insert dynamic content.

 - No nodejs [http](https://nodejs.org/api/http.html) server would be
complete without [mime](https://www.npmjs.com/package/mime) to lookup the HTTP Content-Type of a file extension.
[Open](https://www.npmjs.com/package/open) is used to automatically open your default browser to the site
upon start up of the server. That's pretty much it for the dependencies.

### Limitations
 - For simplicity, the menu has got top levels with a single sub-level. There is an advantage however,
in that the menu display is simple and done exclusively by style sheet, plus the JavaScript menu handler
is simple and adapts to new menu item changes without code modifications. I have found the limited [menu
structure](pages/setup/menu.md) not to be an issue when focusing on creating a simple web site.
A site with a complex menu navigation system
(with a buncha sub-menu's) is inherently more difficult to maintain and kinda defeats the purpose of
the site being _simple_!

 - There is no server-side page cache. I find that _refreshing_ (pun intended) as page changes take
effect immediately.

 - Security... none wanted... none given. If you wish to secure the site with basic, htdigest, OAuth,
certificates, etc. your best bet would be to setup a proxy in front of your site that implements the
security measures that you require.
Something similar to [Apache proxy](http://httpd.apache.org/docs/2.2/mod/mod_proxy.html)
or npm [http-proxy](https://www.npmjs.com/package/http-proxy) comes to mind.

 - To use MS Edge to develop your site under 'http://localhost', you will probably have to configure
 Edge (and sometime IE for that matter) to allow 
[loopback](http://stackoverflow.com/questions/30334289/cant-open-localhost-in-microsoft-edge-project-spartan-in-windows-10-preview)
. I refuse to do special coding just to handle Microsoft products and ain't going to rewrite everything
just for Bill Gates. That being said, **app-http-gui** seems to work fine with current MS Browsers which I have tested.
IMHO... just use a seasoned browser like Chrome, Safari, or FireFox for development like most sane developers. 
 
### Lastly...
This site is brought to you by **app-http-gui** ! So the appearance and layout you see - is what you get.
Well, if you keep it _vanilla_ but there are so many cool mods that you can make ;)

Continue to [setup your site](pages/setup/install.md).
