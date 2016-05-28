/**
 * Created by PotOfCoffee2Go on 5/15/2016.
 *
 */
(function () {
    "use strict";

    /// ### Parse the input lines. Line is either comment or code
    function parse(rsrcPath, input, callback) {
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

        callback(output);

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

    }

    /// Expose function to parse code into markdown
    site_ns['parseCode'] = parse;
})();
