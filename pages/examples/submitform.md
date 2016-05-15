## Submit a form
This is a working example of submitting a form back to the same page that submitted the form.

{{#id}}
  An **id** field received. - form was submitted with <span style="color:red;">**id:** {{id}} **stuff:** {{stuff}}</span>
{{/id}}
{{^id}}
  No **id** field received. - so form was not submitted - enter something in the **id** field and click `submit`.
{{/id}}

<form action="api/submit/pages/examples/submitform.md" method="post">
  <fieldset>
    <legend><strong>Example of a form</strong></legend>
    <dl>
      <dt><label for="id">id</label></dt>
      <dd><input id="id" name="id" value="{{id}}" type="text" /></dd>
      <dt><label for="stuff">stuff</label></dt>
      <dd><input id="stuff" name="stuff" value="{{stuff}}" type="text" /></dd>
      <input type="submit" value="Submit" />
    </dl>
  </fieldset>
</form>

Although a good example of how the system works, this page is trivial as nothing is done with the
form data submitted (other than Mustache { { } } is used to display the data).

A handler function would have to be written in Nodejs to process the data submitted.

**Note!** the `action` tag of the form begins with `api\submit\...` which is needed to send the form
data to the server. See [Handler Form](api/click/menu-examples/pages/examples/users.md) for an example of
a form that uses a handler.

#### The Markdown of this page:

<pre style='color:#000000;background:#E0EEEE;'>## Submit a form
This is a working example of submitting a form back to the same page that submitted the form<span style='color:#008c00; '>.</span>

&#123&#123#id&#125&#125
  An **id** field received<span style='color:#008c00; '>.</span> - form was submitted with <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>span</span><span style='color:#274796; '> </span><span style='color:#074726; '>style</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"</span><span style='color:#bb7977; font-weight:bold; '>color</span><span style='color:#808030; '>:</span><span style='color:#797997; '>red</span><span style='color:#800080; '>;</span><span style='color:#0000e6; '>"</span><span style='color:#a65700; '>></span>**id:** &#123&#123id&#125&#125 **stuff:** &#123&#123stuff&#125&#125<span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>span</span><span style='color:#a65700; '>></span>
&#123&#123/id&#125&#125
&#123&#123^id&#125&#125
  No **id** field received<span style='color:#008c00; '>.</span> - so form was not submitted - enter something in the **id** field and click `submit`.
&#123&#123/id&#125&#125

<span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>form</span><span style='color:#274796; '> </span><span style='color:#074726; '>action</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"api/submit/pages/examples/submitform.md"</span><span style='color:#274796; '> </span><span style='color:#074726; '>method</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"post"</span><span style='color:#a65700; '>></span>
  <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>fieldset</span><span style='color:#a65700; '>></span>
    <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>legend</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>strong</span><span style='color:#a65700; '>></span>Example of a form<span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>strong</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>legend</span><span style='color:#a65700; '>></span>
    <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>dl</span><span style='color:#a65700; '>></span>
      <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>dt</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>label</span><span style='color:#274796; '> </span><span style='color:#074726; '>for</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"id"</span><span style='color:#a65700; '>></span>id<span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>label</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>dt</span><span style='color:#a65700; '>></span>
      <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>dd</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>input</span><span style='color:#274796; '> </span><span style='color:#074726; '>id</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"id"</span><span style='color:#274796; '> </span><span style='color:#074726; '>name</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"id"</span><span style='color:#274796; '> </span><span style='color:#074726; '>value</span><span style='color:#808030; '>=</span>"&#123&#123id&#125&#125"<span style='color:#274796; '> </span><span style='color:#074726; '>type</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"text"</span><span style='color:#274796; '> </span><span style='color:#a65700; '>/></span><span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>dd</span><span style='color:#a65700; '>></span>
      <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>dt</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>label</span><span style='color:#274796; '> </span><span style='color:#074726; '>for</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"stuff"</span><span style='color:#a65700; '>></span>stuff<span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>label</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>dt</span><span style='color:#a65700; '>></span>
      <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>dd</span><span style='color:#a65700; '>></span><span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>input</span><span style='color:#274796; '> </span><span style='color:#074726; '>id</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"stuff"</span><span style='color:#274796; '> </span><span style='color:#074726; '>name</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"stuff"</span><span style='color:#274796; '> </span><span style='color:#074726; '>value</span><span style='color:#808030; '>=</span>"&#123&#123stuff&#125&#125"<span style='color:#274796; '> </span><span style='color:#074726; '>type</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"text"</span><span style='color:#274796; '> </span><span style='color:#a65700; '>/></span><span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>dd</span><span style='color:#a65700; '>></span>
      <span style='color:#a65700; '>&lt;</span><span style='color:#800000; font-weight:bold; '>input</span><span style='color:#274796; '> </span><span style='color:#074726; '>type</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"submit"</span><span style='color:#274796; '> </span><span style='color:#074726; '>value</span><span style='color:#808030; '>=</span><span style='color:#0000e6; '>"Submit"</span><span style='color:#274796; '> </span><span style='color:#a65700; '>/></span>
    <span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>dl</span><span style='color:#a65700; '>></span>
  <span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>fieldset</span><span style='color:#a65700; '>></span>
<span style='color:#a65700; '>&lt;/</span><span style='color:#800000; font-weight:bold; '>form</span><span style='color:#a65700; '>></span>

Although a good example of how the system works, this page is trivial as nothing is done with the
form data submitted (other than Mustache { { } } is used to display the data).

A handler function would have to be written in Nodejs to process the data submitted<span style='color:#008c00; '>.</span>

**Note!** the `action` tag of the form begins with `api\submit\...` which is needed to send the form
data to the server. See [Handler Form](api/click/menu-examples/pages/examples/users.md) for an example of
a form that uses a handler.

</pre>