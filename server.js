const { response } = require('express');
const express = require('express');
const app = express();
var querystring = require('querystring');
fs = require('fs');
parse = require('node-html-parser').parse;
wrapper = require('axios-cookiejar-support').wrapper
CookieJar = require('tough-cookie').CookieJar;
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');



// const test = require('test');

const port = 8080;
let crawlerData = null;
let transferData = null;

class Crawler {
    constructor() {
        this.BASE_URL = 'https://ib.techcombank.com.vn/servlet/BrowserServlet';
        var jar = new CookieJar();
        this.client = wrapper(axios.create({ jar }));
        this.current_page = null;
        this.save_parent_id = null;
        this.token = uuidv4();
        this.current_ts = null;
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

    async ToNewJSON(list, listExclude) {
        var result = {};
        for (var x in list) {
            if (!listExclude.includes(x)) {
                result[x] = list[x];
            }
        }
        return result;
    };

    async readSpecifyForm(parser, form, command, param) {
        var form = parser.querySelector(`form[id^='${form}']`);
        // console.log(form)
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
                if (command == "COS AI.QCK.FT") {
                    postData['requestType'] = 'UTILITY.ROUTINE';
                    postData['routineName'] = 'OS.GET.COMPOSITE.SCREEN.XML';
                    postData['routineArgs'] = 'COS AI.QCK.FT';
                    postData['windowName'] = postData['WS_parentComposite'];
                    postData['WS_initState'] = 'COS AI.QCK.FT';
                    postData['WS_FragmentName'] = postData['WS_parentComposite'];
                }
                if (command == "OS.NEW.DEAL") {
                    postData['requestType'] = 'UTILITY.ROUTINE';
                    postData['routineName'] = 'OS.NEW.DEAL';
                    postData['routineArgs'] = 'FT,AI.QCK.CITAD.TCB I F3';
                    postData['application'] = 'FT';
                    postData['ofsFunction'] = 'I';
                    postData['version'] = ',AI.QCK.CITAD.TCB';
                    postData['transactionId'] = 'F3';
                    postData['windowName'] = postData['compTargets'].replace('ALL_', '').replace('|', '');
                    postData['unlock'] = 'NO.UNLOCK';
                    postData['WS_initState'] = 'FT,AI.QCK.CITAD.TCB I F3';
                    postData['WS_FragmentName'] = postData['compTargets'].replace('ALL_', '').replace('|', '');

                }
                if (command == "OFS.APPLICATION") {
                    postData['requestType'] = 'OFS.APPLICATION';
                    postData['ofsOperation'] = 'PROCESS';
                    postData['ofsFunction'] = 'I';
                    postData['routineName'] = '';
                    postData['routineArgs'] = '';
                    postData['windowName'] = postData['compTargets'].replace('ALL_', '').replace('|', '');
                    postData['unlock'] = '';
                    postData['application'] = 'FUNDS.TRANSFER';
                    postData['changedFields'] = 'fieldName:HT.NGANHANG fieldName:PAYMENT.DETAILS:1 fieldName:AGENCY.CODE:1 fieldName:DEBIT.AMOUNT fieldName:PAY.DETAILS';
                    postData['unlock'] = '';
                    postData['WS_initState'] = 'FT,AI.QCK.CITAD.TCB I F3';
                    postData['transactionId'] = parser.querySelectorAll(`input[id^='transactionId']`)[1]._attrs.value;
                    postData['fieldName:DEBIT.ACCT.NO'] = parser.querySelector(`input[name='fieldName:DEBIT.ACCT.NO']`)._attrs.value;
                    postData['fieldName:ACCT.NO.OTH'] = "";
                    postData['fieldName:HT.NGANHANG'] = "309";
                    postData['fieldName:PROVINCE.TCB'] = "";
                    postData['fieldName:SBV.CODE'] = "";
                    postData['fieldName:PAYMENT.DETAILS:1'] = "242238842";
                    postData['fieldName:AGENCY.CODE:1'] = "NGUYEN HUU NAM";
                    postData['CheckBox:fieldName:ARC.CHECK'] = "";
                    postData['fieldName:ARC.CHECK'] = "YES";
                    postData['fieldName:DEBIT.AMOUNT'] = "50000";
                    postData['fieldName:CREDIT.CURRENCY'] = "VND";
                    postData['fieldName:DEBIT.VALUE.DATE'] = "11/06/2022";
                    postData['fieldName:PAY.DETAILS'] = "";
                    // postData['replaceValueTTTT'] = ["VIET NAM THINH VUONG (VPBANK)"];
                    postData['EnqParentWindow'] = "";
                    postData['WS_FragmentName'] = postData['compTargets'].replace('ALL_', '').replace('|', '');
                    this.save_post = postData;

                }
                if (command == "OFS.APPLICATION1") {
                    const inputs = form.querySelectorAll("input[value]")
                    var newPostData = {}
                    var postData = this.save_post;

                    for (var item of inputs) {
                        if (item.getAttribute('name').includes('overrideText:Giao dich duoi')) {
                            postData[item.getAttribute('name')] = item.getAttribute('value') ?? '';
                        }
                        newPostData[item.getAttribute('name')] = item.getAttribute('value') ?? '';
                    }
                    postData['changedFields'] = "";
                    postData['ContractStatus'] = 'CHG';
                    postData['lockDateTime'] = '';
                    postData['fieldName:DEBIT.AMOUNT'] = newPostData['fieldName:DEBIT.AMOUNT'];
                    postData['fieldName:SBV.CODE'] = newPostData['fieldName:SBV.CODE'];
                    postData['overridesAccepted'] = "YES";
                    postData['overridesApproved'] = "NO";
                    postData['overridesPresent'] = "YES";
                }

                if (command == "FUNDS.TRANSFER") {
                    const inputs = form.querySelectorAll("input[value]")
                    var postData = {}
                    for (var item of inputs) {
                        postData[item.getAttribute('name')] = item.getAttribute('value') ?? '';
                    }
                    // postData = await this.ToNewJSON(this.save_post, ['fieldName:ARC.CHECK', 'CheckBox:fieldName:ARC.CHECK']);
                    // postData['fieldName:DEBIT.AMOUNT'] = parser.querySelector(`input[id='fieldName:DEBIT.AMOUNT']`)._attrs.value;
                    // postData['EnqParentWindow'] = "";
                    postData['changedFields'] = "";
                    postData['confirmVersion'] = 'FUNDS.TRANSFER,AI.QCK.CITAD.CON.TCB';
                    postData['editVersion'] = 'FUNDS.TRANSFER,AI.QCK.CITAD.TCB';
                    postData['previewVersion'] = "FUNDS.TRANSFER,AI.QCK.CITAD.PRE.TCB";
                    postData['version'] = ",AI.QCK.CITAD.CON.TCB";
                    postData['windowSizes'] = "0:0:800:500";

                    postData['ContractStatus'] = 'CHG';
                    postData['fieldName:AGENCY.CODE:1'] = ["NGUYEN HUU NAM", "NGUYEN HUU NAM"];
                    postData['fieldName:LOCAL.CHARGE.AMT'] = "";
                    postData['fieldName:PAY.DETAILS'] = ["", ""];
                    postData['focus'] = "";
                    postData['ofsFunction'] = "I";
                    postData['ofsOperation'] = "PROCESS";

                    postData['lockDateTime'] = "";
                    postData['overridesAccepted'] = "YES";
                    postData["overrideText:Quy khach bam \"Thuc hien\" de xac nhan giao dich:value"] = "YES";
                    postData['requestType'] = "OFS.APPLICATION";
                    postData['windowName'] = this.save_post["WS_FragmentName"];
                    postData['WS_FragmentName'] = this.save_post["WS_FragmentName"];
                    postData['overridesApproved'] = "NO";
                    postData['overridesPresent'] = "YES";
                    // postData['fieldName:SBV.CODE'] = parser.querySelector(`input[id='fieldName:SBV.CODE']`)._attrs.value;
                }
                if (command == "TRANSFERING") {
                    postData["formToken"] = [parser.querySelectorAll(`input[name='formToken']`)[0]._attrs.value, parser.querySelectorAll(`input[name='formToken']`)[1]._attrs.value];
                    postData["userPin"] = parser.querySelector(`input[id='userPin']`)._attrs.value;
                    postData["tokenCode"] = param.pin;
                    postData["rsa_passcode"] = postData["userPin"] + postData["tokenCode"];
                }
                return postData;
            }
        }
    }

    async postCrawl(data, form, command, param = {}) {
        const root = parse(data);
        var postData = await this.readSpecifyForm(root, form, command, param);
        console.log(postData)
        var stringPost = (command == "TRANSFERING") ? postData : (command == "OFS.APPLICATION" || command == "FUNDS.TRANSFER") ? querystring.stringify(postData)
            .replaceAll('fieldName%3A', 'fieldName:')
            .replaceAll('CheckBox%3A', 'CheckBox:')
            .replaceAll('CODE%3A', 'CODE:')
            .replaceAll('DETAILS%3A', 'DETAILS:') : querystring.stringify(postData);
        console.log(stringPost)
        // console.log(stringPost)
        if (command == "TRANSFERING") {
            var get_data = await this.client.post(this.BASE_URL, querystring.stringify(stringPost), {
                headers: {
                    "Origin": "https://ib.techcombank.com.vn",
                    "Host": "ib.techcombank.com.vn",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
                    "Accept": "*/*",
                    "Sec-Fetch-Site": "same-origin"
                }
            })

            fs.writeFileSync(`check.html`, get_data?.data)

            transferData.current_page = get_data?.data;

            return get_data?.data;
        };
        var response = await this.client.post(this.BASE_URL, stringPost, {
            headers: {
                "Origin": "https://ib.techcombank.com.vn",
                "Host": "ib.techcombank.com.vn",
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
            },
            maxRedirects: 2
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
            if (crawlerData) {
                console.log("Crawler on generalForm")
                await crawlerData.postCrawl(crawlerData.current_page, "generalForm", 'COS AI.QCK.SUM');
                console.log("Crawler on AcctBalance")
                await crawlerData.getByElement(crawlerData.current_page, "AcctBalance");
                console.log("Crawler on generalForm_AcctBalance")
                await crawlerData.postCrawl(crawlerData.current_page, "generalForm_AcctBalance", 'OFS.ENQUIRY');
                await res.send(crawlerData.current_page);
                return;
            }
            if (!crawler) {
                crawlerData = new Crawler();
                if (!await crawlerData.Login("0778377373", "P@33word")) {
                    throw 'Error'
                }
            }

            console.log("Crawler on FUNCTION")
            await crawlerData.getByElement(crawlerData.current_page, "FUNCTION");
            console.log("Crawler on MainBody")
            await crawlerData.getByElement(crawlerData.current_page, "MainBody");
            console.log("Crawler on AcctBalance")
            await crawlerData.getByElement(crawlerData.current_page, "AcctBalance");
            console.log("Crawler on generalForm_AcctBalance")
            await crawlerData.postCrawl(crawlerData.current_page, "generalForm_AcctBalance", 'OFS.ENQUIRY');
            console.log(crawlerData.current_page)

            res.send(crawlerData.current_page);
            break;
        }
        catch (e) {
            console.log(e);
            crawlerData = null;
            if (i == 1) {
                res.send('Errors!')
                break;
            }
        }
        i += 1;
    }
})


