/**
 {{{ img.coffeecode }}}
 Created by PotOfCoffee2Go on 7/12/2016.
 */

/**

 ### Site namespace (*site_ns*)
 - name: Name of site
 - logo: Site logo
   - img: Image URL
   - url: URL to go to when clicked
 - source: Base URL to raw source code on GitHub, BitBucket, etc.
 - ioserver: WebSocket connection for storage, analytics, custom processing, etc
   - url: WebSocket connection for storage, analytics, custom processing, etc
   - enable: Enable server


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
        coffeecode: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 30%;">' +
        '<a href="//openclipart.org/detail/211213/turn-coffee-into-code">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/coffeecode.svg" style="width: 110px;"/>' +
        '</a></div>',
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
        manatwork: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 70%;"> ' +
        '<a href="//openclipart.org/detail/147823/man-at-work">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/manatwork.svg" style="width: 160px;"/>' +
        '</a></div>',
        onemistake: '<a href="//openclipart.org/detail/239007/the-ticket">' +
        '<img class="pics-left" src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/onemistake.svg" style="width: 110px;"/>' +
        '</a>',
        windman: '<div><a href="https://openclipart.org/detail/233054/wind">' +
        '<img src="//res.cloudinary.com/potofcoffee2go/image/upload/gh/windman.svg" class="pics-right" style="width: 130px;"/>' +
        '</a></div>'


    }
};
