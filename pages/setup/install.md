## Install
You are here if you already installed **app-http-gui** by doing a `npm install app-http-gui --save`

So now lets discuss building your website.

### Copy stuff from the **app-http-gui** site directory as a basic framework to work from.

You might want to copy some (if not all) the files from `./node_modules/app-http-gui/site` into your project
`./site` subdirectory for ease in modifying site presentation and content. You only need to copy the files
that you wish to modify; as the default style sheets, javascript, etc. will be used if not found in your
project's `site` directory. See [Site Directory](pages/setup/sitedirectory.md) for more info.

The most common files to copy into your project's `site` directory are :
 - menu/menu.html  - defines the menu items. See [Setup Menu](pages/setup/menu.md)
 - images subdirectory - contains the favicon.ico and a handy place to put your site images
 - pages/welcome/welcome.md - home page displayed when a user first connects or refreshes
 - index.html - <span style='color: red;'>(optional)</span> has main page layout
 - css subdirectory - <span style='color: red;'>(optional)</span> to override the default stylesheets

Of course, you can copy the whole damn `./node_modules/app-http-gui/site` directory to your project directory
which would allow you to customize any and every thing relating to site presentation and content.
Again, see [Site Directory](pages/setup/sitedirectory.md) for more info.

### Minimum directory layout
The most basic skeleton `site` subdirectory in your project directory would look like :

    site
    |---menu
    |       menu.html
    +---images
    |       favicon.ico
    \---pages
        +---welcome
        \   |   welcome.md

This skeleton layout would use the **app-http-gui** built-in stylesheets, code, etc. but allow you to modify content
and change the menu options.

To fire up your server - see [Start Server](pages/setup/start.md).

## Crap - I already have a subdirectory named `./site` in my project!
Figures... No worries. You can use a different directory name as the site root directory, just pass as an
option on [Start Server](pages/setup/start.md).

> Note: The file 'site/pages/welcome/welcome.md' will be brought up when
the site is initially loaded by the browser. If you wish to change that behavior, see the `$.get` 
at the end of 'site/menu/handler.js'. Is pretty obvious how it works. Of course, you **should copy**
`./node_modules/app-http-gui/site/menu/handler.js` to your `./site/menu/handler.js` and make the 
mods there.
