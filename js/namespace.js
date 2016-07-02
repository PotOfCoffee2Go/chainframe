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

    /// Expose functions to generate markup of source code
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
        site_ns.clickContentsLink($.parseHTML(linkDom)[0], event.state.pagePos, true);
        inHistory = false;
    };

    /// Expose function to update browser history
    site_ns['updateHistory'] = updateHistory;
})();

/// ----
/// Generate markup of source code
/// ----
(function () {
    "use strict";
    var input = []; // Array of source lines

    function gendoc(source, callback) {
        // Get the site href - http(s)://hostname/pathname/
        var src = window.location.href;

        // If not on localhost then get source code from GitHub
        if ('localhost' !== window.location.hostname) {
            // We are on GitHub - so use the source from there
            src = site_ns.source;
            // GitHub source in master unless is gh-pages
            if (source.indexOf('gh-pages') !== 0) {
                src += 'master/'
            }
        }
        $.get(src + source, function (data) {
            input = data.toString().split('\n');
            parse(src, input, function (output) {
                callback(output.join('\n'));
            })
        }, 'text')
    }

    /// ### Parse the input lines. Line is either comment or code
    function parse(rsrcPath, input, callback) {
        var output = [];
        var state = 'comment';  // State of parser 'comment' or 'code'

        // For each line[i]. determine if comment or code
        for (var i = 0, l = input.length; i < l; i++) {

            // blank line
            if (input[i].trim() === '') {
                output.push(input[i].trim());
            }
            // meta comment
            else if (input[i].trim().substring(0, 3) === '///') {
                testState('comment');
                output.push(input[i].trim().substring(4)); // remove '/// '
            }
            // code
            else {
                testState('code');
                output.push(input[i]);
            }
        }
        // When done insure we close off a code block
        // by setting state to a comment
        testState('comment');

        callback(output);

        /// Test line[i]. state transistion
        /// - state unchanged,
        /// - to comment
        /// - or to code
        function testState(newState) {
            if (state === newState) return; // No change
            if (state === 'comment' && newState === 'code') {
                output.push(''); // insure blank line before code block
                output.push('```js');
            }
            if (state === 'code' && newState === 'comment') {
                output.push('```');
            }
            state = newState;
        }
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
