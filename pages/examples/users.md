## Example User form

This form calls the 'action' `submit/example/getsampleusers` to
submit and process the form. The **submit/** is to post the form data
while the **example/getsampleusers** is the handler resource name.
 
See the [Server Submit API](pages/api/submit.md) for
details on form submitting and handlers.

### Try it
Enter **1** to **10** (or leave blank for all 10 users) in uid field
and press `submit`. 

<form action="api/submit/example/getsampleusers" method="post">
  <fieldset>
    <legend><strong>Enter User Id:</strong></legend>
    <dl>
      <dt><label for="uid">uid</label>
      <input id="uid" name="uid" value="{{uid}}" type="text" />
      <input type="submit" value="Submit" /></dd>
    </dl>
  </fieldset>
</form>

{{#displayusers}}

#### Selected fields from response into a table :
<table class="example">
  <caption>Users</caption>
  <thead>
    <tr>
      <th>Id</th><th>Name</th><th>Email</th>
      <th>Website</th><th>City</th>
    </tr>
  </thead>
  <tbody>
  {{#users}}
    <tr>
      <td>{{id}}</td><td>{{name}}</td><td>{{email}}</td>
      <td>{{website}}</td><td>{{address.city}}</td>
    </tr>
  {{/users}}
  </tbody>
</table>

#### Response in JSON :
```json
{{&jsonstr}}
```

{{/displayusers}}

#### The form handler is :
```js
function getSampleUsers(req, res, sendContent) {
    // Check request 'recvData' to see if we got a user id
    var getUid = '';
    if (typeof req.recvData.uid !== 'undefined') {
        getUid = '/' + req.recvData.uid;
    }
    // Get the user data (kudos jsonplaceholder for providing a test api!)
    request('http://jsonplaceholder.typicode.com/users' + getUid, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Place the data into the request 'recvData'
            req.recvData.displayusers = true;
            req.recvData.users = JSON.parse(body);
            req.recvData.jsonstr = JSON.stringify(JSON.parse(body), null, 4);
            // Get the page that will display the data
            server.readFile('pages/examples/users.md', function (rderr, rddata) {
                server.renderAndSend(req, res,"lookup.md",rddata);
            })
        }
    })
}

```


