/**
 ## Content handler
 The site content is received using JQuery ajax $.get() and loaded
 into the #contents div. Since most of the site content is written
 in Markdown it must be transformed to HTML for display in the browser.
 Code blocks highlighting is performed as well as special handling of
 links contained in the content as well as having the site menu display
 the content that is being displayed.
 */

/// ----
/// ### Site content handling
/// ----
(function () {
    "use strict";

    /// Add class for [highlight.js](https://highlightjs.org/)
    function setCodeHighlightClass() {
        $('pre code').addClass('hljs');
        // Some themes do not have overflow-x set - so set it
        $('.hljs').css('overflow-x', 'auto');
    }
    /// Generate the documentation through Markdown and hightlight code blocks
    ///   - When one of the code files `js`, `html`, etc.
    ///     - if using the `raw` option
    ///       - do not want to run through Handlebars
    ///       - *so that we leave the Handlebars variables alone*
    ///
    ///   - Otherwise check for a .md file
    ///     - Run data through Markdown and Handlebars
    ///
    ///   - Since all else a no go
    ///     - just output the data
    var typeList = ['js', 'html', 'css', 'json'];
    var extPattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;

    function processContents(link, options) {
        // Format code => markdown => html
        var extension = link.match(extPattern);
        if (typeList.indexOf(extension[1]) > -1) {
            site_ns.genDoc(extension[1], link, options, function (codedoc, options) {
                var markedup = marked(codedoc);
                if (!options.raw) {
                    var compiled = Handlebars.compile(markedup);
                    markedup = compiled(site_ns.hbars);
                }
                $('#contents').html(markedup);
                setCodeHighlightClass();
            })
        }
        else { // Markdown .md file
            $.get(link, function (data) {
                if (/\.md$/.test(link)) {
                    var markedup = marked(data);
                    var compiled = Handlebars.compile(markedup);
                    var handled = compiled(site_ns.hbars);
                    $('#contents').html(handled);
                }
                else {
                    $('#contents').html(data);
                }
                setCodeHighlightClass();
            })
        }
    }

    /// Handle clinking a link in the site content
    var clickContentsLink = function (what, scrollPos, skipHistory) {
        scrollPos = scrollPos || 0;

        /// - Solve problem (IMO) with Markdown where external
        ///   links do not open in a new tab - so...
        /// - when href is not our domain
        ///   - open it up in a new tab on the browser
        var ref = what.href.replace('//', '/').split('/');
        if (ref[1] !== window.location.host) {
            window.open(what.href, '_blank');
            return;
        }

        /// - protocol://hostname/basePathName/link
        ///   - protocol = http or https
        ///   - hostname = localhost or ip address or domain
        ///   - basePathName = path to site directory, examples: / or /my/site/
        ///   - link = subdirectory/filename
        var basePathName = document.location.pathname;
        var basePathLen = basePathName.split('/').length;

        // Remove the protocol, host and pathname from url
        for (var i = 0; i < basePathLen; i++) {
            ref.shift();
        }

        var href = ref.join('/');

        if (skipHistory == null) {
            site_ns.updateHistory(href);
        }

        /// - if a `call` - then just call the function
        ///   that must be in the site_ns namespace
        /// - see [namespace.js](js/namespace.js)
        if (href.substring(0, 5) === 'call/') {
            eval('site_ns.' + href.substring(5));
            return false;
        }

        /// - get the link path and possibly the anchor if there is one
        var linkref = href.split('?')[0].split('#');
        var link = linkref[0];
        var anchor = (linkref.length > 1) ? '#' + linkref[1] : null;

        /// - see if this path is in the menu
        ///   - if it is - then later we will want to display this link
        ///     on the menu so it matches the page being displayed
        ///   - if it is not on the menu
        ///     - no harm, will remain as is
        var rsrc = $('[rsrc="' + link + '"]');
        $('#rsrc-change').html(link);

        /// - Get the top menu id
        ///   - is possible that we are displaying a page not on the menu
        ///     - so just close up the menu
        var menuid = '#' + rsrc.closest('ul').prev('a').attr('id');
        if (menuid === '#undefined') {
            $('#cssmenu ul li.active ul').slideUp('normal');
        }

        /// - get the page and put it in the content
        ///   - the code blocks have to have the 'hljs' class
        ///     assigned for highlighting
        processContents(link, {}, function (data) {
            if (scrollPos) {
                $('#PageFrame').animate({scrollTop: scrollPos}, 200);
            }
            else {
                $('#PageFrame').animate({scrollTop: 0}, 100);
            }

            // switch the active submenu item to the one that represents
            //  the page we just put into #contents
            $('#cssmenu a').removeClass('subactive');
            rsrc.addClass('subactive');

            // switch the main menu item if that has changed
            if ($(menuid).parent().hasClass('active') === false) {
                site_ns.clickMainMenu(menuid);
            }

            /// - insure that we scroll to the top of the page
            ///   - if we have an anchor in the link then calculate
            ///     the amount to scroll down to get to it
            ///   - and scroll to the anchor
            $('#PageFrame').animate({scrollTop: scrollPos}, 0, function () {
                if (anchor) {
                    var pos = Math.round($('#PageFrame').scrollTop() +
                        $(anchor).offset().top -
                        $('#PageFrame').offset().top - 10
                    );
                    $('#PageFrame').animate({scrollTop: pos}, 500, function () {
                        $(anchor).fadeOut(150).fadeIn(150)
                            .fadeOut(150).fadeIn(150);
                    });
                }
            });
        });
        return false;
    };

/// ----
/// ### Onload set up click on link handler, get the menu and welcome page
/// ----
    $(document).ready(function () {

        /// - Link was clicked on a page that is in the #contents div
        $('#contents').on('click', 'a', function (event) {
            event.preventDefault();
            clickContentsLink(this);
        });

        /// Get menu html and bring up default content on load
        $.get('menu/menu.html', function (data) {
            // Change the 'href' attribute name to 'rsrc'
            var adjdata = data.replace(/href/g, 'rsrc');
            // Show the menu
            $('#menu-contents').html(adjdata);
            // Add 'href' attribute to point to nothing
            $('#menu-contents a').attr('href', 'javascript:;');

            // Get the welcome page
            site_ns.clickMainMenu($("#menu-home"));
            $('[rsrc="pages/welcome/welcome.md"]').trigger('click');
        });

        /// Get menu html and bring up default content on load
        $.get('menu/topmenu.html', function (data) {
            // Show the menu
            $('#top-menu').html(data);
        });
    });

    /// Expose clickContentsLink and processContents
    site_ns['clickContentsLink'] = clickContentsLink;
    site_ns['processContents'] = processContents;
})();