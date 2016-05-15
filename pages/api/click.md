## Click API

Almost all of the links that you put into Markdown or HTML pages will be of the form:
 
`api/click/{menu-id}/{sub-menu rsrc}` or `api/click/handler/{handler resource name}`.

The Click API is implemented on the browser side, which handles the menu presentation and
sends an ajax request to the server to retrieve the data.

```
+---------------------------------------+
| pageheader                            |
+---------------------------------------+
+---------------+  +--------------------+
| menu-contents |  | content            |
|               |  |                    |
+---------------+  +--------------------+
```

When using `api/click/{menu-id}/{sub-menu rsrc}`, the system will open the
menu/sub-menu selected and display that menu's content into the 'content' area.
> The menu's use a custom tag `rsrc` instead of `href` (due to issues encountered
brower-side).

When using the handler version `api/click/handler/{handler resource name}`, the 
server-side handler will be called via ajax. Any output of the handler will be
displayed in the 'content' area.

> The word 'handler' is reserved thus a `menu-id` of 'handler' would not work as
expected.

