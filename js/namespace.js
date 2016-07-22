/**
 {{{ img.namespace1 }}}
 ## <span style="margin-bottom: 58px;margin-left: 76px;">Namespace site_ns</span>

 <br />
 The site namespace contains functions which are accessible
 anywhere in the web application by prefixing the variable or
 function with `site_ns` ie: site_ns.something();

 Functions that do not warrant a separate file are also contained
 in this file.
 */

/// ### OnLoad display logo, name of starting theme, and highlighter
(function () {
    "use strict";

    $(document).ready(function () {
        // Place the logo
        $('#FixedLogo').prepend('<a href="' + site_ns.logo.url + '" target="_blank">' +
            '<img id="logo" src="' + site_ns.logo.img + '" /></a>');

        // Tell marked to highlight code blocks
        marked.setOptions({
            highlight: function (code, lang) {
                return hljs.highlightAuto(code).value;
            }
        });

        // Initialize Handlebars Helpers to inject HTML markup into pages
        site_ns.handlebarHelpers();

        // Determine the starting theme and highlight (set in index.html) and
        //  display the names in the right side of the header
        var themeshref = $('#mdsheet').attr('href').replace('.css', '').split('/');
        var themename = themeshref[themeshref.length - 1];
        $('#theme-change').html(themename);
        var hilighthref = $('#hilightsheet').attr('href').replace('.min.css', '').replace('.css', '').split('/');
        var hilightname = hilighthref[hilighthref.length - 1];
        $('#hilight-change').html(hilightname);

        // Capture the ctrl-a (select all) so that we only select the content text
        site_ns.shortcut.add("Ctrl+A", function () {
            site_ns.selectText('contents');
        });

        // Get loading in-progress animation
        $.get('loader.html', function (data) {
            site_ns.img['loaderHtml'] = data;
        });

        // When the window is resized recalc the left and bottom of #side-contents area
        $(window).resize(function () {
            var c = $('#contents');
            $('#FixedSideBar').css('left',
                (c.outerWidth(true) - parseInt(c.css('margin-right'))) + 'px');
        });
        $(window).resize();
    })
})();

/// ### Handlebars helpers
(function () {
    "use strict";

    function handlebarHelpers() {
        /// Handlebars helper to place images on page
        Handlebars.registerHelper('image', function (pname, pmargin, pwidth) {
            var src = Handlebars.escapeExpression(pname.src);
            var ref = Handlebars.escapeExpression(pname.href);
            var style = Handlebars.escapeExpression(pname.style ? pname.style : '');
            var margin = Handlebars.escapeExpression(pmargin);
            var width = Handlebars.escapeExpression(pwidth);

            console.log('%s %s %s', pname, margin, width);

            // The right and left margin is assigned to the containing div
            //  while the top and bottom margins are assigned to the image
            var margins = margin.split(' ');
            var divmargin = '0 ' + margins[1] + ' 0 ' + margins[3];
            var imgmargin = margins[0] + ' 0 ' + margins[2] + ' 0';

            var divstyle = ['', ''];
            if (/(float:.*;)/.test(style)) {
                divstyle = style.match(/(float:.*;)/i);
            }

            var retval =
                '<div style="margin:' + divmargin + '; width:' + width + ';' + divstyle[1]  + '" class="pic-codeblock">' +
                '<a href="' + ref + '">' +
                '<img style="margin:' + imgmargin + ';' + style + '" src="' + src + '" />' +
                '</a>' +
                '</div>';
            return new Handlebars.SafeString(retval);
        });

        /// Handlebars helper to place inline images on page
        Handlebars.registerHelper('image-inline', function (pname, pwidth) {
            var src = Handlebars.escapeExpression(pname.src);
            var ref = Handlebars.escapeExpression(pname.href);
            var style = Handlebars.escapeExpression(pname.style ? pname.style : '');
            var width = Handlebars.escapeExpression(pwidth);

            console.log('%s %s', pname, width);

            var retval = '<a href="' + ref + '">' +
                '<img src="' + src + '" style="width:' + width + ';' + style + '" /></a>';

            return new Handlebars.SafeString(retval);
        });
    }

    // Expose functions to change theme and code highlight
    site_ns['handlebarHelpers'] = handlebarHelpers;
})();

