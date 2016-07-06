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
        $('html').animate({opacity: 0.01}, 400, function () {
            $('#theme-change').html(theme.replace('.css', ''));
            $('#mdsheet').remove();
            $('#sitesheet').remove();
            $('head').append(
                    '<link href="css/mdthemes/' + theme + '" rel="stylesheet" id="mdsheet" />');
            $('head').append(
                    '<link href="css/site.css" rel="stylesheet" id="sitesheet" />');
            setTimeout(function () {
                $('html').animate({opacity: 1.0}, 400);
            }, 200)
        });
    }

    function hilightChange(hilight) {
        $('.hljs').animate({opacity: 0.01}, 40, function () {
            $('#hilight-change').html(hilight.replace('.min.css', '').replace('.css', ''));
            $('#hilightsheet').remove();
            if (hilight.indexOf('highlight/styles/') > -1) {
                $('head').append(
                        '<link href="'
                        + hilight
                        + '" rel="stylesheet" id="hilightsheet" />');
            }
            else {
                hilight = hilight.replace('highlight/styles/', '');
                $('head').append(
                        '<link href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.5.0/styles/'
                        + hilight
                        + '" rel="stylesheet" id="hilightsheet" />');
            }
            window.setTimeout(function () {
                $('.hljs').animate({opacity: 1.0}, 40);
            }, 200)
        });
    }

    /// OnLoad display name of starting theme and highlighter
    $(document).ready(function () {
        var themeshref = $('#mdsheet').attr('href').replace('.css', '').split('/');
        var themename = themeshref[themeshref.length - 1];
        $('#theme-change').html(themename);
        var hilighthref = $('#hilightsheet').attr('href').replace('.min.css', '').replace('.css', '').split('/');
        var hilightname = hilighthref[hilighthref.length - 1];
        $('#hilight-change').html(hilightname);
    });

    // Expose functions to generate markup of source code
    site_ns['themeChange'] = themeChange;
    site_ns['hilightChange'] = hilightChange;
})();

/// ----
/// Show Raw text in contents area
/// ----
(function () {
    "use strict";

    function showRawText(link) {
        $.get(link, function (data) {
            // Array of source lines
            var input = '<pre><code>' + data.toString() + '</code></pre>';
            $('#contents').html(input);
        }, 'text');
        return false;
    }

    // Expose function to get text of source
    site_ns['showRawText'] = showRawText;
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
        site_ns.clickContentsLink($.parseHTML(linkDom)[0], event.state.pagePos, true);
        inHistory = false;
    };

    // Expose function to update browser history
    site_ns['updateHistory'] = updateHistory;
})();


/// ----
/// WebSocket to nodejs server for additional content
/// ----
// turned off = will remove later
(function () {
    "use strict";

    return;

    var socket = io.connect('https://bbwebsock-potofcoffee2go.rhcloud.com:8000/');
    //var socket = io.connect('http://localhost:3000/');

    socket.on('connection', function (socket) {
        changeIoIndicator('red');
    });
    socket.on('disconnect', function () {
        changeIoIndicator('red');
    });

    socket.on('connected', function (msg) {
        onConnected(msg);
    });

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
        $('#headerleft > #socketio-change > img').attr('src', 'images/io-' + color + '.png');
    }
}());
