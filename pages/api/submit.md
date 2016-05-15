## Submit API

`api/submit/{handler resource name}` is implemented on the browser side to handle
posting of form data to the server. The handler (that you create) processes 
the data submitted and displays the output.

The `api/submit/{handler resource name}` would be the 'action' tag of the form.

Data from the form will be in the nodejs built-in `http` request object. The Form data
is converted from form-encoded to JSON and passed in the `recvData` object that has 
been added to the nodejs incoming request (ie: `req.recvData`).


