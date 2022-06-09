const { response } = require('express');
const express = require('express');
const app = express();
var querystring = require('querystring');
fs = require('fs');
parse = require('node-html-parser').parse;
wrapper = require('axios-cookiejar-support').wrapper
CookieJar = require('tough-cookie').CookieJar;
const axios = require('axios').default;

// const test = require('test');

const port = 8080;
let crawler = null;

class Crawler {
    constructor() {
        this.BASE_URL = 'https://ib.techcombank.com.vn/servlet/BrowserServlet';
        var jar = new CookieJar();
        this.client = wrapper(axios.create({ jar }));
        this.current_page = null;
        this.save_parent_id = null;
    }

    async Login(username, password, trytime = 0) {
        trytime += 1;
        if (trytime == 3) return 0;
        var getPage = await this.client.get(this.BASE_URL);

        const root = parse(getPage.data);
        const form = root.querySelector("form[name='login']");
        if (form) {
            const inputs = form.querySelectorAll("[type='hidden']")
            var postData = {}
            if (inputs.length > 0) {
                for (var item of inputs) {
                    postData[item.getAttribute('name')] = item.getAttribute('value') ?? '';
                }
            }
            postData["signOnName"] = username;
            postData["password"] = password;
            return await this.client.post(this.BASE_URL, querystring.stringify(postData), {
                headers: {
                    "Origin": "https://ib.techcombank.com.vn",
                    "Host": "ib.techcombank.com.vn",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
                }
            }).then((response) => {

                const root = parse(response.data);
                const form = root.querySelector("form[name='login']");
                if (!form) {
                    this.current_page = response.data;
                    return 1;
                }
                else {
                    return this.Login(username, password, trytime);
                }
            })
        }
    }

    async readSpecifyForm(parser, form, command) {
        var form = parser.querySelector(`form[id^='${form}']`);
        if (form) {
            const inputs = form.querySelectorAll("[type='hidden']")
            var postData = {}
            if (inputs.length > 0) {
                for (var item of inputs) {
                    postData[item.getAttribute('name')] = item.getAttribute('value') ?? '';
                }
                if (command == 'OFS.ENQUIRY') {
                    postData['requestType'] = 'OFS.ENQUIRY';
                    postData['routineArgs'] = '1_1_1';
                    postData['windowName'] = postData['WS_parentComposite'];
                    postData['enqname'] = 'AI.ACCT.BAL.QUICKWIN.TCB';
                    postData['enqaction'] = 'DRILL';
                    postData['EnqParentWindow'] = this.save_parent_id;
                    postData['drillaction'] = 'APP';
                    postData['WS_FragmentName'] = postData['WS_parentComposite'];
                }
                if (command == 'COS AI.QCK.SUM') {
                    postData['requestType'] = 'UTILITY.ROUTINE';
                    postData['routineName'] = 'OS.GET.COMPOSITE.SCREEN.XML';
                    postData['routineArgs'] = 'COS AI.QCK.SUM';
                    postData['windowName'] = postData['WS_parentComposite'];
                    postData['WS_initState'] = 'COS AI.QCK.SUM';
                    postData['WS_FragmentName'] = postData['WS_parentComposite'];
                }
                return postData;
            }
        }
    }

    async postCrawl(data, form, command) {
        const root = parse(data);
        var postData = await this.readSpecifyForm(root, form, command);
        var response = await this.client.post(this.BASE_URL, querystring.stringify(postData), {
            headers: {
                "Origin": "https://ib.techcombank.com.vn",
                "Host": "ib.techcombank.com.vn",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
            }
        })
        this.current_page = response.data;
    }


    async getByElement(data, id_ele) {
        const root = parse(data);
        var get_element = root.querySelectorAll('.fragmentContainer').filter(item => item.rawAttrs.includes(id_ele))[0];
        this.save_parent_id = get_element._attrs.id;
        var get_element_url = this.BASE_URL.replace('BrowserServlet', get_element._attrs.fragmenturl);
        var response = await this.client.get(get_element_url, {}, {
            headers: {
                "Origin": "https://ib.techcombank.com.vn",
                "Host": "ib.techcombank.com.vn",
                "Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
            }
        })
        this.current_page = response.data;
    }


    async transferMoney(data, id_ele) {
    }

}



app.get('/crawlers', async (req, res) => {
    i = 0;
    while (true) {
        try {
            if (crawler) {
                console.log("Crawler on generalForm")
                await crawler.postCrawl(crawler.current_page, "generalForm", 'COS AI.QCK.SUM');
                console.log("Crawler on AcctBalance")
                await crawler.getByElement(crawler.current_page, "AcctBalance");
                console.log("Crawler on generalForm_AcctBalance")
                await crawler.postCrawl(crawler.current_page, "generalForm_AcctBalance", 'OFS.ENQUIRY');
                await res.send(crawler.current_page);
                return;
            }
            if (!crawler) {
                crawler = new Crawler();
                if (!await crawler.Login("0988851934", "Ha@2002")) {
                    throw 'Error'
                }
            }

            console.log("Crawler on FUNCTION")
            await crawler.getByElement(crawler.current_page, "FUNCTION");
            console.log("Crawler on MainBody")
            await crawler.getByElement(crawler.current_page, "MainBody");
            console.log("Crawler on AcctBalance")
            await crawler.getByElement(crawler.current_page, "AcctBalance");
            console.log("Crawler on generalForm_AcctBalance")
            await crawler.postCrawl(crawler.current_page, "generalForm_AcctBalance", 'OFS.ENQUIRY');
            res.send(crawler.current_page);
            break;
        }
        catch (e) {
            console.log(e);
            crawler = null;
            if (i == 1) {
                res.send('Errors!')
                break;
            }
        }
        i += 1;
    }
})

app.listen(port, function () {
    console.log("Your app running on port " + port);
})
