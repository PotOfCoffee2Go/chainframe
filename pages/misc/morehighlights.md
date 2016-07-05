
<style>
pre {
    margin-right:0;
    float: left;
}

</style>



### Extra Highlights

|        |        |        |        |        |        |
| :----: | :----: | :----: | :----: | :----: | :----: |
|<a href="call/hilightChange('highlight/styles/arduino-light.css');">arduino-light</a>|<a href="call/hilightChange('highlight/styles/arta.css');">arta</a>|<a href="call/hilightChange('highlight/styles/ascetic.css');">ascetic</a>|<a href="call/hilightChange('highlight/styles/atelier-cave-dark.css');">atelier-cave-dark</a>|<a href="call/hilightChange('highlight/styles/atelier-cave-light.css');">atelier-cave-light</a>|<a href="call/hilightChange('highlight/styles/atelier-dune-dark.css');">atelier-dune-dark</a>|
|<a href="call/hilightChange('highlight/styles/atelier-dune-light.css');">atelier-dune-light</a>|<a href="call/hilightChange('highlight/styles/atelier-estuary-dark.css');">atelier-estuary-dark</a>|<a href="call/hilightChange('highlight/styles/atelier-estuary-light.css');">atelier-estuary-light</a>|<a href="call/hilightChange('highlight/styles/atelier-forest-dark.css');">atelier-forest-dark</a>|<a href="call/hilightChange('highlight/styles/atelier-forest-light.css');">atelier-forest-light</a>|<a href="call/hilightChange('highlight/styles/atelier-heath-dark.css');">atelier-heath-dark</a>|
|<a href="call/hilightChange('highlight/styles/atelier-heath-light.css');">atelier-heath-light</a>|<a href="call/hilightChange('highlight/styles/atelier-lakeside-dark.css');">atelier-lakeside-dark</a>|<a href="call/hilightChange('highlight/styles/atelier-lakeside-light.css');">atelier-lakeside-light</a>|<a href="call/hilightChange('highlight/styles/atelier-plateau-dark.css');">atelier-plateau-dark</a>|<a href="call/hilightChange('highlight/styles/atelier-plateau-light.css');">atelier-plateau-light</a>|<a href="call/hilightChange('highlight/styles/atelier-savanna-dark.css');">atelier-savanna-dark</a>|
|<a href="call/hilightChange('highlight/styles/atelier-savanna-light.css');">atelier-savanna-light</a>|<a href="call/hilightChange('highlight/styles/atelier-seaside-dark.css');">atelier-seaside-dark</a>|<a href="call/hilightChange('highlight/styles/atelier-seaside-light.css');">atelier-seaside-light</a>|<a href="call/hilightChange('highlight/styles/atelier-sulphurpool-dark.css');">atelier-sulphurpool-dark</a>|<a href="call/hilightChange('highlight/styles/atelier-sulphurpool-light.css');">atelier-sulphurpool-light</a>||

<span style="float: left;">

```js
// ----
// Show Raw text in contents area
// ----
(function () {
    "use strict";

    function showRawText(link) {
        $.get(link, function (data) {
            // Array of source lines
            var input = '<pre><code>' 
                + data.toString()
                + '</code></pre>';
            $('#contents').html(input);
        }, 'text');
        return false;
    }

    // Expose function to get text of source
    site_ns['showRawText'] = showRawText;
})();
```

</span>

```html
<!doctype html>
<!--- ## This Site --->
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">

    <title>Chainframe by PotOfCoffee2Go</title>
</head>

<body>
</body>
</html>
```

```css
#AbsoluteFooter img {
    width: 24px;
    height: auto;
    vertical-align: middle;
}

/** ### Header content **/
#headerleft {
    position: absolute;
    top: 10px;
    left: 0;
    font-size: 14px;
}

#headerleft > #socketio-change {
    float: left;
    padding-left: 8px;
}
```


