const axios = require('axios').default;
const cheerio = require('cheerio');
var querystring = require('querystring');
fs = require('fs');

const cookieJar = {
	myCookies: undefined,
};

const instance = axios.get('https://ib.techcombank.com.vn/servlet/BrowserServlet')
	.then(function (response) {
		// handle success
		cookieJar.myCookies = response.headers['set-cookie'];
		const $ = cheerio.load(response.data);

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
		bodyFormData['btn_login'] = 'ĐĂNG NHẬP';
		bodyFormData['MerchantId'] = '';
		bodyFormData['Amount'] = '';
		bodyFormData['Reference'] = '';
		bodyFormData['language'] = '2';
		bodyFormData['UserType'] = 'per';

		console.log(response.headers['set-cookie'])

		axios.post('https://ib.techcombank.com.vn/servlet/BrowserServlet', querystring.stringify(bodyFormData), {
			headers: {
				"Origin": "https://ib.techcombank.com.vn",
				"Host": "ib.techcombank.com.vn",
				"Content-Type": "application/x-www-form-urlencoded",
				"Cookie": response.headers['set-cookie'].toString()
			}
		}).then(function (response) {
			// console.log(response.data)
			// fs.writeFile('test.html', response.data, function (err) {
			// 	if (err) return console.log(err);
			// 	console.log('Hello World > helloworld.txt');
			// })
		}).catch(function (error) {
			// handle error
			console.log(error);
		})

	})
	.catch(function (error) {
		// handle error
		console.log(error);
	})

