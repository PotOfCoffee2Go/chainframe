/**

 Created by PotOfCoffee2Go on 5/28/2016.

 */
(function () {
    "use strict";

    /// Show/hide site menu
    var toggleMenuClicked = false, contentMargin = null;

    /// {{{image img.menujs1 '0 0 0 0' '128px'}}}
    function toggleMenuShow() {
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
    }

    /// - Expand/collapse of site menu
    ///   - 'what' is 'this' of the menu to expand
    /// {{{image img.windman '0 0 0 0' '130px'}}}
    var clickMainMenu = function (what) {
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
        // Put the loader animation in the contents area
        //  (will be overwritten by the content when it arrives)


        $('#cssmenu a').removeClass('subactive');
        $(what).addClass('subactive');
        site_ns.updateHistory($(what).attr('rsrc'));
        if ($(what).attr('rsrc').substring(0, 5) === 'call/') {
            eval('site_ns.' + $(what).attr('rsrc').substring(5));
            return;
        }

        // Loading in-progress animation
        $('#contents').html(site_ns.img.loaderHtml);

        // Un-comment setTimeout to test loader animation
        // setTimeout(function () {
            $('#top-menu').animate({opacity: 0}, 'fast');
            $('#rsrc-change').html($(what).attr('rsrc'));
            $('#PageFrame').animate({scrollTop: 0}, 200);
            site_ns.processContents($(what).attr('rsrc'));

        // }, 5000);
    };

    /// - Top-menu processing
    var clickTopMenu = function (what) {
        // site_ns.updateHistory($(what).attr('rsrc'));
        // if ($(what).attr('rsrc').substring(0, 5) === 'call/') {
        //     eval('site_ns.' + $(what).attr('rsrc').substring(5));
        //     return;
        // }

        var options = {};
        if ($(what).attr('id') === 'tm-raw') {
            options = {raw: true};
        }
        else if ($(what).attr('id') === 'tm-code') {
            options = {hideComment: true};
        }
        else if ($(what).attr('id') === 'tm-comments') {
            options = {hideCode: true};
        }
        $('#rsrc-change').html($(what).attr('rsrc'));
        $('#PageFrame').animate({scrollTop: 0}, 200);
        site_ns.processContents($(what).attr('rsrc'), options);
    };


    /// OnLoad set menu onclick handlers
    $(document).ready(function () {
        ///   - Show/hide site menu
        $('#toggle-menu').click(function () {
            toggleMenuShow();
        });

        ///   - Main menu item clicked - collapse current and expand clicked
        $('#menu-contents').on('click', '#cssmenu > ul > li > a', function () {
            clickMainMenu(this);
        });

        ///   - Sub-menu item clicked
        ///     - change menu presentation to show sub-menu selected
        $('#menu-contents').on('click', '#cssmenu > ul > li > ul > li > a', function () {
            clickSubMenu(this);
        });

        ///   - Top-menu item clicked
        ///     - change menu presentation to show sub-menu selected
        $('#top-menu').on('click', 'a', function () {
            clickTopMenu(this);
        });
    });

    /// Expose handy site menu functions
    ///   - hide/show site menu
    ///   - click top level text
    ///   - click sub level text
    site_ns['toggleMenuShow'] = toggleMenuShow;
    site_ns['clickMainMenu'] = clickMainMenu;
    site_ns['clickSubMenu'] = clickSubMenu;
})();