app.get('/transfer', async (req, res) => {
    try {
        transferData = new Crawler();
        if (!await transferData.Login("0778377373", "P@33word")) {
            throw 'Error'
        }
        console.log("Crawler on FUNCTION")
        await transferData.getByElement(transferData.current_page, "FUNCTION");
        console.log("Crawler on MenuHome")
        await transferData.getByElement(transferData.current_page, "MenuHome");
        console.log("Crawler on generalForm")
        await transferData.postCrawl(transferData.current_page, "generalForm", 'COS AI.QCK.FT');
        console.log("Crawler on MenuHome")
        await transferData.getByElement(transferData.current_page, "MenuHome");
        console.log("Crawler on generalForm")
        await transferData.postCrawl(transferData.current_page, "generalForm", 'OS.NEW.DEAL');
        console.log("Crawler on OFS.APPLICATION")
        await transferData.postCrawl(transferData.current_page, "appreq_MainBody", 'OFS.APPLICATION');
        console.log("Crawler on OFS.APPLICATION1")
        await transferData.postCrawl(transferData.current_page, "appreq_MainBody", 'OFS.APPLICATION1');
        console.log("Crawler on FUNDS.TRANSFER")
        await transferData.postCrawl(transferData.current_page, "appreq_MainBody", 'FUNDS.TRANSFER');

        // await transferData.client.get('https://ib.techcombank.com.vn/html/qrcode/index.jsp', {}, {
        //     headers: {
        //         "Origin": "https://ib.techcombank.com.vn",
        //         "Host": "ib.techcombank.com.vn",
        //         "Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
        //     }
        // })

        // await transferData.client.get('https://ib.techcombank.com.vn/html/qrcode/qrcode.min.js', {}, {
        //     headers: {
        //         "Origin": "https://ib.techcombank.com.vn",
        //         "Host": "ib.techcombank.com.vn",
        //         "Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
        //     }
        // })

        // console.log(response.data)



        // var reponse = {
        //     token: transferData.token,
        //     code: await parse(transferData.current_page).querySelector(`input[id='userPin']`)._attrs.value,
        // }
        res.send(transferData.current_page)

    }
    catch (e) {
        console.log(e);
        transferData = null;
        res.send('Errors!')
    }
})


app.get('/otp', async (req, res) => {
    try {
        if (!transferData) {
            return res.send("Errors!")
        }
        let param = req.query;
        console.log("Ready for transfer");
        await transferData.postCrawl(transferData.current_page, "rsaform", 'TRANSFERING', param);

        res.send(transferData.current_page)
    }
    catch (e) {
        console.log(e);
        transferData = null;
        res.send('Errors!')
    }
})



app.listen(1234, function () {
    console.log("Your app running on port " + port);
})
