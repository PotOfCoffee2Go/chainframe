/// ## site_ns Namespace
/// The site namespace contains functions which are accessible
/// anywhere in the web application by prefixing the variable or
/// function with `site_ns` ie: site_ns.something();

/// ----
/// Site theme and code highlight
/// ----
(function () {
    "use strict";

    function themeChange(theme) {
        $('html').fadeOut(300, function () {
            $('#theme-change').html(theme.replace('.css', ''));
            $('#mdsheet').remove();
            $('#sitesheet').remove();
            $('head').append(
                    '<link href="css/mdthemes/' + theme + '" rel="stylesheet" id="mdsheet" />');
            $('head').append(
                    '<link href="css/site.css" rel="stylesheet" id="sitesheet" />');
            window.setTimeout(function () {
                $('html').fadeIn(500);
            }, 200)
        });
    }

    function hilightChange(hilight) {
        $('#hilight-change').html(hilight.replace('.css', ''));
        $('#hilightsheet').remove();
        $('head').append(
                '<link href="highlight/styles/' + hilight + '" rel="stylesheet" id="hilightsheet" />');
    }

    /// OnLoad display name of starting theme and highlighter
    $(document).ready(function () {
        var themeshref = $('#mdsheet').attr('href').replace('.css', '').split('/');
        var themename = themeshref[themeshref.length - 1];
        $('#theme-change').html(themename);
        var hilighthref = $('#hilightsheet').attr('href').replace('.css', '').split('/');
        var hilightname = hilighthref[hilighthref.length - 1];
        $('#hilight-change').html(hilightname);
    });

    // Put the above functions into namespace
    site_ns['themeChange'] = themeChange;
    site_ns['hilightChange'] = hilightChange;
})();

/// ----
/// Update browser history
/// ----
(function () {
    "use strict";
    var inHistory = false;
    var inRsrc = '';

    function updateHistory(link) {
        if (!inHistory) {
            var $scrollFrame = $('#PageFrame');
            var inPagePos = Math.round($scrollFrame.scrollTop() +
                    $scrollFrame.offset().top - $('#AbsoluteHeader').height()
            );
            window.history.replaceState({rsrc: inRsrc, pagePos: inPagePos}, '');
            window.history.pushState({rsrc: link, pagePos: 0}, '');
        }
        inRsrc = link;
    }

    window.onpopstate = function (event) {
        inHistory = true;
        var backlink = event.state.rsrc;
        var linkDom = '<a href="' + backlink + '"></a>';
        site_ns.clickContentsLink($.parseHTML(linkDom)[0], event.state.pagePos);
        inHistory = false;
    };

    /// Expose function to update browser history
    site_ns['updateHistory'] = updateHistory;
})();

/// ----
// Generate markup of source code
/// ----
(function () {
    "use strict";
    var input = []; // Array of source lines

    function gendoc(source) {
        var src = 'http://localhost:8080/';
        if ('localhost' !== window.location.hostname) {
            // We are on GitHub - so use the source from there
            src = 'https://raw.githubusercontent.com/PotOfCoffee2Go/chainframe/';
            // GitHub source in master unless is gh-pages
            if (source.indexOf('gh-pages') !== 0) {
                src += 'master/'
            }
        }
        $.get(src + source, function (data) {
            input = data.toString().split('\n');
            site_ns.parseCode(src, input, function (output) {
                site_ns.processContents('code.md', output.join('\n'));
            })
        }, 'text')
    }

    /// Expose function to generate markup of source code
    site_ns['gendoc'] = gendoc;
})();


/// ----
/// WebSocket to nodejs server for additional content
/// ----
(function () {
    "use strict";

    var socket = io.connect('http://bbwebsock-potofcoffee2go.rhcloud.com:8000/');
    //var socket = io.connect('http://localhost:3000/');
    socket.on('connection', function (socket) {
        changeIoIndicator('red');
    });
    socket.on('disconnect', function () {
        changeIoIndicator('red');
    });

    socket.on('connected', function (msg) {onConnected(msg);});

    // Export variables and functions

    // --- Connection has been established to server ----
    function onConnected(msg) {
        console.log('OnConnected: ' + JSON.stringify(msg));
        emitConnected();
    }

    function emitConnected() {
        socket.emit('connected',
                {
                    data: {
                        ClientId: 'kim2',
                        clientconfirmconnected: 'yes'
                    }
                }
        );
        changeIoIndicator('green');
    }

    // -----------------------

    function changeIoIndicator(color) {
        $('#headerleft > #socketio-change > img').
                attr('src', 'images/io-' + color + '.png');
    }
}());
