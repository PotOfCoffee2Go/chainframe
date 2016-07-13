/**
 * Created by PotOfCoffee2Go on 7/12/2016.
 */

/**
 ### Site namespace (*site_ns*)
 - name: Name of site
 - logo: Site logo
 - source: Base URL to raw source code on GitHub, BitBucket, etc.
 - ioserver: WebSocket connection for storage, analytics, custom processing, etc
 - url: WebSocket connection for storage, analytics, custom processing, etc
 - enable: Enable server
 - hbars: Handlebars data
 */
var site_ns = {
    name: 'chainframe',
    logo: 'images/art/html5-fahrplan.svg',
    source: '//raw.githubusercontent.com/PotOfCoffee2Go/chainframe/',
    ioserver: {
        url: 'https://bbwebsock-potofcoffee2go.rhcloud.com:8443/',
        enable: false
    },
    hbars: {
        img: {
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
            '</a></div>'

        }
    }
};

