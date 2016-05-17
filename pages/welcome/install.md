## Working with site content
Site content is provided by a JavaScript function (handler) or must reside somewhere in your project `site`
directory or one of it's subdirectories. Files outside of the `site` directory _could_ be accessed
by you writing a handler function, if the need arises.

HTML and Markdown content changes will take effect immediately with the changes being displayed the next time
they are accessed by the browser.

Changes to `site/menu.html` or `site/index.html` will require a press of the Reload button on your browser.

Changes to JavaScript handler functions will require a server restart.

### Add or change the menu :
 - This is a core part of **app-http-gui** and simple to do once you get the hang of it.
 - See [Setup Menu](pages/setup/menu.md) for more than you want to know about the menu.
 
### Add content to your site :
 - Create a file containing HTML (.html) or Markdown(.md) content. This file would normally be stored under the
 `pages` subdirectory of your `site` but can be placed anywhere within the `site` directory.
 - Add a menu reference to the file in `site/menu.html` and/or create a link from another page.
 - Click a reference to the changed content and the new content will be displayed.

### To change the site appearance or presentation :
 - If high level page layout (head, body, header, etc.) being changed then modifying `site/index.html` is
probably the best place to start.
 - Add to or modify the style sheets in the `site/css` directory to change the presentation.
 - Press the Reload button on your browser to see the changes.

### Add a form :
 - A method of implementing inline forms in HTML or Markdown is supported. See 
[Submit Form Example](pages/examples/submitform.md).

### Add content created by JavaScript :
 - Create a JavaScript 'handler' function in the .js file which references the server. (Has the
 `var server = require('app-http-gui');` in it).
 - Add the handler to the server with `server.registerHandler('resource/name',functionName);`.
 - Reference the 'resource/name' in `site/menu.html` and/or create a link from another page.
 - Restart the server (nodejs functions require a server restart to take effect).

### Download a file :
 - Create a file that is to be downloaded.
 - Add 'api/download/' in front of the file reference in the link.
 - Click the reference and the browser will download the file.

### Upload a file :
 - Add 'api/upload/' as file reference in the link. This will display a form on the browser allowing the
 user to select and upload a file.
 - Click the reference to upload a file.


