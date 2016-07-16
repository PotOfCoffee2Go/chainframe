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
 - hbars: Handlebars data
 */
var site_ns = {
    name: 'chainframe',
    logo: {
        img: 'images/art/html5-fahrplan.svg',
        url: '//github.com/PotOfCoffee2Go/chainframe/tree/master'
    },
    source: '//raw.githubusercontent.com/PotOfCoffee2Go/chainframe/',
    ioserver: {
        url: 'https://bbwebsock-potofcoffee2go.rhcloud.com:8443/',
        enable: true
    },
    hbars: {
        img: {
            poc2g: '<img src="favicon.ico" style="width: 24px;height: 24px;vertical-align: middle;">',
            paperclip: '<div class="pics-paper-clip"><img src="images/art/paper-clip.svg"/></div>',
            index1: '<div><a href="https://openclipart.org/detail/167038/dom-model">' +
            '<img src="images/art/js-dom-model.svg"  class="pics-left" style="width: 100px;"/>' +
            '</a></div>',
            index2: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 35%;">' +
            '<a href="https://openclipart.org/detail/4368/pointing-devil">' +
            '<img src="images/art/johnny-automatic-pointing-devil.svg" style="width: 90px;"/>' +
            '</a></div>',
            main1: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 18%;">' +
            '<a href="//openclipart.org/detail/170275/green-star">' +
            '<img src="images/art/greenstar.svg" style="width: 80px;"/>' +
            '</a></div>',
            sitecss1: '<a href="https://openclipart.org/detail/1320/any-key">' +
            '<img class="pics-left" src="images/art/liftarn-Any-key.svg" />' +
            '</a>',
            markupcode1: '<a href="//en.wikipedia.org/wiki/Pixabay">' +
            '<img style="float: left; margin: 26px 15px 15px 0px;" src="images/art/beakers.svg" width="100" />' +
            '</a>',
            namespace1: '<div class="pics-paper-clip" style="margin-top: 10px;margin-left: 0;">' +
            '<a href="https://openclipart.org/detail/237316/ornamental-divider-frame-4">' +
            '<img src="images/art/point-border1.svg" style="width: 90px;"/>' +
            '</a></div>',
            menujs1: '<a href="https://openclipart.org/detail/17356/menu-rubber-stamp">' +
            '<img class="pics-left" src="images/art/menu-stamp.svg" />' +
            '</a>',
            contents1: '<a href="https://openclipart.org/detail/17622/simple-cartoon-mouse-1">' +
            '<img class="pics-left" src="images/art/cartoon-mouse.svg" />' +
            '</a>',
            contents2: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 48%;">' +
            '<a href="//openclipart.org/detail/14303/cartomix">' +
            '<img src="images/art/snooze.svg" style="width: 80px;"/>' +
            '</a></div>',
            coffeepot: '<a href="//openclipart.org/detail/226353/chemex-style-coffee-maker-fixed-vectorized">' +
            '<img src="images/art/coffeepot.svg" style="width: 80px;"/>' +
            '</a>',
            coffeering: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 10%;">' +
            '<a href="//openclipart.org/detail/185884/coffee-ring">' +
            '<img src="images/art/coffeering.svg" style=" z-index: -10;width: 300px;"/>' +
            '</a></div>',
            coffeecode: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 30%;">' +
            '<a href="//openclipart.org/detail/211213/turn-coffee-into-code">' +
            '<img src="images/art/coffeecode.svg" style="width: 110px;"/>' +
            '</a></div>',
            threecircles: '<div class="pics-paper-clip" style="margin-top: 1px;margin-left: 80%;">' +
            '<a href="//openclipart.org/detail/162055/dance-of-the-circles-3">' +
            '<img src="images/art/threecircles.svg" style="width: 110px;"/>' +
            '</a></div>',
            freesoftware: '<a href="https://openclipart.org/detail/171002/free-open-source-software-store-logoicon">' +
            '<img class="pics-left" src="images/art/freesoftware.svg" style="width: 80px;"/>' +
            '</a>'
        }
    }
};

/*




 */


