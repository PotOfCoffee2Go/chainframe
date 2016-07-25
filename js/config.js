/**
 {{{ image img.coffeecode '0 10px 0 0' '110px'}}}
 Created by PotOfCoffee2Go on 7/12/2016.

 This config file is more like a .json file than a .js file,
 but since there is no standard method to comment a JSON file
 figured would make the equivalent in Javascript. Has the benefit
 that the compiler bitches if there are any syntax errors and
 no need to do a `JSON.parse()` on it (not that it matters that much).

 At least can insert comments into javascript.

 The `site_ns` variable is the namespace for the variables and functions
 used by the site. The functions are added on document load. Most of the
 functions in [namespace.js](js/namespace.js) are added to the `site_ns` object
 defined below.

 > Note that this file should be loaded before the other site javascript
 files in [index.html](index.html).

 Handlebars is passed the `site_ns` object when called to compile and
 handle the substitutions. Thus it can see all the objects contained
 in `site_ns`. See [Handlebars](pages/site/handlebarsdoc.md) for more info.


 */

/**

 ### Site namespace (*site_ns*)
 - name: Name of site
 - logo: Site logo
   - img: Logo image URL
   - url: URL to go to when logo clicked
 - source: Base URL to raw source code on GitHub, BitBucket, etc.
 - ioserver: WebSocket connection for storage, analytics, custom processing, etc
   - url: WebSocket connection for storage, analytics, custom processing, etc
   - enable: Enable server
 - img: HTML code to display image via Handlebars

 {{{img.paperclip}}}
 */
var site_ns = {
    name: 'chainframe',
    logo: {
        img: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/html5-fahrplan.svg',
        url: '//github.com/PotOfCoffee2Go/chainframe/tree/master'
    },
    source: '//raw.githubusercontent.com/PotOfCoffee2Go/chainframe/',
    ioserver: {
        url: 'https://bbwebsock-potofcoffee2go.rhcloud.com:8443/',
        enable: false
    }
};
