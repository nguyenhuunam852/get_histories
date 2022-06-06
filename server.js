const express = require('express');
const app = express();
// const test = require('test');

const port = 8080;

app.get('/', function (req, res) {
    // var data = test.TEST;
    res.send(null);
})

app.listen(port, function () {
    console.log("Your app running on port " + port);
})
