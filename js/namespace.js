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
        },

        initTinyMCE: function initTinyMCE(page) {
            $.get(page, function (data) {
                $('#contents').html(data);
                tinymce.init({selector: 'textarea.tinymce-text'});
            });
        },

        initSimpleMCE: function initSimpleMCE(page) {
            $.get(page, function (data) {
                $('#contents').html(data);
                var simplemde = new SimpleMDE({element: $("#MySimpleID")[0]});
                simplemde.value("This text will appear in the SimpleMCE editor");
            });
        },

        initAceEditor: function initAceEditor(page) {
            $.get(page, function (data) {
                $('#contents').html(data);
                var editor = ace.edit('ace-editor');
                editor.setTheme('ace/theme/monokai');
                editor.getSession().setMode('ace/mode/javascript');
            });
        }
    };

    // Put the above functions into the app-http-gui namespace
    $.extend(ahg_ns, appHelpers);
})();

(function () {
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
    // Expose function to update browser history
    ahg_ns['updateHistory'] = updateHistory;
})();




