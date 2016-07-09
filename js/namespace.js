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
        function changeHilight() {
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
        }

        if ($('.hljs').length) {
            $('.hljs').animate({opacity: 0.01}, 40, function () {
                changeHilight();
            });
        }
        else {
            changeHilight();
        }

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

(function () {
    /// ### Entry point to generate markup of source code
    function genDoc(type, filepath, options, callback) {
        var codeUrl = getCodeUrl(filepath);

        /// - Display the <button>Raw</button> button in the top-menu
        $('#tm-raw').attr('href', codeUrl);
        $('#tm-raw').show();
        $('#tm-code').show();
        $('#tm-comments').show();

        /// Get default options
        var options = site_ns.parserOptions(type, options);

        /// - Get the source code and format into Markdown
        site_ns.markupSource(codeUrl, options, function (output) {
            callback(output);
        });
    }

    /// ### Determine location of source code
    /// - If site not localhost then get source code from GitHub
    ///   - `../` indicates moving down into the project files
    ///     - so the GitHub source is in **master**
    ///     - otherwise is page in **gh-pages**
    function getCodeUrl(filepath) {
        var src = window.location.href.replace('#', '');
        if ('localhost' !== window.location.hostname) {
            src = site_ns.source;
            if (filepath.indexOf('../') > -1) {
                src += 'master/';
                filepath = filepath.replace('../', '');
            }
            else {
                src += 'gh-pages/';
            }
        }
        return src + filepath;
    }

    /// Expose the function that generates markup of source code
    site_ns['genDoc'] = genDoc;
})();


/// ----
/// WebSocket to nodejs server for additional content
/// ----
// turned off = will remove later
(function () {
    "use strict";

    var socket = io.connect(site_ns.ioserver);
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
