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
    },
    img: {
        poc2g: '<img src="favicon.ico" style="width: 24px;height: 24px;vertical-align: middle;">',
        paperclip: '<div class="pics-paper-clip"><img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/paper-clip.svg"/></div>',
        index1:  {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/js-dom-model.svg',
            href: '//openclipart.org/detail/167038/dom-model'
        },
        index2:  {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/johnny-automatic-pointing-devil.svg',
            href: '//openclipart.org/detail/4368/pointing-devil'
        },
        main1:   {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/greenstar.svg',
            href: '//openclipart.org/detail/170275/green-star'
        },
        sitecss1: {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/liftarn-Any-key.svg',
            href: '//openclipart.org/detail/1320/any-key'
        },
        markupcode1: {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/beakers.svg',
            href: '//en.wikipedia.org/wiki/Pixabay'
        },
        beaker:  {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/beaker.svg',
            href: '//en.wikipedia.org/wiki/Pixabay',
            style: 'float:right;'
        },
        namespace1: '<div class="pics-paper-clip" style="margin-top: 10px;margin-left: 0;">' +
        '<a href="//openclipart.org/detail/237316/ornamental-divider-frame-4">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/point-border1.svg" style="width: 90px;"/>' +
        '</a></div>',
        menujs1:  {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/menu-stamp.svg',
            href: '//openclipart.org/detail/17356/menu-rubber-stamp'
        },
        contents1:   {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/cartoon-mouse.svg',
            href: '//openclipart.org/detail/17622/simple-cartoon-mouse-1'
        },
        contents2:  {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/snooze.svg',
            href: '//openclipart.org/detail/14303/cartomix',
            style: 'position: absolute;z-index: 10;'
        },
        coffeepot: {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/coffeepot.svg',
            href: '//openclipart.org/detail/226353/chemex-style-coffee-maker-fixed-vectorized'
        },
        coffeering: {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/coffeering.svg',
            href: '//openclipart.org/detail/185884/coffee-ring',
            style: 'position: absolute;z-index: -10; opacity:0.5;'
        },
        coffeecode:  {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/coffeecode.svg',
            href: '//openclipart.org/detail/211213/turn-coffee-into-code'
        },
        threecircles:  {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/threecircles.svg',
            href: '//openclipart.org/detail/162055/dance-of-the-circles-3'
        },
        freesoftware: {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/freesoftware.svg',
            href: '//openclipart.org/detail/171002/free-open-source-software-store-logoicon'
        },
        menukey: {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/menu-key.svg',
            href: '//openclipart.org/detail/3879/menu-key'
        },
        redbacteria: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 80%;"> ' +
        '<a href="//openclipart.org/detail/162835/funny-red-bacteria">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/redbacteria.svg" style="width: 110px;"/>' +
        '</a></div>',
        littleredbacteria: {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/redbacteria.svg',
            href: '//openclipart.org/detail/162835/funny-red-bacteria'
        },
        littleredbacteriatext: '{{{img.littleredbacteria}}}',
        manatwork: {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/manatwork.svg',
            href: '//openclipart.org/detail/147823/man-at-work'
        },
        onemistake: {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/onemistake.svg',
            href: '//openclipart.org/detail/239007/the-ticket'
        },
        splat: {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/splat.svg',
            href: '//openclipart.org/detail/211412/splat',
            style: 'vertical-align: middle;'
        },
        gear:  {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/options.svg',
            href: '//openclipart.org/detail/219211/option-button-symbol-minimal-svg-markup'
        },
        windman:  {
            src: '//res.cloudinary.com/potofcoffee2go/image/upload/gh/windman.svg',
            href: '//openclipart.org/detail/233054/wind',
            style: 'float:right;'
        }
    }
};
