/**
 * Created by PotOfCoffee2Go on 5/15/2016.
 *
 */
(function () {
    "use strict";

    /// ### Parse the input lines. Line is either comment or code
    function parse(rsrcPath, input, callback) {
        var toc = [];
        var output = [];
        var state = 'comment';  // State of parser 'comment' or 'code'

        // For each line[i]. determine if comment or code
        for (var i = 0, l = input.length; i < l; i++) {

            // blank line
            if (input[i].trim() === '') {
                output.push(input[i].trim());
            }
            // meta comment
            else if (input[i].trim().substring(0, 3) === '///') {
                testState('comment');
                output.push(input[i].trim().substring(4)); // remove '/// '
                buildTocLine(input[i].trim().substring(4));
            }
            // code
            else {
                testState('code');
                output.push(input[i]);
            }
        }
        // When done insure we close off a code block
        // by setting state to a comment
        testState('comment');

/*
        finalizeToc(toc);
        var rawlink = '<div style="padding: 10px 0 0 0;">' +
                '<a href="' + rsrcPath.replace('/gendoc/', 'rawdoc/') + '">' +
                '<button type="button">Raw</button></a></div>';
        toc.unshift('<div style="font-size: 2em;' +
                'padding: 10px 20px 0 0">' +
                rsrcPath.replace('/gendoc/', '') +
                '</div>' + rawlink);
*/

        callback(toc, output);

        function finalizeToc(toc) {
            // Trim spaces from the toc
            var tocDone = false;
            while (!tocDone) {
                for (i = 0; i < toc.length; i++) {
                    if (toc[i][0] !== ' ') {
                        tocDone = true;
                        break;
                    }
                }
                if (!tocDone) {
                    for (i = 0; i < toc.length; i++) {
                        toc[i] = toc[i].substring(1);
                    }
                }
            }

            for (i = 0; i < toc.length; i++) {
                toc[i] = toc[i].replace('{{rsrcPath}}',rsrcPath);
            }

        }

        /// Test line[i]. state transistion
        /// - state unchanged,
        /// - to comment
        /// - or to code
        function testState(newState) {
            if (state === newState) return; // No change
            if (state === 'comment' && newState === 'code') {
                output.push(''); // insure blank line before code block
                output.push('```js');
            }
            if (state === 'code' && newState === 'comment') {
                output.push('```');
            }
            state = newState;
        }

        function buildTocLine(input) {
            var tocEntry = '';
            if (input.search(/^#+/) > -1) {
                for (var i = 0; input[i] === '#'; i++) {
                    tocEntry += '  ';
                }
                tocEntry += ('- [' +
                input.substring(i) +
                ']({{rsrcPath}}#' +
                input.substring(i+1).toLowerCase().replace(/\,/g,'').replace(/[ \.]/g,'-').replace(/\-\-/g,'-') +
                ')');
                toc.push(tocEntry);
            }
        }

    }

    /// Expose function to parse code into markdown
    ahg_ns['parseCode'] = parse;
})();
