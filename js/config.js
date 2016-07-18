/**
 {{{ img.coffeecode }}}
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
        index1: '<div><a href="//openclipart.org/detail/167038/dom-model">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/js-dom-model.svg"  class="pics-left" style="width: 100px;"/>' +
        '</a></div>',
        index2: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 35%;">' +
        '<a href="//openclipart.org/detail/4368/pointing-devil">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/johnny-automatic-pointing-devil.svg" style="width: 90px;"/>' +
        '</a></div>',
        main1: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 18%;">' +
        '<a href="//openclipart.org/detail/170275/green-star">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/greenstar.svg" style="width: 80px;"/>' +
        '</a></div>',
        sitecss1: '<a href="https://openclipart.org/detail/1320/any-key">' +
        '<img class="pics-left" src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/liftarn-Any-key.svg" />' +
        '</a>',
        markupcode1: '<a href="//en.wikipedia.org/wiki/Pixabay">' +
        '<img style="float: left; margin: 26px 15px 15px 0px;" src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/beakers.svg" width="100" />' +
        '</a>',
        namespace1: '<div class="pics-paper-clip" style="margin-top: 10px;margin-left: 0;">' +
        '<a href="//openclipart.org/detail/237316/ornamental-divider-frame-4">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/point-border1.svg" style="width: 90px;"/>' +
        '</a></div>',
        menujs1: '<a href="https://openclipart.org/detail/17356/menu-rubber-stamp">' +
        '<img class="pics-left" src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/menu-stamp.svg" />' +
        '</a>',
        contents1: '<a href="https://openclipart.org/detail/17622/simple-cartoon-mouse-1">' +
        '<img class="pics-left" src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/cartoon-mouse.svg" />' +
        '</a>',
        contents2: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 48%;">' +
        '<a href="//openclipart.org/detail/14303/cartomix">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/snooze.svg" style="width: 80px;"/>' +
        '</a></div>',
        coffeepot: '<a href="//openclipart.org/detail/226353/chemex-style-coffee-maker-fixed-vectorized">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/coffeepot.svg" style="float: left; width: 80px;"/>' +
        '</a>',
        coffeering: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 10%;">' +
        '<a href="//openclipart.org/detail/185884/coffee-ring">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/coffeering.svg" style=" z-index: -10;width: 300px;"/>' +
        '</a></div>',
        coffeecode: '<a href="//openclipart.org/detail/211213/turn-coffee-into-code">' +
        '<img  class="pics-left" src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/coffeecode.svg" style="width: 110px;"/>' +
        '</a>',
        threecircles: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 80%;">' +
        '<a href="//openclipart.org/detail/162055/dance-of-the-circles-3">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/threecircles.svg" style="width: 110px;"/>' +
        '</a></div>',
        freesoftware: '<a href="//openclipart.org/detail/171002/free-open-source-software-store-logoicon">' +
        '<img class="pics-left" src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/freesoftware.svg" style="width: 80px;"/>' +
        '</a>',
        menukey: '<a href="//openclipart.org/detail/3879/menu-key">' +
        '<img class="pics-left" src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/menu-key.svg" style="width: 50px;"/>' +
        '</a>',
        redbacteria: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 80%;"> ' +
        '<a href="//openclipart.org/detail/162835/funny-red-bacteria">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/redbacteria.svg" style="width: 110px;"/>' +
        '</a></div>',
        littleredbacteria: '<a href="//openclipart.org/detail/162835/funny-red-bacteria">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/redbacteria.svg" style="width: 3em;vertical-align: middle;"/>' +
        '</a>',
        littleredbacteriatext: '{{{img.littleredbacteria}}}',
        manatwork: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 70%;"> ' +
        '<a href="//openclipart.org/detail/147823/man-at-work">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/manatwork.svg" style="width: 160px;"/>' +
        '</a></div>',
        onemistake: '<a href="//openclipart.org/detail/239007/the-ticket">' +
        '<img class="pics-left" src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/onemistake.svg" style="width: 110px;"/>' +
        '</a>',
        splat: '<a href="//openclipart.org/detail/211412/splat">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/splat.svg" style="width: 2em;vertical-align: middle;"/>' +
        '</a>',
        gear: '<a href="//openclipart.org/detail/219211/option-button-symbol-minimal-svg-markup">' +
        '<img class="pics-left" src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/options.svg" style="width: 60px;"/>' +
        '</a>',
        windman: '<div><a href="https://openclipart.org/detail/233054/wind">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/windman.svg" class="pics-right" style="width: 130px;"/>' +
        '</a></div>'
    }
};
