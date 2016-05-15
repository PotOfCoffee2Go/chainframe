```js
var hilightChange = function (hilight) {
    $('#hilight-change').html(hilight.replace('.css', ''));
    $('#hilightsheet').remove();
    $('head').append(
            '<link href="highlight/styles/' + hilight + '" rel="stylesheet" id="hilightsheet" />');
};
```
<div id="wrapper" style="text-align: center">    
    <div id="yourdiv" style="display: inline-block;">

<div class = "center">
<style type="text/css">
    .tg  {border-collapse:collapse;border-spacing:0;}
    .tg td{font-family:Arial, sans-serif;font-size:14px;text-align:center;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
    .tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}
    .tg .tg-yw4l{vertical-align:top}
</style>
<table class="tg">
    <tr>
        <td class="tg-031e"><a href="call/hilightChange('codepen-embed.css');">codepen-embed</a></td>
        <td class="tg-031e"><a href="call/hilightChange('color-brewer.css');">color-brewer</a></td>
        <td class="tg-031e"><a href="call/hilightChange('dark.css');">dark</a></td>
        <td class="tg-031e"><a href="call/hilightChange('darkula.css');">darkula</a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('default.css');">default</a></td>
    </tr>
    <tr>
        <td class="tg-031e"><a href="call/hilightChange('docco.css');">docco</a></td>
        <td class="tg-031e"><a href="call/hilightChange('dracula.css');">dracula</a></td>
        <td class="tg-031e"><a href="call/hilightChange('far.css');">far</a></td>
        <td class="tg-031e"><a href="call/hilightChange('foundation.css');">foundation</a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('github.css');">github</a></td>
    </tr>
    <tr>
        <td class="tg-031e"><a href="call/hilightChange('github-gist.css');">github-gist</a></td>
        <td class="tg-031e"><a href="call/hilightChange('googlecode.css');">googlecode</a></td>
        <td class="tg-031e"><a href="call/hilightChange('grayscale.css');">grayscale</a></td>
        <td class="tg-031e"><a href="call/hilightChange('gruvbox-dark.css');">gruvbox-dark</a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('gruvbox-light.css');">gruvbox-light</a></td>
    </tr>
    <tr>
        <td class="tg-031e"><a href="call/hilightChange('hopscotch.css');">hopscotch</a></td>
        <td class="tg-031e"><a href="call/hilightChange('hybrid.css');">hybrid</a></td>
        <td class="tg-031e"><a href="call/hilightChange('idea.css');">idea</a></td>
        <td class="tg-031e"><a href="call/hilightChange('ir-black.css');">ir-black</a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('kimbie.dark.css');">kimbie.dark</a></td>
    </tr>
    <tr>
        <td class="tg-031e"><a href="call/hilightChange('kimbie.light.css');">kimbie.light</a></td>
        <td class="tg-031e"><a href="call/hilightChange('magula.css');">magula</a></td>
        <td class="tg-031e"><a href="call/hilightChange('mono-blue.css');">mono-blue</a></td>
        <td class="tg-031e"><a href="call/hilightChange('monokai.css');">monokai</a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('monokai-sublime.css');">monokai-sublime</a></td>
    </tr>
    <tr>
        <td class="tg-031e"><a href="call/hilightChange('obsidian.css');">obsidian</a></td>
        <td class="tg-031e"><a href="call/hilightChange('paraiso-dark.css');">paraiso-dark</a></td>
        <td class="tg-031e"><a href="call/hilightChange('paraiso-light.css');">paraiso-light</a></td>
        <td class="tg-031e"><a href="call/hilightChange('pojoaque.css');">pojoaque</a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('pojoaque.jpg');">pojoaque.jpg</a></td>
    </tr>
    <tr>
        <td class="tg-031e"><a href="call/hilightChange('qtcreator_dark.css');">qtcreator_dark</a></td>
        <td class="tg-031e"><a href="call/hilightChange('qtcreator_light.css');">qtcreator_light</a></td>
        <td class="tg-031e"><a href="call/hilightChange('railscasts.css');">railscasts</a></td>
        <td class="tg-031e"><a href="call/hilightChange('rainbow.css');">rainbow</a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('school-book.css');">school-book</a></td>
    </tr>
    <tr>
        <td class="tg-031e"><a href="call/hilightChange('solarized-dark.css');">solarized-dark</a></td>
        <td class="tg-031e"><a href="call/hilightChange('solarized-light.css');">solarized-light</a></td>
        <td class="tg-031e"><a href="call/hilightChange('sunburst.css');">sunburst</a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('tomorrow.css');">tomorrow</a></td>
        <td class="tg-031e"><a href="call/hilightChange('tomorrow-night.css');">tomorrow-night</a></td>
    </tr>
    <tr>
        <td class="tg-031e"><a href="call/hilightChange('tomorrow-night-blue.css');">tomorrow-night-blue</a></td>
        <td class="tg-031e"><a href="call/hilightChange('tomorrow-night-bright.css');">tomorrow-night-bright</a></td>
        <td class="tg-031e"><a href="call/hilightChange('tomorrow-night-eighties.css');">tomorrow-night-eighties</a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('vs.css');">vs</a></td>
        <td class="tg-031e"><a href="call/hilightChange('xcode.css');">xcode</a></td>
    </tr>
    <tr>
        <td class="tg-031e"><a href="call/hilightChange('xt256.css');">xt256</a></td>
        <td class="tg-031e"><a href="call/hilightChange('zenburn.css');">zenburn</a></td>
        <td class="tg-031e"><a href="call/hilightChange('');"></a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('');"></a></td>
        <td class="tg-yw4l"><a href="call/hilightChange('');"></a></td>
    </tr>
</table>

    </div>
</div>
