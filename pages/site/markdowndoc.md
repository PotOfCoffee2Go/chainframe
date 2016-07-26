 ## Documentation Examples and Tips

 [Documentation Examples and Tips](pages/site/showdoc.js)
 
 [Documenting code using Markdown](pages/site/markdowndoc.md)

 This javascript file is an example of some of the methods and tips
 that you can use to document code files. To see the examples better
 (comments in red) change to the swiss theme/googlecode highlighter -
 <a href="call/themeChange('swiss.css');site_ns.hilightChange('googlecode.min.css');">click here</a>.
 
 Other pages of interest:
 [Documenting code using Markdown](pages/site/markdowndoc.md)
 [Documenting code using Handlebars](pages/site/handlebarsdoc.md)

 To include Markdown comments in code files add an extra **'/'** to single line
 comments or an extra **'\*'** to block comments - ie: **'///'** or **'/\*\*'** respectively.

 Here is a code example with (admittedly horrible {{image-inline img.littleredbacteria '1.5em'}}) comments :

 ----

 ```js 
 // Determine location of source code
 /*
    If site not localhost then get source code from GitHub
      '../' indicates moving down into the project files
        so the GitHub source is in master
        otherwise is page in gh-pages
 */
function getCodeUrl(filepath) {
    /* Get the web site location */
    var src = window.location.href.replace('#', '');
    if ('localhost' !== window.location.hostname) {
        src = site_ns.source;
        if (filepath.indexOf('../') > -1) {
            src += 'master/';
        }
        else {
            src += 'gh-pages/';
        }
    }
    return src + filepath;
}
 ```

 ----
 
 Notice the comments used are the single line comment **'//'** and block comment **'/\* ... \*&#47;'**.
 Because these are the regular comment tokens for Javascript they are considered part of
 the code, thus are included in the code block.

 Let's change the first comment by adding an extra **'/'** to the comment token making it :
 **'/// Determine location of source code'**. Oh! let's also make it a Markdown
 header by adding **'###'** - so looks like:

 ```js
 /// ### Determine location of source code
 ```

 ----

 ### Determine location of source code
 ```js
/*
 If site not localhost then get source code from GitHub
   '../' indicates moving down into the project files
      so the GitHub source is in master
    otherwise is page in gh-pages
 */
function getCodeUrl(filepath) {
    /* Get the web site location */
    var src = window.location.href.replace('#', '');
    if ('localhost' !== window.location.hostname) {
        src = site_ns.source;
        if (filepath.indexOf('../') > -1) {
            src += 'master/';
        }
        else {
            src += 'gh-pages/';
        }
    }
    return src + filepath;
}
 ```

 ----

Looking good, got a header to the function code block! So now add a
 **'\*'** to the first block comment token, from **'/\*'** to **'/\*\*'**

 ----

 ### Determine location of source code

 If site not localhost then get source code from GitHub
 '../' indicates moving down into the project files
 so the GitHub source is in master
 otherwise is page in gh-pages

 ```js
function getCodeUrl(filepath) {
    /* Get the web site location */
    var src = window.location.href.replace('#', '');
    if ('localhost' !== window.location.hostname) {
        src = site_ns.source;
        if (filepath.indexOf('../') > -1) {
            src += 'master/';
        }
        else {
            src += 'gh-pages/';
        }
    }
    return src + filepath;
}
 ```
 
 ----


 Hmmm... not so good! Markdown made all the lines into a single line. Makes
 sense in a Markdown sort of way. So, one way around this is to change the
 comment lines into a Markdown Unordered List by adding a '-' (minus sign), like so :

 ```
     If site not localhost then get source code from GitHub
       - '../' indicates moving down into the project files
         - so the GitHub source is in master
       - otherwise
         - is page in gh-pages
 ```


 ----

 ### Determine location of source code

 If site not localhost then get source code from GitHub
   - '../' indicates moving down into the project files
     - so the GitHub source is in master
   - otherwise
     - is page in gh-pages


 ```js
function getCodeUrl(filepath) {
    /* Get the web site location */
    var src = window.location.href.replace('#', '');
    if ('localhost' !== window.location.hostname) {
        src = site_ns.source;
        if (filepath.indexOf('../') > -1) {
            src += 'master/';
        }
        else {
            src += 'gh-pages/';
        }
    }
    return src + filepath;
}
```

 ----

 There we go. Now lets add some more Markdown markup :

 ```
     If site not localhost then get source code from [GitHub](https://github.com/)
       - `../` indicates moving down into the project files
         - so the [GitHub](https://github.com/) source is in **master**
       - otherwise
         - is page in gh-pages
 ```


 ----

 ### Determine location of source code
 
 If site not localhost then get source code from [GitHub](https://github.com/)
   - `../` indicates moving down into the project files
     - so the [GitHub](https://github.com/) source is in **master**
   - otherwise
     - is page in **gh-pages**


```js
function getCodeUrl(filepath) {
    /* Get the web site location */
    var src = window.location.href.replace('#', '');
    if ('localhost' !== window.location.hostname) {
        src = site_ns.source;
        if (filepath.indexOf('../') > -1) {
            src += 'master/';
        }
        else {
            src += 'gh-pages/';
        }
    }
    return src + filepath;
}
 ```
 
 ----

So that is looking ok, but could use a little sprucing up, let's put
 an image somewhere. We could put something like:

 ```
 /// <img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/redbacteria.svg" style="width: 50px;vertical-align: middle;"/>
 ```

 Well, that would look butt ugly in our beautiful javascript code file. So going
 to use [Handlebars](http://handlebarsjs.com/) to inject that ugly line after the
 code file has been parsed by Markdown.
 Looks like:

 ```
 /// ### Determine location of source code {{{img.littleredbacteriatext}}}
 ```

 ----

 ### Determine location of source code {{{image img.littleredbacteria '0 0 0 0' '40px'}}}

 If site not localhost then get source code from [GitHub](https://github.com/)
   - `../` indicates moving down into the project files
     - so the [GitHub](https://github.com/) source is in **master**
   - otherwise
     - is page in **gh-pages**

 ```js
function getCodeUrl(filepath) {
    /* Get the web site location */
    var src = window.location.href.replace('#', '');
    if ('localhost' !== window.location.hostname) {
        src = site_ns.source;
        if (filepath.indexOf('../') > -1) {
            src += 'master/';
        }
        else {
            src += 'gh-pages/';
        }
    }
    return src + filepath;
}
 ```

 ----
 
 [Documenting code using Markdown](pages/site/markdowndoc.md)

 Whoa, wait a minute! How can the image show up in a code
 block - shouldn't it be the '**{{{img.littleredbacteriatext}}}**' text?

 The reason is because the Handlebars substitution occurs right before
 the marked up page in displayed. In other words, after all the comment/code
 block parsing and after the Markdown parsing.

 This is intentional for a few reasons. Doing the Handlebars substitution before
 the comment/code block parsing and/or the Markdown parsing makes finding markup
 errors a nightmare. And by doing them last allows direct control over the HTML
 inserted without the inserted text being messed with by the other parsers.


