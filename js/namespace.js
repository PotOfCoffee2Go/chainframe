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
/// Format code to markdown for browser presentation
/// ----
(function () {
    "use strict";

    /// ----
    /// Generate markup of source code
    function genDoc(type, source, callback) {
        var options = {};
        switch (type) {
            case 'js' :
                options = {
                    ext: 'js',
                    lineCmntTag: '///',
                    codeblockCmntBeg: '/*',
                    blockCmntBeg: '/**',
                    blockCmntEnd: '*/'
                };
                break;
            case 'html' :
                options = {
                    ext: 'html',
                    lineCmntTag: null,
                    codeblockCmntBeg: '<!--',
                    blockCmntBeg: '<!---',
                    blockCmntEnd: '-->'
                };
                break;
            case 'css' :
                options = {
                    ext: 'css',
                    lineCmntTag: null,
                    codeblockCmntBeg: '/*',
                    blockCmntBeg: '/**',
                    blockCmntEnd: '*/'
                };
                break;
            case 'json' :
                options = {
                    ext: 'json',
                    lineCmntTag: null,
                    codeblockCmntBeg: null,
                    blockCmntBeg: null,
                    blockCmntEnd: null
                };
                break;
            default:
                return;
        }

        // Get the source code and format into Markdown
        codeToMarkdown(source, options, function (output) {
            callback(output);
        });
    }

    // Expose function to generate markup of source code
    site_ns['genDoc'] = genDoc;

    /// ----

    /// **Determine location and get source code**
    function codeToMarkdown(source, options, callback) {

        var src = window.location.href.replace('#', '');
        // If site not localhost then get source code from GitHub
        if ('localhost' !== window.location.hostname) {
            // We are on GitHub - so use the source from there
            src = site_ns.source;
            // GitHub source in master unless is gh-pages
            if (source.indexOf('../') > -1) {
                src += 'master/';
                source = source.replace('../', '');
            }
            else {
                src += 'gh-pages/';
            }
        }

        $('#tm-raw').attr('href', src + source);
        $('#tm-raw').show();
        // Get source and convert to Markdown
        $.get(src + source, function (data) {
            // Array of source lines
            var input = data.toString().split('\n');
            metaComments(options, input, function (output) {
                callback(output.join('\n'));
            })
        }, 'text');
    }

    /// Parse for comments which can use Markdown
    function metaComments(opt, input, callback) {
        var flags = [];
        var output = [];
        // Assume each line is code
        for (var i = 0, l = input.length; i < l; i++) {
            flags.push(' ');
            input[i] = input[i].replace('\r', '');
        }

        /// Determine if first line is comment or code
        var jsdocBeg = false;
        var expected = ' '; // assume starting with code
        if ((opt.lineCmntTag && input[0].trim().indexOf(opt.lineCmntTag) === 0) ||
                (opt.blockCmntBeg && input[0].trim().indexOf(opt.blockCmntBeg) === 0)) {
            expected = 'c'; // is a comment
        }

        /// Flag and remove comment tags
        for (i = 0, l = flags.length; i < l; i++) {
            // Blank line is flagged same as prior line
            if (input[i].trim() === '') {
                flags[i] = flags[i ? i - 1 : 0];
                continue;
            }
            // Single line comment
            if (opt.lineCmntTag && input[i].trim().indexOf(opt.lineCmntTag) === 0) {
                input[i] = input[i].trim().replace(opt.lineCmntTag, '');
                flags[i] = 'c'; // comment
                expected = ' ';
                continue;
            }
            // JSDoc comment block
            if (flags[i ? i - 1 : 0] === 'c') {
                // JSDoc comment
                if (input[i].substring(0, 3) === ' * ') {
                    // Previous is blank - this one is the title
                    if (jsdocBeg
                            && input[i].length > 3
                            && input[i][3] !== '@') {
                        input[i] = '**' + input[i].substring(3) + '**';
                    }
                    else {
                        input[i] = input[i].replace(' * ', '  - ');
                    }
                    flags[i] = 'c'; // comment
                    expected = 'c';
                    jsdocBeg = false;
                    continue;
                }
                // Blank JSDoc comment
                if (input[i] === ' *') {
                    input[i] = '';
                    flags[i] = 'c'; // comment
                    expected = 'c';
                    jsdocBeg = false;
                    continue;
                }
            }
            jsdocBeg = false;
            // Start of a code block comment ex: /* for javascript
            if (opt.codeblockCmntBeg && input[i].indexOf(opt.codeblockCmntBeg) === 0
                    && opt.blockCmntBeg && input[i].trim().indexOf(opt.blockCmntBeg) === -1) {
                flags[i] = ' ';
                expected = ' ';
                continue;
            }
            // Start of block comment
            if (opt.blockCmntBeg && input[i].trim().indexOf(opt.blockCmntBeg) === 0) {
                input[i] = input[i].trim().replace(opt.blockCmntBeg, '');
                flags[i] = 'c';
                if (opt.blockCmntEnd && input[i].indexOf(opt.blockCmntEnd) > -1) {
                    input[i] = input[i]
                            .replace(opt.blockCmntEnd[0] + opt.blockCmntEnd, '')
                            .replace(opt.blockCmntEnd, '');
                    expected = ' ';
                }
                else {
                    jsdocBeg = true;
                    expected = 'c';
                }
                continue;
            }
            // End of comment and we are in a comment block
            if (opt.blockCmntEnd && input[i].indexOf(opt.blockCmntEnd) > -1) {
                if (flags[i ? i - 1 : 0] === 'c') {
                    input[i] = input[i]
                            .replace(opt.blockCmntEnd[0] + opt.blockCmntEnd, '')
                            .replace(opt.blockCmntEnd, '');
                    flags[i] = 'c'; // comment
                    expected = ' ';
                    continue;
                }
            }
            // None of the special conditions
            //  flag with what is expected
            //  'c' if in a comment block
            //  ' ' if expecting a code block
            flags[i] = expected;
        }

        /// Output the markdown text
        for (i = 0, l = flags.length; i < l; i++) {
            // Handle the first line
            //  start a code block when appropriate
            if (i === 0) {
                if (flags[i] === ' ') {
                    output.push('```' + opt.ext);
                }
                output.push(input[i]);
                continue;
            }
            // Remain in the comment or code block
            //  when previous flag and current are the same
            if (flags[i] === flags[i - 1]) {
                output.push(flags[i] === 'c' ? input[i].trim() : input[i]);
                continue;
            }
            // Switching from comment to code block
            if (flags[i] === ' ') {
                output.push(''); // insure blank line before code block
                output.push('```' + opt.ext);
                output.push(input[i]);
                continue;
            }
            // Switching from code to comment block
            if (flags[i] === 'c') {
                output.push('```');
                output.push(input[i].trim());
                continue;
            }
            // Should never get here
            throw new Error('Parsing of meta comments error')
        }

        /// Terminate code block at the end
        if (flags[flags.length - 1] === ' ') {
            output.push('```');
        }
        callback(output);
    }
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