/// ### Site theme and code highlight
(function () {
    "use strict";

    /// Theme change
    /// When changing the theme insure the site stylesheet is placed after the theme.
    /// {{{img.paperclip}}}
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

    /// Code highlighting
    /// Check if a custom highlighter or standard one from web
    /// {{{img.paperclip}}}
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
            // Un-hide code blocks
            window.setTimeout(function () {
                $('.hljs').animate({opacity: 1.0}, 40);
            }, 200)
        }

        // Help minimize flicker by hiding code blocks
        if ($('.hljs').length) {
            $('.hljs').animate({opacity: 0.01}, 40, function () {
                changeHilight();
            });
        }
        else {
            changeHilight();
        }

    }


    // Expose functions to change theme and code highlight
    site_ns['themeChange'] = themeChange;
    site_ns['hilightChange'] = hilightChange;
})();

/// Code block line numbering
///
/// Minor mods of
///  [highlightjs-line-numbers.js](https://github.com/wcoder/highlightjs-line-numbers.js)
/// {{{img.paperclip}}}
(function () {
    "use strict";


    function lineNumbersBlock(element, out, idx) {
        if (typeof element !== 'object') return;

        var startNbr = out.codeBlockStartingNbrs[idx] || 0;
        var parent = element.parentNode;
        var lines = getCountLines(parent.textContent);

        if (lines) {
            var l = '';
            for (var i = startNbr, count = lines + startNbr; i < count; i++) {
                l += (out.lineNbrs[i] + 1) + '\n';
            }

            var linesPanel = document.createElement('code');
            linesPanel.className = 'hljs hljs-line-numbers';
            linesPanel.style.float = 'left';
            linesPanel.textContent = l;

            parent.insertBefore(linesPanel, element);
        }
    }

    function getCountLines(text) {
        if (text.length === 0) return 0;

        var regExp = /\r\n|\r|\n/g;
        var lines = text.match(regExp);
        lines = lines ? lines.length : 0;

        if (!text[text.length - 1].match(regExp)) {
            lines += 1;
        }

        return lines;
    }

    // Expose function to update browser history
    site_ns['lineNumbersBlock'] = lineNumbersBlock;
})();


/// ###  Update browser history
(function () {
    "use strict";
    var inHistory = false;
    var inRsrc = '';

    /// {{{img.paperclip}}}
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
        if (event.state) {
            inHistory = true;
            var backlink = event.state.rsrc;
            var linkDom = '<a href="' + backlink + '"></a>';
            site_ns.clickContentsLink($.parseHTML(linkDom)[0], event.state.pagePos, true);
            inHistory = false;
        }
    };

    // Expose function to update browser history
    site_ns['updateHistory'] = updateHistory;
})();

/// ### Entry point to generate markup of source code
(function () {
    /// {{{img.paperclip}}}
    function genDoc(type, filepath, options, callback) {
        // Place links into top menu buttons
        //   and show the menu
        $('#tm-raw').attr('rsrc', filepath);
        $('#tm-code').attr('rsrc', filepath);
        $('#tm-comments').attr('rsrc', filepath);
        $('#tm-all').attr('rsrc', filepath);
        $('#top-menu').animate({opacity: 1}, 'fast');

        // Get default markup options
        var options = site_ns.parserOptions(type, options);

        // Get the source code and format into Markdown
        var codeUrl = getCodeUrl(filepath);
        site_ns.markupSource(codeUrl, options, function (out, opt) {
            callback(out, opt);
        });
    }

    // Expose the function that generates markup of source code
    site_ns['genDoc'] = genDoc;

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
})();


/// ### WebSocket to nodejs server for additional content
(function () {
    "use strict";

    if (!site_ns.ioserver.enable) {
        return;
    }

    var socket = io.connect(site_ns.ioserver.url);
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


/// ### Select text used during intercept of Cntl-A
(function () {
    "use strict";

    /// {{{img.paperclip}}}
    function selectText(containerid) {
        if (document.selection) {
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select();
        } else if (window.getSelection) {
            range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().addRange(range);
        }
    }

    site_ns['selectText'] = selectText;
}());
