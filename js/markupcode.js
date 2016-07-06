/**
 * Created by PotOfCoffee2Go on 7/6/2016.
 */

/**
 ## Format code files to markdown then HTML for browser presentation
 Text from a `.js`, `.html`, `.css`, `.json` files is parsed and formatted for presentation
 as a web page. Markdown and most HTML tags are allowed in the comments, Markdown
 should take care of most your needs.

 > Most [block-level tags](//developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements)
 like &lt;div&gt; will have issues (though you might sometimes get away with it).
 whereas - [inline elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements) are fine.
 For example, use &lt;span&gt; instead of &lt;div&gt;.
 */

/// <style> h3 { text-decoration: underline; } </style>

(function () {
    "use strict";

    /// ### Entry point to generate markup of source code
    function genDoc(type, filepath, callback) {
        var options = {};

        /// - Set parser options based on the file extension
        ///   - Javascript
        ///   - HTML
        ///   - Style Sheets
        ///   - JSON
        switch (type) {
            case 'js' :
                options = {
                    ext: 'js',
                    lineCmntTag: '///',
                    codeblockCmntBeg: '/*',
                    blockCmntBeg: '/**',
                    blockCmntEnd: '*/'
                };
                break;
            case 'html' :
                options = {
                    ext: 'html',
                    lineCmntTag: null,
                    codeblockCmntBeg: '<!--',
                    blockCmntBeg: '<!---',
                    blockCmntEnd: '-->'
                };
                break;
            case 'css' :
                options = {
                    ext: 'css',
                    lineCmntTag: null,
                    codeblockCmntBeg: '/*',
                    blockCmntBeg: '/**',
                    blockCmntEnd: '*/'
                };
                break;
            case 'json' :
                options = {
                    ext: 'json',
                    lineCmntTag: null,
                    codeblockCmntBeg: null,
                    blockCmntBeg: null,
                    blockCmntEnd: null
                };
                break;
            default:
                return;
        }

        /// - Get the source code and format into Markdown
        codeToMarkdown(filepath, options, function (output) {
            callback(output);
        });
    }

    /// Expose the function that generates markup of source code
    site_ns['genDoc'] = genDoc;
    /// ----

    /// ### Helper functions
    /// Is the previous line a comment?
    function isPrevComment(flags, i) {
        return flags[i ? i - 1 : 0] !== ' ';
    }

    /// Is line a Single line comment?
    function isSingleComment(opt, input, i) {
        return opt.lineCmntTag && input[i].trim().indexOf(opt.lineCmntTag) === 0;
    }

    /// Is start of a Block comment?
    function isBlockComment(opt, input, i) {
        return opt.blockCmntBeg && input[i].trim().indexOf(opt.blockCmntBeg) === 0;
    }

    /// Is end of a Block comment?
    function isEndBlockComment(opt, input, i) {
        return opt.blockCmntEnd && input[i].indexOf(opt.blockCmntEnd) > -1;
    }

    /// Is a Code Block comment?
    function isCodeBlockComment(opt, input, i) {
        return opt.codeblockCmntBeg && input[i].indexOf(opt.codeblockCmntBeg) === 0;
    }

    /// Is JSDoc style comment?
    function isJSDocComment(input, i) {
        return input[i].substring(0, 3) === ' * ';
    }

    /// ----

    /// ### Determine location and get source code
    function codeToMarkdown(filepath, options, callback) {
        /// - If site not localhost then get source code from GitHub
        ///   - `../` indicates moving down into the project files
        ///     - so the GitHub source is in **master**
        ///     - otherwise is page in **gh-pages**
        var src = window.location.href.replace('#', '');
        if ('localhost' !== window.location.hostname) {
            src = site_ns.source;
            if (filepath.indexOf('../') > -1) {
                src += 'master/';
                filepath = filepath.replace('../', '');
            }
            else {
                src += 'gh-pages/';
            }
        }

        /// - Display the <button>Raw</button> button in the top-menu
        $('#tm-raw').attr('href', src + filepath);
        $('#tm-raw').show();

        /// - Get array of source lines
        ///   - and convert to Markdown
        $.get(src + filepath, function (data) {
            var input = data.toString().split('\n');
            metaComments(options, input, function (output) {
                callback(output.join('\n'));
            })
        }, 'text');
    }

    /// ### Determine what lines are comments and which are code
    function metaComments(opt, input, callback) {
        var flags = [];
        var output = [];

        /// - Initialize flags indicating line is a comment or code
        ///   - Assume will be code
        ///   - Remove possible `CR` character at the end of input
        for (var i = 0, l = input.length; i < l; i++) {
            flags.push(' ');
            input[i] = input[i].replace('\r', '');
        }

        /// - Determine if first line is comment or code
        ///   - Assume first line is code
        ///   - If a Single or start of a Block comment
        ///     - Set first line to a comment
        var jsdocBeg = false;
        var expect = ' ';
        if (isSingleComment(opt, input, 0) || isBlockComment(opt, input, 0)) {
            expect = 'c';
        }

        /// #### Flag each input line as a comment or code
        for (i = 0, l = flags.length; i < l; i++) {
            /// - Blank line?
            ///   - Flag same as prior line
            ///   - **to next line**
            if (input[i].trim() === '') {
                flags[i] = flags[i ? i - 1 : 0];
                continue;
            }
            /// - Single line comment?
            ///   - Flag as comment and expect next line to be code
            ///   - **to next line**
            if (isSingleComment(opt, input, i)) {
                input[i] = input[i].trim().replace(opt.lineCmntTag, '');
                flags[i] = 'c'; // comment
                expect = ' '; // code
                continue;
            }
            /// - Handle JSDoc type comments
            ///   - In a comment block?
            ///     - this line is formatted JSDoc style comment?
            ///       - first line in JSDoc comment block?
            ///         - then set title of the comment to bold
            ///       - set the flags and **to next line**
            ///    - otherwise check for blank JSDoc comment?
            ///       - set the flags and **to next line**
            if (isPrevComment(flags, i)) {
                if (isJSDocComment(input, i)) {
                    if (jsdocBeg && input[i].length > 3 && input[i][3] !== '@') {
                        input[i] = '**' + input[i].substring(3) + '**';
                    }
                    flags[i] = 'c'; // line is a comment
                    expect = 'c';   // expect next line will be a comment too
                    jsdocBeg = false;
                    continue;
                }
                if (input[i] === ' *') {
                    input[i] = '';
                    flags[i] = 'c'; // comment
                    expect = 'c';
                    jsdocBeg = false;
                    continue;
                }
            }

            /// - Reset the flag indicating beginning of JSDoc comment
            jsdocBeg = false;

            /// - Start of a code block comment ex: /* for javascript
            ///   - Is a *code* block comment `/*` but *not* a block comment `/**`?
            ///     - set as code line and expect next line to be code too
            ///     - **to next line**
            if (isCodeBlockComment(opt, input, i) && !isBlockComment(opt, input, i)) {
                flags[i] = ' ';
                expect = ' ';
                continue;
            }
            /// - Start of block comment?
            ///   - Remove the comment chars. ex: `/**` for javascript
            ///   - Flag the line as a comment
            ///   - Is there an end of block comment too? (line like: `/** blah blah */`)
            ///     - remove the end comment chars.
            ///     - expect the next line to be a code line
            ///   - otherwise doesn't have an end block so
            ///     - could be the beginning of a JSDoc comment
            ///     - and a comment is expected on the next line
            ///   - **to next line**
            if (isBlockComment(opt, input, i)) {
                input[i] = input[i].trim().replace(opt.blockCmntBeg, '');
                flags[i] = 'c';
                if (isEndBlockComment(opt, input, i)) {
                    input[i] = input[i]
                            .replace(opt.blockCmntEnd[0] + opt.blockCmntEnd, '')
                            .replace(opt.blockCmntEnd, '');
                    expect = ' ';
                }
                else {
                    jsdocBeg = true;
                    expect = 'c';
                }
                continue;
            }
            /// - End of comment and we are in a comment block
            ///   - Remove the end of comment chars.
            ///   - Set this line as a comment and expect next to be code
            ///   - **to next line**
            if (isEndBlockComment(opt, input, i) && isPrevComment(flags, i)) {
                input[i] = input[i]
                        .replace(opt.blockCmntEnd[0] + opt.blockCmntEnd, '')
                        .replace(opt.blockCmntEnd, '');
                flags[i] = 'c'; // comment
                expect = ' ';
                continue;
            }

            /// - Got here if none of the special conditions above were met
            ///   - Set flag to what this line was expected to be based on the previous line
            ///   - **to next line**
            flags[i] = expect;
        }

        /// ----

        /// #### Output the comment and code lines based on the flags
        /// All of the lines have been flagged as code or comments

        /// Output each line inserting markdown code blocks as we go
        for (i = 0, l = flags.length; i < l; i++) {
            /// - Output the first line
            ///  - Start a code block when appropriate
            if (i === 0) {
                if (flags[i] === ' ') {
                    output.push('```' + opt.ext);
                }
                output.push(input[i]);
                continue;
            }
            /// - When previous flag and current are the same
            ///   - Remain in the comment or code block
            if (flags[i] === flags[i - 1]) {
                output.push(input[i]);
                continue;
            }
            /// - Switching from comment to code block
            ///   - insure blank line before code block
            ///   - start the code block
            if (flags[i] === ' ') {
                output.push('');
                output.push('```' + opt.ext);
                output.push(input[i]);
                continue;
            }
            /// - Switching from code to comment block
            ///   - end the code block
            if (flags[i] === 'c') {
                output.push('```');
                output.push(input[i]);
                continue;
            }

            /// - Should never get here!
            throw new Error('Parsing of meta comments error')
        }

        /// - If in a code block, end it at file end
        if (flags[flags.length - 1] === ' ') {
            output.push('```');
        }

        /// Return with the Markdown markup complete
        callback(output);
    }

    /// *piece of cake*
})();
