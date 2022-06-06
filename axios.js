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

var BASE_URL = 'https://ib.techcombank.com.vn/servlet/BrowserServlet';
let save_ws = null;
const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

async function test() {

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
	//E9FE270563950FBB0CC03FFD1B55A89E65F47074AAFD9A55A0
	//E6AEDDC3AD4DD3FEAA38CB164E8A2A3376D16AB08640F36648

	//9C6CCAE48CEBA03ACCCAEDABD8877B4EAE17CBCD92D455F7C4 mainmenu_STMTSTEPTWO113626837001
	//99D6CA5D691C540AACD8D9B3EF5B2FB2B4BD55FFE810B426E4 appreq_STMTSTEPTWO113626837001
	// D55BEC85B11DEECF2F77C6C1228DA49BD03F89B13E90491172 appreq_STMTSTEPTWO771786844801
	//284B8A964A2540EF182A2C4BDDBBDD6372EDEAB548AC8BBCB8

	//3ED62BEA
	//3ED62BEAE5DC8CDEA6F58E29B163F5BBAC12F2CBF01DE0FC22

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
		var get_element = root.querySelectorAll('.fragmentContainer').filter(item => item.rawAttrs.includes('MenuHome'))[0];
		var get_element_url = BASE_URL.replace('BrowserServlet', get_element._attrs.fragmenturl);

		client.get(get_element_url, {}, {
			headers: {
				"Origin": "https://ib.techcombank.com.vn",
				"Host": "ib.techcombank.com.vn",
				"Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
			}
		}).then((response) => {
			const root = parse(response.data);
			const form = root.querySelector("form[name='generalForm']");
			if (form) {
				const inputs = form.querySelectorAll("[type='hidden']")
				var postData = {}
				if (inputs.length > 0) {
					for (var item of inputs) {
						postData[item.getAttribute('name')] = item.getAttribute('value') ?? '';
					}
					postData['requestType'] = 'UTILITY.ROUTINE'
					postData['routineName'] = 'OS.GET.COMPOSITE.SCREEN.XML'
					postData['routineArgs'] = 'COS AI.QCK.ACCOUNT'
					postData['windowName'] = postData['WS_parentComposite']
					postData['WS_FragmentName'] = postData['WS_parentComposite']
					postData['WS_initState'] = postData['routineArgs']
					client.post(BASE_URL, querystring.stringify(postData), {
						headers: {
							"Origin": "https://ib.techcombank.com.vn",
							"Host": "ib.techcombank.com.vn",
							"Content-Type": "application/x-www-form-urlencoded",
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
							var get_element = root.querySelectorAll('.fragmentContainer').filter(item => item.rawAttrs.includes('STMTSTEPTWO'))[0];
							var get_element_url = BASE_URL.replace('BrowserServlet', get_element._attrs.fragmenturl);
							console.log(get_element._attrs.fragmentname)
							save_ws = get_element._attrs.fragmentname;
							client.get(get_element_url, {}, {
								headers: {
									"Origin": "https://ib.techcombank.com.vn",
									"Host": "ib.techcombank.com.vn",
									"Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
								}
							}).then((response) => {
								//generalForm
								//D5DFEFDCE90A2A8F5A1AED4637FCCEBF4EB0AAEDB8ABDF0B7C
								//generalForm_STMTSTEPTWO
								const root = parse(response.data);
								// var get_element = root.querySelector("[id^='divHeader_']");
								const form = root.querySelector("form[id^='appreq_STMTSTEPTWO']");
								if (form) {
									const inputs = form.querySelectorAll("[type='hidden']")
									var postData = {}
									if (inputs.length > 0) {
										for (var item of inputs) {
											postData[item.getAttribute('name')] = item.getAttribute('value') ?? '';
										}
									}
									postData['requestType'] = "OFS.APPLICATION";
									postData['ofsOperation'] = "PROCESS";
									postData['ofsFunction'] = "I";
									postData['radio:tab1:QUICK.SEARCH.1'] = [1, 2, 3];
									postData['WS_FragmentName'] = save_ws;
									postData['windowName'] = save_ws;
									const newPost = querystring.stringify(postData)
										.replace('&fieldName%3AQUICK.SEARCH.1=', '&fieldName:QUICK.SEARCH.1=')
										.replace('&fieldName%3AERROR=', '&fieldNam:ERROR=')
										.replaceAll('&radio%3Atab1%3AQUICK.SEARCH.1=', '&radio:tab1:QUICK.SEARCH.1=')
									client.post(BASE_URL, newPost, {
										headers: {
											"Origin": "https://ib.techcombank.com.vn",
											"Host": "ib.techcombank.com.vn",
											"Content-Type": "application/x-www-form-urlencoded",
											"Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
										}
									}).then((response) => {
										const root = parse(response.data);
										// var get_element = root.querySelector("[id^='divHeader_']");
										const form = root.querySelector("form[name='generalForm']");
										if (form) {
											var postData = {}
											var newPostData = {}

											if (inputs.length > 0) {
												for (var item of inputs) {
													if (item.getAttribute('name') == 'fieldName:QUICK.SEARCH.1') continue
													if (item.getAttribute('name') == 'fieldName:ERROR') continue
													if (item.getAttribute('name') == 'toggle') continue

													postData[item.getAttribute('name')] = item.getAttribute('value') ?? '';
												}
											}
											newPostData['formToken'] = postData['formToken'];
											newPostData['requestType'] = "OFS.ENQUIRY";
											newPostData['routineName'] = '';
											newPostData['routineArgs'] = "ACCOUNT EQ 19037241429093 BOOKING.DATE RG '20220306 20220604' TXN.CNT EQ 10";
											newPostData['application'] = '';
											newPostData['ofsOperation'] = '';
											newPostData['ofsFunction'] = '';
											newPostData['ofsMessage'] = '';
											newPostData['version'] = '';
											newPostData['transactionId'] = '';
											newPostData['command'] = 'globusCommand';
											newPostData['operation'] = '';
											newPostData['windowName'] = postData['WS_parentComposite'];
											newPostData['apiArgument'] = '';
											newPostData['name'] = '';
											newPostData['enqname'] = 'AI.QCK.TRAN.SEARCH.STMT.TCB';
											newPostData['enqaction'] = 'SELECTION';
											newPostData['dropfield'] = '';
											newPostData['previousEnqs'] = '';
											newPostData['previousEnqTitles'] = '';
											newPostData['clientStyleSheet'] = '';
											newPostData['unlock'] = '';
											newPostData['allowResize'] = 'YES';
											newPostData['companyId'] = 'VN0010001';
											newPostData['company'] = 'BNK-TECHCOMBANK HOI SO';
											newPostData['user'] = postData['user'];
											newPostData['transSign'] = '';
											newPostData['skin'] = 'arc-ib';
											newPostData['today'] = postData['today'];
											newPostData['release'] = postData['release'];
											newPostData['compScreen'] = postData['compScreen'];
											newPostData['reqTabid'] = '';
											newPostData['compTargets'] = '';
											newPostData['EnqParentWindow'] = save_ws;
											newPostData['timing'] = postData['timing'];
											newPostData['pwprocessid'] = '';
											newPostData['language'] = postData['language'];
											newPostData['languages'] = postData['languages'];
											newPostData['savechanges'] = postData['savechanges'];
											newPostData['staticId'] = '';
											newPostData['lockDateTime'] = '';
											newPostData['popupDropDown'] = 'true';
											newPostData['allowcalendar'] = '';
											newPostData['allowdropdowns'] = '';
											newPostData['allowcontext'] = 'NO';
											newPostData['nextStage'] = '';
											newPostData['maximize'] = 'true';
											newPostData['showStatusInfo'] = 'NO';
											newPostData['languageUndefined'] = 'Language Code Not Defined';
											newPostData['expandMultiString'] = 'Expand Multi Value';
											newPostData['deleteMultiString'] = 'Delete Value';
											newPostData['expandSubString'] = 'Expand Sub Value';
											newPostData['clientExpansion'] = 'true';
											newPostData['WS_parentWindow'] = '';
											newPostData['WS_parent'] = '';
											newPostData['WS_dropfield'] = '';
											newPostData['WS_doResize'] = '';
											newPostData['WS_initState'] = "ENQ AI.QCK.TRAN.SEARCH.STMT.TCB ACCOUNT EQ 19037241429093 BOOKING.DATE RG '20220306 20220604' TXN.CNT EQ 10";
											newPostData['WS_PauseTime'] = "";
											newPostData['WS_multiPane'] = "false";
											newPostData['WS_replaceAll'] = "yes";
											newPostData['WS_parentComposite'] = postData['WS_parentComposite'];
											newPostData['WS_delMsgDisplayed'] = "";
											newPostData['WS_FragmentName'] = postData['WS_parentComposite'];
											client.post(BASE_URL, querystring.stringify(newPostData), {
												headers: {
													"Origin": "https://ib.techcombank.com.vn",
													"Host": "ib.techcombank.com.vn",
													"Content-Type": "application/x-www-form-urlencoded",
													"Referer": "https://ib.techcombank.com.vn/servlet/BrowserServlet",
												}
											}).then((response) => {
												console.log(response.data)
												const root = parse(response.data);
												// var get_element = root.querySelector("[id^='divHeader_']");
												const form = root.querySelectorAll("[id*='MainBody']");
												for (var item of form) {
													const ele = item.querySelectorAll("td");
													if (ele.length == 5) {
														for (var text of ele) {
															console.log(text.childNodes[0]._rawText)
														}
													}
													// for (var td of ele) {
													// 	console.log(td.childNodes)
													// }
												}
											})
										}
									})
								}
							})
						})
					})
				}
			}
		})
	})


}

test();
