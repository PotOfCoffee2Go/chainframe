(function () {
    "use strict";

    // Insure code blocks has the highlight.js class
    function processCodeBlocks() {
        $('pre code').addClass('hljs');
        $('.hljs').css('overflow-x', 'auto');
    }

    /// ----
    /// ### Menu system
    /// ----
    /// - Expand/collapse of **site** menu
    ///   - 'what' is 'this' of the menu to expand
    var clickTopMenu = function (what) {
        var checkElement = $(what).next();
        var $cssmenu_li = $('#cssmenu li');
        if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            $(what).closest('li').removeClass('active');
            checkElement.slideUp('normal', function () {
                $cssmenu_li.removeClass('active');
            });
        }
        if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            $('#cssmenu ul ul:visible').slideUp('normal');
            checkElement.slideDown('normal');
            $cssmenu_li.removeClass('active');
        }
        $cssmenu_li.removeClass('active');
        $(what).closest('li').addClass('active');
    };

    /// - Sub-menu processing
    var clickSubMenu = function (what) {
        $('#cssmenu a').removeClass('subactive');
        $(what).addClass('subactive');
        $('#rsrc-change').html($(what).attr('rsrc'));
        if ($(what).attr('rsrc').substring(0, 5) === 'call/') {
            eval('ahg_ns.' + $(what).attr('rsrc').substring(5));
            return;
        }

        ahg_ns.updateHistory($(what).attr('rsrc'));
        $.get($(what).attr('rsrc'), function (data) {
            $('#PageFrame').animate({scrollTop: 0}, 200);
            if (/\.md$/.test($(what).attr('rsrc'))) {
                $('#contents').html(marked(data));
            }
            else {
                $('#contents').html(data);
            }
            processCodeBlocks();
        });
    };

    var clickContentsLink = function (what, scrollPos) {
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
        ref.shift();
        ref.shift();

        var href = ref.join('/');

        $('#rsrc-change').html(href);

        /// - if a `call` - then just call the function
        ///   that must be in the ahg namespace
        /// - see [namespace.js](js/namespace.js)
        if (href.substring(0, 5) === 'call/') {
            eval('ahg_ns.' + href.substring(5));
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
        ahg_ns.updateHistory(href);
        $.get('/' + link, function (data) {
            if (/\.md$/.test(link)) {
                $('#contents').html(marked(data));
            }
            else {
                $('#contents').html(data);
            }
            processCodeBlocks();
            if (scrollPos) {
                $('#PageFrame').animate({scrollTop: scrollPos}, 200);
            }

            // switch the active submenu item to the one that represents
            //  the page we just put into #contents
            $('#cssmenu a').removeClass('subactive');
            rsrc.addClass('subactive');

            // switch the main menu item if that has changed
            if ($(menuid).parent().hasClass('active') === false) {
                clickTopMenu(menuid);
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
/// ### JQuery Onload
/// ----
    $(document).ready(function () {

        var toggleMenuClicked = false, contentMargin = null;

        /// Show/hide site menu
        $('#toggle-menu').click(function () {
            if (toggleMenuClicked == true) {
                $('#contents').animate({'margin-left': contentMargin}, 'fast');
                $('#menu-contents').slideDown("fast", function () {
                    $('#toggle-menu').attr('src', 'menu/images/menu_up.png');
                    toggleMenuClicked = false;
                });
            }
            else {
                contentMargin = $('#contents').css('margin-left');
                $('#contents').animate({'margin-left': '12px'}, 'fast');
                $('#menu-contents').slideUp("fast", function () {
                    $('#toggle-menu').attr('src', 'menu/images/menu_down.png');
                    toggleMenuClicked = true;
                });
            }
        });


        /// Main menu item clicked - collapse current and expand clicked
        $('#menu-contents').on('click', '#cssmenu > ul > li > a', function () {
            clickTopMenu(this);
        });

        /// Sub-menu item clicked
        /// - change menu presentation to show sub-menu selected
        $('#menu-contents').on('click', '#cssmenu > ul > li > ul > li > a', function () {
            clickSubMenu(this);
        });

        /// - Link was clicked on a page that is in the #contents div
        $('#contents').on('click', 'a', function (event) {
            event.preventDefault();
            clickContentsLink(this);
        });

        /// Form submitted on content page
        //  post request to menu option
        $(document).on('submit', function (event) {
            event.preventDefault();
            // Get all the forms elements and their values in one step
            var form = $(event.target);
            var formValues = form.serialize();

            var ref = form.context.action.split('/');
            if (!(ref[3] === 'api' && ref[4] === 'submit')) {
                return true;
            }
            for (var i = 0; i < 5; i++) {
                ref.shift();
            }
            $.post('/' + ref.join('/'), formValues, function (data) {
                $('#contents').html(data);
                processCodeBlocks();
            });
            return false;
        });

        /// Get menu html and bring up default content on load
        $.get('menu/menu.html', function (data) {
            var adjdata = data.replace(/href/g, 'rsrc');
            $('#menu-contents').html(adjdata);
            $('#menu-contents a').attr('href', 'javascript:;');
            $.get('pages/welcome/welcome.md', function (data) {
                $('#contents').html(data);
                $('#contents > pre > code').addClass('hljs');
                clickTopMenu($("#menu-home"));
                $('[rsrc="pages/welcome/welcome.md"]').trigger('click');
            });
        });
        ///
    });

    marked.setOptions({
        highlight: function (code, lang) {
            return hljs.highlightAuto(code).value;
        }
    });

    /// Expose clickContentsLink and processCodeBlocks
    ahg_ns['clickContentsLink'] = clickContentsLink;
    ahg_ns['processCodeBlocks'] = processCodeBlocks;
})();