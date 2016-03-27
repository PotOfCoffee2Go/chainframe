/**
 * Created by PotOfCoffee2Go on 1/18/2016.
 *
 * kudos to jsonplaceholder for making available a REST API for testing
 *   http://jsonplaceholder.typicode.com/
 *
 * Quick and dirty task:
 *   My boss wants me to get the To Do List from jsonplaceholder site and output to a csv file.
 *
 * ChainFrame allows me to do it without ending up in Callback Hell/Pyramid of Doom;
 *  using npm modules like 'step' or 'async'; nor using events, promises... etc.
 *
 */
"use strict";

var util = require('util');
var http = require('http');
var fs = require('fs');

var ChainFrame = require('../../ChainFrame');

// A canned function of mine - use it a lot
function log(data) {
    console.log(util.inspect(data));
    return (data);
}

// Request 'to do list' from jsonplaceholder
function httpRequestForTodoList(callback) {
    var options = {
        host: 'jsonplaceholder.typicode.com',
        path: '/todos'
    };

    http.request(options, callback).end();
}

// Gather up the data from a nodejs 'http' request
//  note: nodejs 'http' uses events - but nothing to do with ChainFrame
function gatherHttpResponse(response, callback) {
    var str = '';

    // chunks of data being received, so append it to str
    response.on('data', function (chunk) {
        str += chunk;
    });

    // the whole response has been received, so pass to the callback
    response.on('end', function () {
        callback(str);
    });
}

// Convert a string representation of JSON data to a JavaScript object
function convertResponseToObject(strData) {
    return JSON.parse(strData);
}

// Transform 'to do list' JSON data into a CSV format
function transformTodoListToCsv(todoList) {
    var csv = '"userId","id","title","completed"\n';
    todoList.forEach(function (todo) {
        csv +=
                todo.userId.toString() + ',' +
                todo.id.toString() + ',' +
                '"' + todo.title + '",' +
                '"' + (todo.completed ? 'Yes' : 'No') + '"' +
                '\n';
    });
    return csv;
}

// Write data to a file
function saveToFile(data, callback) {
    fs.writeFile('todo.csv', data, callback);
}

// Check for error
function checkForErrors(err) {
    if (err) throw err;
}

function allDone() {
    console.log("todo.csv saved in 'data-from-api' directory. Open it and check it out!");
}

// We're gonna chain together the above functions (asynchronous ones and all) - hehehe ;)
var todoList = new ChainFrame();

// Add above functions to the 'todoList' ChainFrame instance
//  Could have used the shortcut 'todoList.addToInstanceAll();' instead
//   but thought adding functions one at a time more informative
todoList
        .addToInstance(httpRequestForTodoList)
        .addToInstance(gatherHttpResponse)
        .addToInstance(convertResponseToObject)
        .addToInstance(transformTodoListToCsv)
        .addToInstance(saveToFile)
        .addToInstance(checkForErrors)
        .addToInstance(allDone)
        .addToInstance(log)

        // Build the method chain which produces the CSV file of the to-do list
        .httpRequestForTodoList()
        .gatherHttpResponse()
        .convertResponseToObject()
        .transformTodoListToCsv()
        //.log()
        .saveToFile()
        .checkForErrors()
        .allDone()

        // Run the chain
        .runChain();

// Did you notice that 'return this;' required for method chaining was not used once!
// Such is the magic of ChainFrame!!!
