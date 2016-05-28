/// ## Content handler
/// The site content is received using JQuery ajax $.get() and loaded
/// into the #contents div. Since most of the site content is written
/// in Markdown it must be transformed to HTML for display in the browser.
/// Code blocks highlighting is performed as well as special handling of
/// links contained in the content as well as having the site menu display
/// the content that is being displayed.

/// ----
/// ### Site content handling
/// ----
(function () {
    "use strict";

    /// If a markdown file then transform to html and
    /// insure code blocks hav the highlight.js class
    function processContents(link, data) {
        $('#PageFrame').animate({scrollTop: 0}, 100);
        if (/\.md$/.test(link)) {
            $('#contents').html(marked(data));
        }
        else {
            $('#contents').html(data);
        }
        $('pre code').addClass('hljs');
        // Some themes do not have overflow-x set - so set it
        $('.hljs').css('overflow-x', 'auto');
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
        // Remove the protocol and host from the url
        ref.shift();
        ref.shift();
        var href = ref.join('/');

        if (skipHistory == null) {
            site_ns.updateHistory(href);
        }

        /// - if a `call` - then just call the function
        ///   that must be in the ahg namespace
        /// - see [namespace.js](js/namespace.js)
        if (href.substring(0, 5) === 'call/') {
            $('#rsrc-change').html(href.replace('call/', ''));
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
        $.get('/' + link, function (data) {
            processContents(link, data);
            if (scrollPos) {
                $('#PageFrame').animate({scrollTop: scrollPos}, 200);
            }

            // switch the active submenu item to the one that represents
            //  the page we just put into #contents
            $('#cssmenu a').removeClass('subactive');
            rsrc.addClass('subactive');

            // switch the main menu item if that has changed
            if ($(menuid).parent().hasClass('active') === false) {
                site_ns.clickTopMenu(menuid);
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
            site_ns.clickTopMenu($("#menu-home"));
            $('[rsrc="pages/welcome/welcome.md"]').trigger('click');
        });
        ///
    });

    /// Expose clickContentsLink and processContents
    site_ns['clickContentsLink'] = clickContentsLink;
    site_ns['processContents'] = processContents;
})();