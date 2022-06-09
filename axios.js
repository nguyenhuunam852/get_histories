const axios = require('axios').default;
const cheerio = require('cheerio');
var querystring = require('querystring');
fs = require('fs');
parse = require('node-html-parser').parse;
wrapper = require('axios-cookiejar-support').wrapper
CookieJar = require('tough-cookie').CookieJar;

const cookieJar = {
	myCookies: undefined,
};

class Crawler {
	constructor() {
		this.BASE_URL = 'https://ib.techcombank.com.vn/servlet/BrowserServlet';
		var jar = new CookieJar();
		this.client = wrapper(axios.create({ jar }));
	}

	async Login(username, password) {
		var getPage = await client.get(BASE_URL);

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
			console.log(postData)
			client.post(BASE_URL, querystring.stringify(postData), {
				headers: {
					"Origin": "https://ib.techcombank.com.vn",
					"Host": "ib.techcombank.com.vn",
					"Content-Type": "application/x-www-form-urlencoded",
					"Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
				}
			}).then((response) => {
				console.log(response.data);
				return;
			})
		}
	}
}

async function crawlData() {

	var getPage = await client.get(BASE_URL);

	const $ = cheerio.load(getPage.data);

	const formToken = $('[name=formToken]')['0'].attribs.value;
	const counter = $('[name=counter]')['0'].attribs.value;
	const branchAdminLogin = $('[name=branchAdminLogin]')['0'].attribs.value;
	const signOnNameEnabled = $('[name=signOnNameEnabled]')['0'].attribs.value;
	const requestType = $('[name=requestType]')['0'].attribs.value;
	const command = $('[name=command]')['0'].attribs.value;
	var bodyFormData = {};
	bodyFormData['formToken'] = formToken;
	bodyFormData['counter'] = counter;
	bodyFormData['branchAdminLogin'] = branchAdminLogin;
	bodyFormData['signOnNameEnabled'] = signOnNameEnabled;
	bodyFormData['requestType'] = requestType;
	bodyFormData['command'] = command;
	bodyFormData['signOnName'] = '0988851934';
	bodyFormData['password'] = 'Ha@2002';
	bodyFormData['branchAdminLogin'] = '';
	bodyFormData['signOnNameEnabled'] = 'Y';
	bodyFormData['btn_login'] = 'ĐĂNG+NHẬP';
	bodyFormData['MerchantId'] = '';
	bodyFormData['Amount'] = '';
	bodyFormData['Reference'] = '';
	bodyFormData['language'] = '2';
	bodyFormData['UserType'] = 'per';
	var getLogin = await client.post(BASE_URL, querystring.stringify(bodyFormData), {
		headers: {
			"Origin": "https://ib.techcombank.com.vn",
			"Host": "ib.techcombank.com.vn",
			"Content-Type": "application/x-www-form-urlencoded",
			"Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
		}
	})


	const root = parse(getLogin.data);
	var get_element = root.querySelectorAll('.fragmentContainer').filter(item => item.rawAttrs.includes('FUNCTION'))[0];
	var get_element_url = BASE_URL.replace('BrowserServlet', get_element._attrs.fragmenturl);
	client.get(get_element_url, {}, {
		headers: {
			"Origin": "https://ib.techcombank.com.vn",
			"Host": "ib.techcombank.com.vn",
			"Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
		}
	}).then((response) => {


		const root = parse(response.data);

		var get_element = root.querySelectorAll('.fragmentContainer').filter(item => item.rawAttrs.includes('MainBody'))[0];
		var get_element_url = BASE_URL.replace('BrowserServlet', get_element._attrs.fragmenturl);

		client.get(get_element_url, {}, {
			headers: {
				"Origin": "https://ib.techcombank.com.vn",
				"Host": "ib.techcombank.com.vn",
				"Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
			}
		}).then((response) => {
			const root = parse(response.data);
			var get_element = root.querySelectorAll('.fragmentContainer').filter(item => item.rawAttrs.includes('AcctBalance'))[0];
			console.log(get_element._attrs)
			var save_acc = get_element._attrs.id;
			var get_element_url = BASE_URL.replace('BrowserServlet', get_element._attrs.fragmenturl);
			client.get(get_element_url, {}, {
				headers: {
					"Origin": "https://ib.techcombank.com.vn",
					"Host": "ib.techcombank.com.vn",
					"Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
				}
			}).then((response) => {
				const root = parse(response.data);
				const form = root.querySelector("form[id^='generalForm_AcctBalance']");
				if (form) {
					const inputs = form.querySelectorAll("[type='hidden']")
					var postData = {}
					if (inputs.length > 0) {
						for (var item of inputs) {
							postData[item.getAttribute('name')] = item.getAttribute('value') ?? '';
						}
					}
					postData['requestType'] = 'OFS.ENQUIRY';
					postData['routineArgs'] = '1_1_1';
					postData['windowName'] = postData['WS_parentComposite'];
					postData['enqname'] = 'AI.ACCT.BAL.QUICKWIN.TCB';
					postData['enqaction'] = 'DRILL';
					postData['EnqParentWindow'] = save_acc;
					postData['drillaction'] = 'APP';
					postData['WS_FragmentName'] = postData['WS_parentComposite'];

					console.log(postData)
					client.post(BASE_URL, querystring.stringify(postData), {
						headers: {
							"Origin": "https://ib.techcombank.com.vn",
							"Host": "ib.techcombank.com.vn",
							"Content-Type": "application/x-www-form-urlencoded",
							"Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
						}
					}).then((response) => {
						console.log(response.data);
						return;
					})
				}
			})

		})
	})


}

crawlData();
