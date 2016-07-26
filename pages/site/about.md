## About this site

{{{ image img.coffeepot '0 10px 0 0' '80px'}}}
{{{ image img.coffeering '100px 0 0 300px' '200px'}}}

This site has been specifically designed to document javascript/web based code files.
Javascript .js, .css, and .html files are parsed for in-line comments written in
Markdown/Handlebars which are used to build web pages of the code. Thus the code 
and documentation arecontained within the same file. The code is automatically placed
in Markdown code blocks. 
See free form [documenting](pages/site/documenting.md) for more details.

The obvious advantages are the code and code level documentation is in the same file.
The documentation is free form Markdown, so minimal documentation syntax to learn.
Does not have to run through an offline documentation builder, web document built dynamically
on-the-fly on the client side. And of course, no documentation builder configuration
files are needed.

The site has a set of themes and code highlighters built-in. Access is via a HTML
menu file so can decide which which themes/highliters are available on the site or
can allow the user to select from the variety available. See site 
[Layout](pages/site/layout.md) for a discussion of how to modify site presentation.

This page, as most of the site pages, is written in [Markdown](//daringfireball.net/projects/markdown/)
and converted client side to HTML for presentation. The Markdown parser allows
HTML to be embedded which gives a lot of flexibility in constructing pages.
[Handlebars](http://handlebarsjs.com/) can also be used for dynamic content.

It is assumed that a basic knowledge of Markdown, (very basic) Handlebars, 
Javascript, stylesheets, and HTML is needed to customize the site.

On the left is the menu navigation system. It is a two-click navigation menu with the
main menu option displays sub-menu options. Clicking a sub-menu will change
the page displayed. There are only those two levels in the main menu. There
is a top or (page context) menu which can be displayed on a page by page basis.
To see the top menu go one of the code files - [site.css](css/site.css) for
example to see options available to that page.

The red dot in the upper left is a red, yellow, green indicator that the client
is connected to a socket-io WebSocket server. I will have a GitHub project soon with a
sample server. This allows custom content to be presented on the site as well as
all the toys (full duplex/client analytics, client to client communication, etc)
available over WebSockets.

The site is written in javascript which runs client side in the browser,
(as opposed to using server side scripts). This allows the site to run on any basic
web server - Apache, nodejs servers, etc.
I think [gh-pages site](https://github.com/blog/530-how-we-made-github-fast) is on
Rails(?) but runs equally as well on any web server - even static ones. For testing
I use nodejs [http-server](https://www.npmjs.com/package/http-server) 
and have used on a [Hostgator](http://codescullery.net) hosted LAMP server.
(since all the work is done client side, even the mediocre shared hosting
accounts work pretty well).

> It is kinda weird because when coding I'll pretty much ignore what the file
 will look like as a web page. Then after seeing the code presented as a page,
 I look at the file as a web page and ignore the code. Analogous to a proton in
 quantum mechanics - if observed as a wave, it is a wave; if observed as a 
 particle, it is a particle. Likewise, if a javascript file is observed as
 code, it is code; if observed as a web page, it is a web page.
 








Some theme/code highlight combos :

<a href="call/themeChange('swiss.css');site_ns.hilightChange('vs.min.css');">swiss / vs</a>, &nbsp;&nbsp;&nbsp;&nbsp; 
<a href="call/themeChange('screen.css');site_ns.hilightChange('kimbie.dark.min.css');">screen / kimbie.dark</a>, &nbsp;&nbsp;&nbsp;&nbsp; 
<a href="call/themeChange('markdown5.css');site_ns.hilightChange('foundation.min.css');">markdown5 / foundation</a>, &nbsp;&nbsp;&nbsp;&nbsp; 

