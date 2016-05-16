(function () {
    "use strict";

    /// ## ahg_ns Namespace
    /// The namespace contains functions which are accessable by
    /// from anywhere in the app-http-gui application by prefixing
    /// the variable or function with `ahg_ns` ie: ahg_ns.something();

    /// ### Setup helper functions into namespace
    /// -
    var appHelpers = {

        clientId: null, // uuid assigned by server for socket.io

        hilightChange: function hilightChange(hilight) {
            $('#hilight-change').html(hilight.replace('.css', ''));
            $('#hilightsheet').remove();
            $('head').append(
                    '<link href="highlight/styles/' + hilight + '" rel="stylesheet" id="hilightsheet" />');
        },

        themeChange: function themeChange(theme) {
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
    };

    // Put the above functions into the app-http-gui namespace
    $.extend(ahg_ns, appHelpers);
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

(function () {
    "use strict";
    var input = []; // Array of source lines

    function gendoc(source) {
        var src = 'https://raw.githubusercontent.com/PotOfCoffee2Go/chainframe/master/';
        //var src = 'http://localhost:8080/';
        $.get(src + source, function (data) {
            input = data.toString().split('\n');
            ahg_ns.parseCode(src, input, function (toc, output) {
                $('#contents').html(marked(toc.concat(output).join('\n')));
                ahg_ns.processCodeBlocks();
            })
        },'text')
    }

    /// Expose function to generate markup of source code
    ahg_ns['gendoc'] = gendoc;

})();


