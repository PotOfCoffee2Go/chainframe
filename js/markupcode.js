/**
 {{{img.poc2g}}} Created by PotOfCoffee2Go on 7/6/2016.
 */
/** {{{img.markupcode1}}}
 ## Format code files to markdown
 Text from a `.js`, `.html`, `.css`, `.json` files is parsed and formatted for presentation
 as a web page. Markdown and most HTML tags are allowed in the comments, Markdown
 should take care of most your needs.

 > Excuse the over documentation of this code. It should be re-written using regex expressions
 so commented heavily to assist in that rewrite - time permitting.
 */

/**
 <style>
 h3 { text-decoration: underline; }
 </style>
 */

(function () {
    "use strict";

    /// ### Get source code and markup into [Markdown](//daringfireball.net/projects/markdown/)
    /// {{{img.paperclip}}}
    function markupSource(codeUrl, options, callback) {
        $.ajax({url: codeUrl, dataType: 'text'})
            .done(function (input) {
                codeToMarkdown(options, input.split('\n'), function (output, opt) {
                    callback(output, opt);
                })
            })
            .fail(function () {
                alert("error");
            });
    }

    /// ### Get parser options based on the file extension
    /// Javascript, HTML, Style Sheets, JSON
    /// {{{img.paperclip}}}
    function parserOptions(type, opt) {
        opt = opt || {};
        opt.raw = opt.raw || false;
        opt.hideCode = opt.hideCode || false;
        opt.hideComment = opt.hideComment || false;

        switch (type) {
            case 'js' :
                opt.ext = 'js';
                opt.lineCmntTag = '///';
                opt.codeblockCmntBeg = '/*';
                opt.blockCmntBeg = '/**';
                opt.blockCmntEnd = '*/';
                break;
            case 'html' :
                opt.ext = 'html';
                opt.lineCmntTag = null;
                opt.codeblockCmntBeg = '<!--';
                opt.blockCmntBeg = '<!---';
                opt.blockCmntEnd = '-->';
                break;
            case 'css' :
                opt.ext = 'css';
                opt.lineCmntTag = null;
                opt.codeblockCmntBeg = '/*';
                opt.blockCmntBeg = '/**';
                opt.blockCmntEnd = '*/';
                break;
            case 'json' :
                opt.ext = 'json';
                opt.lineCmntTag = null;
                opt.codeblockCmntBeg = null;
                opt.blockCmntBeg = null;
                opt.blockCmntEnd = null;
                break;
            default:
                break;
        }
        return opt;
    }

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
        return opt.codeblockCmntBeg && input[i].indexOf(opt.codeblockCmntBeg) > -1;
    }

    /// Is JSDoc comment block?
    function isPrevJSDocBlockComment(flags, i) {
        return flags[i ? i - 1 : 0] === 'j';
    }

    /// Is JSDoc style comment?
    function isJSDocComment(input, i) {
        return input[i].substring(0, 3) === ' * ';
    }

    /// ### Determine what lines are comments and which are code
    function codeToMarkdown(opt, input, callback) {
        var expect = ' ';
        var blockWhitespace = 0;

        var flags = [];
        var output = [];

        /// - Initialize flags indicating line is a comment or code
        ///   - Assume will be code
        ///   - Remove possible `CR` character at the end of input
        for (var i = 0, l = input.length; i < l; i++) {
            flags.push(' ');
            input[i] = input[i].replace('\r', '');
        }

        if (!opt.raw) {
            /// - Determine if first line is comment or code
            ///   - Assume first line is code
            ///   - If a Single or start of a Block comment
            ///     - Set first line to a comment
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
                        flags[i] = 'c'; // line is a comment
                        expect = 'c';   // expect next line will be a comment too
                        continue;
                    }
                    if (input[i] === ' *') {
                        input[i] = '';
                        flags[i] = 'c'; // comment
                        expect = 'c';
                        continue;
                    }
                }

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
                ///   - Keep track of leading whitespace to shift text to the left
                ///     > need to do this because Markdown parser would make the text a code block
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
                    blockWhitespace = input[i].search(/\S|$/);
                    input[i] = input[i].trim().replace(opt.blockCmntBeg, '');
                    flags[i] = 'c';
                    if (isEndBlockComment(opt, input, i)) {
                        input[i] = input[i]
                            .replace(opt.blockCmntEnd[0] + opt.blockCmntEnd, '')
                            .replace(opt.blockCmntEnd, '');
                        expect = ' ';
                    }
                    else {
                        flags[i] = 'j';
                        expect = 'c';
                    }
                    continue;
                }
                /// - End of comment and we are in a comment block
                ///   - Remove the end of comment chars.
                ///   - Stop removing leading spaces
                ///   - Set this line as a comment and expect next to be code
                ///   - **to next line**
                if (isEndBlockComment(opt, input, i) && isPrevComment(flags, i)) {
                    input[i] = input[i]
                        .replace(opt.blockCmntEnd[0] + opt.blockCmntEnd, '')
                        .replace(opt.blockCmntEnd, '');
                    blockWhitespace = 0;
                    flags[i] = 'c'; // comment
                    expect = ' ';
                    continue;
                }

                /// - Got here if none of the special conditions above were met
                ///   - Set flag to what this line was expected to be based on the previous line
                ///   - Remove leading chars so Markdown parser doesn't make them a code block
                ///   - **to next line**
                flags[i] = expect;
                if (flags[i] !== ' ' && isPrevComment(flags, i) && input[i].search(/\S|$/) >= blockWhitespace) {
                    input[i] = input[i].substring(blockWhitespace);
                }
            }

            /// ----
            /// Hide Comments
            ///<div>
            ///   <a href="//en.wikipedia.org/wiki/Pixabay">
            ///   <img src="images/art/beaker.svg" class="pics-right" style="width: 180px;"/></a>
            /// </div>
            i = flags.length;
            if (opt.hideComment) {
                while (i--) {
                    if (flags[i] !== ' ') {
                        flags.splice(i, 1);
                        input.splice(i, 1);
                    }
                }
            }

            /// Hide Code
            if (opt.hideCode) {
                while (i--) {
                    if (flags[i] === ' ' && input[i].length) {
                        flags.splice(i, 1);
                        input.splice(i, 1);
                    }
                }
            }
            /// ----
        }
        /// #### Output the comment and code lines based on the flags
        /// All of the lines have been flagged as code or comments

        /// Output each line inserting markdown code blocks as we go
        for (i = 0, l = flags.length; i < l; i++) {
            /// - Set JSDoc comment to a regular block comment
            ///   > to make the following code easier - at this point a comment is a comment
            if (flags[i] === 'j') {
                flags[i] = 'c';
            }

/*
            /// Comments that contains a Handlebars variable
            if (['js','css'].indexOf(opt.ext) > -1) {
                // Block type comment /!* ... *!/ (that is all on one line)
                if (/(.*?)\/\* ?(.*{{.*}}.*?) ?\*\/ *(.*)/.test(input[i])) {
                    input[i] = input[i].replace(/(.*?)\/\* ?(.*{{.*}}.*?) ?\*\/ *(.*)/, '$1$2$3');
                }

                // Single line type comment '//'
                if (opt.ext === 'js' && /(.*?)\/\/ ?(.*{{.*}}.*?) *(.*)/.test(input[i])) {
                    input[i] = input[i].replace(/(.*?)\/\* ?(.*{{.*}}.*?) ?\*\/ *(.*)/, '$1$2$3');
                }
            }
*/

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

            /// - *Should never get here!*
            throw new Error('Markdown parsing of comments error')
        }

        /// - If in a code block, end it at file end
        if (flags[flags.length - 1] === ' ') {
            output.push('```');
        }

        /// Return with the Markdown markup complete
        callback(output.join('\n'), opt);
    }

    /// Expose the functions that markup source code
    site_ns['markupSource'] = markupSource;
    site_ns['parserOptions'] = parserOptions;
})();
