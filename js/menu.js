/**
 * Created by Kim on 5/28/2016.
 *
 */
(function () {
    "use strict";

    var toggleMenuClicked = false, contentMargin = null;

    /// Show/hide site menu
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
        site_ns.updateHistory($(what).attr('rsrc'));
        if ($(what).attr('rsrc').substring(0, 5) === 'call/') {
            $('#rsrc-change').html($(what).attr('rsrc').replace('call/', ''));
            eval('site_ns.' + $(what).attr('rsrc').substring(5));
            return;
        }

        $('#rsrc-change').html($(what).attr('rsrc'));
        $.get($(what).attr('rsrc'), function (data) {
            $('#PageFrame').animate({scrollTop: 0}, 100);
            site_ns.processContents($(what).attr('rsrc'), data);
        });
    };

    /// OnLoad set menu onclick handlers
    $(document).ready(function () {
        ///   - Show/hide site menu
        $('#toggle-menu').click(function () {
            toggleMenuShow();
        });

        ///   - Main menu item clicked - collapse current and expand clicked
        $('#menu-contents').on('click', '#cssmenu > ul > li > a', function () {
            clickTopMenu(this);
        });

        ///   - Sub-menu item clicked
        ///     - change menu presentation to show sub-menu selected
        $('#menu-contents').on('click', '#cssmenu > ul > li > ul > li > a', function () {
            clickSubMenu(this);
        });
    });

    /// Expose handy site menu functions
    ///   - hide/show site menu
    ///   - click top level text
    ///   - click sub level text
    site_ns['toggleMenuShow'] = toggleMenuShow;
    site_ns['clickTopMenu'] = clickTopMenu;
    site_ns['clickSubMenu'] = clickSubMenu;


})();

