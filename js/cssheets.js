(function () {
    "use strict";

    var namespace = {
        getSheets: function getSheets() {
            // Grab the first sheet, regardless of media
            var sheets = document.styleSheets; // returns an Array-like StyleSheetList

            console.log(sheets);

            /*
            Returns:

            StyleSheetList {0: CSSStyleSheet, 1: CSSStyleSheet, 2: CSSStyleSheet, 3: CSSStyleSheet, 4: CSSStyleSheet, 5: CSSStyleSheet, 6: CSSStyleSheet, 7: CSSStyleSheet, 8: CSSStyleSheet, 9: CSSStyleSheet, 10: CSSStyleSheet, 11: CSSStyleSheet, 12: CSSStyleSheet, 13: CSSStyleSheet, 14: CSSStyleSheet, 15: CSSStyleSheet, length: 16, item: function}
            */

            var sheet = document.styleSheets[0];
        }

    };


    $.extend(ahg_ns, namespace);

})();
