## Site directory
The `site` subdirectory in your project directory contains the content and presentation of your site.
The server will look first for files in this directory. If the file is not found, it will check
`./node_modules/app-http-gui/site`. If still not found, a 'not found' (http status code 404) will
be returned to the requester.

The path of the site directory (default is `./site`) - can be configured ('server_root' option) on server startup. See 
[Start Server](pages/setup/start.md).

### Site directory layout
The complete layout of the default `site` directory is :

    site
    |   index.html
    |   menu.html
    +---css
    |       markdown.css
    |       menu.css
    |       site.css
    +---handlers
    |       examples.js
    |       site.js
    +---highlight
    |   |   highlight.pack.js
    |   \---styles
    |           (highlightjs.org style sheets)
    +---images
    |       favicon.ico
    +---menu
    |   |   menu.html
    |   \---images
    |           icon_minus.png
    |           icon_plus.png
    |           menu_down.png
    |           menu_up.png
    \---pages
        +---welcome
        |   |   welcome.md
        \   (other page directories)

You do not need have all this stuff - see
 
[minimum](pages/setup/install.md#minimum-directory-layout)
 
[customization](pages/welcome/welcome.md#customization)

<a href="pages/setup/install.md#minimum-directory-layout">Minimum</a>

<a href="pages/welcome/welcome.md#customization">Install</a>

for the files that you would most likely need.

### Site files
**index.html** file - This file is the main page layout defining the head, body, and
basic sections of the site. The style sheets use the div `id`s to set top level fonts,
background, padding, etc.


### Site directories
#### css sub-directory
This has the style sheets used to format menu, markdown, and the site content. You might change some of
these to alter the presentation (color, font, etc) of the site.
#### handlers sub-directory
Contains hsndlers for the site.
#### highlight sub-directory
Contains code highlighting code downloaded from highlightjs.org.
#### images sub-directory
Handy place to place images. Note that the server delivers the favicon.ico from this directory.
#### menu sub-directory
**menu.html** file - This file defines the menu.  
Here is where you would add/remove menu items that are displayed on your site menu. Obviously,
the menu will need customization to meet the needs of your application.
See [Setup Menu](pages/setup/menu.md).

Has the images used by the menu. The JavaScript `js/guievemts.js` which handles the menu onclicks is here also.
#### pages sub-directory
Contains the meat of the site. Has the html and markdown files displayed on the site. I organize them by
sub directories based on the top level menu items. But that is up to you.

### Let's have a mid-setup quickie!
After copying the `./node_modules/app-http-gui/site` directory into your project directory,
change some text in your `./site/home/home.md` file, and refresh this site in your browser.

**Wait-wait!** better yet - make a change to `./site/pages/welcome/welcome.md` and save. Do not refresh browser! -
come back here and click this link - [Welcome](pages/welcome/welcome.md)!  
The change takes effect immediately. How awesome is that!

