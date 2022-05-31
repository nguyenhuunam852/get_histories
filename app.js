const express = require('express');
const app = express();
const exec = require('child_process');
const utf8 = require('utf8');

const hostname = '127.0.0.1';
const port = 8080;

const getHistories = (username, password) => {
    try {
        let execute = exec.execSync;
        let pythonenv = "python";
        let apppath = "get_histories.py";
        let url = "https://ib.techcombank.com.vn/servlet/BrowserServlet";
        let get_username = username;
        let get_password = password;

        console.log(`${pythonenv} ${apppath} ${url} ${get_username} ${get_password}`)

        let cmdresult = execute(`${pythonenv} ${apppath} ${url} ${get_username} ${get_password}`);
        console.log(cmdresult.toString())

        // let object = JSON.parse(cmdresult.toString("utf8").split('\n')[0]);
        // console.log(object)

        // if (object != null)
        //     return object.name;
        return cmdresult.toString();
    }
    catch (e) {
        console.log(e)
        return null;
    }
}

app.get('/', function (req, res) {
    req.setTimeout(1000 * 60 * 10)
    let get_list = getHistories("0988851934", "Ha@2002");
    console.log(get_list)
    res.send(get_list);
})

app.listen(port, function () {
    console.log("Your app running on port " + port);
})


