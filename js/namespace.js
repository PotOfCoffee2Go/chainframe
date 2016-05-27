/// ## ahg_ns Namespace
/// The namespace contains functions which are accessable by
/// from anywhere in the app-http-gui application by prefixing
/// the variable or function with `ahg_ns` ie: ahg_ns.something();

/// Change the site theme and code highlight
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

    // Put the above functions into namespace
    ahg_ns['themeChange'] = themeChange;
    ahg_ns['hilightChange'] = hilightChange;
})();

/// Update browser history
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
        ahg_ns.clickContentsLink($.parseHTML(linkDom)[0], event.state.pagePos);
        inHistory = false;
    };

    /// Expose function to update browser history
    ahg_ns['updateHistory'] = updateHistory;
})();

/// Generate markup of source code
(function () {
    "use strict";
    var input = []; // Array of source lines

    function gendoc(source) {
        var src = 'http://localhost:8080/';
        if ('localhost' !== window.location.hostname) {
            src = 'https://raw.githubusercontent.com/PotOfCoffee2Go/chainframe/master/';
        }
        $.get(src + source, function (data) {
            input = data.toString().split('\n');
            ahg_ns.parseCode(src, input, function (output) {
                ahg_ns.processContents('code.md', output.join('\n'));
            })
        }, 'text')
    }

    /// Expose function to generate markup of source code
    ahg_ns['gendoc'] = gendoc;

})();


/// WebSocket to nodejs server for additional content
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
