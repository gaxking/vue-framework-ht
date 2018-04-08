import Vue from 'vue'
import axios from 'axios'
import {getCookies, deleteCookies} from '@/utils/cookies'
import {responseFilter} from './filter'
import { AlertModule } from 'vux'

const isDEV = process.env.NODE_ENV === 'development'
// token的key
const tokenKey = 'x-security-token'

let apiConfigBaseURL = '/proxy'

const showAlert = (msg) => {
	Message({
		type: 'error',
		message: msg
	})
	return false
}

	/**
	 * 代理类 基于axios
	 * @param options
	 * @returns {HtProxy}
	 * @constructor
	 */
function HtProxy(options) {
	options = options || {}

	// 上下文
	this.context = options.context || {isServer: true}
	// 指向代理服务器地址
	this.proxyUrl = options.proxyUrl || 'http://ht-json-fix.htmimi.com/json'
	// 目标环境
	this.env = options.env || ''
	// 是否不加密,默认为加密
	this['x-disable-encrypt'] = options['x-disable-encrypt'] || ''
	// headers
	this.headers = options.headers || {
		'x-api-address': '',
		'x-api-env': '', 
		'x-disable-encrypt': '',
		'x-manager-token': '',  
		'x-supplier-token': '',  
		'x-client-traceId': -1,
		'X-Requested-With': 'XMLHttpRequest',
		'x-security-token': '',   
	}

	this.initClientTraceId()
	this.configAxios()

	return this.fetchJSON.bind(this)
}

// 配置axios
HtProxy.prototype.configAxios = function () {
	axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	axios.defaults.baseURL = apiConfigBaseURL;
}

	/**
	 * 初始化 x-client-traceId
	 * @param userId
	 * @param equipmentId
	 * @returns {*}
	 */
HtProxy.prototype.initClientTraceId = function (userId, equipmentId) {
	if (this.context.isServer) {
		return
	}
	if (userId) {
		localStorage.setItem('x-client-userId', userId)
	}
	if (equipmentId) {
		localStorage.setItem('x-client-equipmentId', equipmentId)
	}
	userId = userId || localStorage.getItem('x-client-userId') || -1
	equipmentId = equipmentId || localStorage.getItem('x-client-equipmentId') || ''
	var now = new Date().getTime()
	return this.headers['x-client-traceId'] = [userId, now, equipmentId].join('_')
}

	/**
	 * 获取json
	 * @param url   需要访问的api地址
	 * @param data  请求参数,需stringify后的json
	 * @param config 非必填 配置项 {hideAlertError:是否不展示错误提示[true false]}
	 * @returns {*}
	 */
HtProxy.prototype.fetchJSON = function (url, data, config) {
	config = config || {};
	let _this = this,
		aesDecrypt; //aesDecrypt解密方法  

	//如果使用加密
	if(config && config.useEncrypt){
		return require.ensure([], function(require){
			return require('@/http/encrypt').default;
		}).then(function(Encrypt){
			let header = {};
			let params = Encrypt.getParams(url, data, header);
			aesDecrypt = params.aesDecrypt;
			delete params.aesDecrypt;

			return serviceFn.call(_this, params);
		});
	}else{
		// 服务名(eg: sso-api )
		const serviceAddress = '' + /[^\/]+/.exec(url)

		let header = {};
		header['x-api-address'] = serviceAddress;
		header['x-api-env'] = this.env || '';
		header[tokenKey] = config.token || getCookies(tokenKey);

		return serviceFn.call(this, header);
	}

	function serviceFn(_params) {
		let params = {
			url: url,
			method: config.method || 'post',
			headers: this.headers,
			data: data
		};

		if(_params){
			params = Object.assign({}, params, _params);
		}

		return axios(params).then((response)=>{
			if (response.statusText === 'OK') {
				response = response.data
				const status = responseFilter(response, (message) => {
					if (typeof window !== 'undefined') {
						deleteCookies(tokenKey)
						deleteCookies('userLoginNo')
					}

					return message || '未登录'
				})
				if (status !== true) {
					return Promise.reject({status, response})
				}

				if(aesDecrypt){
					response.data = JSON.parse(aesDecrypt(response.data));
					console.log("加密的url", params.url);
					console.log("request", aesDecrypt(params.data));
					console.log("response", response);
				}
				return response.data; //ajax成功之后只返回主体内容
			}
		}).catch((e = {}) => {
			if (!config.hideAlertError) {
				if (typeof (e.status) === 'string') {
					AlertModule.show({
						content: e.status,
						onHide () {
							console.log('Module: I\'m hiding now')
						}
					});
				} else {
					AlertModule.show({
						content: '服务器开小差了',
					});

					process.env.NODE_ENV !== 'release' && console.info(e)
					console.info(url)
					return;
					const mockData = mock(url)
					console.info(mockData)
					if (isDEV && mockData) {
						return Promise.resolve(mockData)
					}
				}
			}
			return Promise.reject(e.response || e)
		})

	}
}

	/**
	 * 设置请求头
	 * @param key
	 * @param value
	 * @returns {HtProxy}
	 */
HtProxy.prototype.header = function (key, value) {
	const props = ['x-manager-token', 'x-supplier-token', 'x-security-token']

	// 只允许设置一次token
	if (~props.indexOf(key)) {
		for (let i in props) {
			this.headers[props[i]] = ''
		}
	}
	if (typeof value !== 'undefined') {
		this.headers[key] = value
	}

	return this
}

	/**
	 * 设置属性
	 * @param prop      属性名
	 * @param value     属性值
	 * @returns {HtProxy}
	 */
HtProxy.prototype.set = function (prop, value) {
	if (typeof this[prop] !== 'undefined') {
		this[prop] = value
	} else {
		return console.log('没有该属性:' + prop)
	}
	return this
}

Vue.prototype.$http = axios

const htProxy = new HtProxy();
export default htProxy
