## Documenting your code for presentation

{{{image img.gear '0 10px 0 0' '70px'}}}
Discussions about marking up code can be found at :

 Documenting code using [Markdown](pages/site/markdowndoc.md), using
 [Handlebars](pages/site/handlebarsdoc.md).

This site is all about in-line free-form documentation of code files.
It also adheres to having the client side (browser) dynamically do 
all the work to translate the files for presentation. Markdown is the
markup language used to style the in-line documentation as well as
markdown files (.md) for higher level documentation (like readme.md or this
file for example).

**Some of the design goals:**
 - Both code and code level documentation in the same file
   - Change the code, update the documentation (which is right there!)
   - Save it and done!
 - All markup parsed/compiled dynamically by the client browser
   - Will work when served from the simplest `static` web server to those
   over designed, multi-homed, load balanced content delivery systems.
 - Use stuff I already know to customize the site menu, styles, and code
   - HTML, CSS, and Javascript
 - Allow user to display/download raw, code only, and marked up files.
 - Toys! - themes, code highlighters, line numbering, in-line pictures and video
 
 
 **As a side note:**
 - Probably will not work on IE. Don't care. {{{image-inline img.splat '2em'}}}
   - It might on Edge
     - but not holding my breath knowing MS history on following standards.
 - A current up to date browser is assumed 
   - that has HTML5, CSS3, ES6 (well some day), etc.
 - Mobile ready is on the radar

An argument against free-form documentation is the lack of standards.
Most
[documentation generators](https://en.wikipedia.org/wiki/Comparison_of_documentation_generators)
out there have a prescribed format (using indentation, tokens, or tags) that
must be followed for the documentation to be generated correctly. Much of 
which can be customized by configuration, stylesheets, plugins, tag files, 
templates, scripts, etc. All of which have to be studied and learned.
There are some really excellent documentation generators out there - 
[Pandoc](http://pandoc.org/) which can convert just about anything to
anything happens to be a personal favorite.

In many cases I find those are overkill (more like Mass Destruction). A
good example is my [ChainFrame](//potofcoffee2go.github.io/chainframe/)
project on GitHub. There is only one Javascript code file (could almost
make it a Gist) and a few example code files. So all that is needed is
a few Markdown files describing what it does, and writeup some code level
documentation in the .js files which look pretty (or at least reasonable)
when displayed in a browser.



 [Documenting code using Markdown](pages/site/markdowndoc.md)

 [Documentation Examples and Tips](pages/site/showdoc.js)



