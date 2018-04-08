/**
 * Created by skhero on 2018/1/11.
 */
import config from './config.js';
import CryptoJS from 'crypto-js';
//import HtProxy from './ht-proxy.js';

import axios from 'axios'

const constant = {
	AES_BASE_KEY:'**********',
	APP_ID:'*********',
	APP_SECURITY:'****************************************',
	DEFAULT_TOKEN:'****************************************'
};

class Encrypt{
	constructor(props){
		this.Header = {
			'Content-Type': 'application/x-json',
			'x-security-version': '1.0',
			'x-security-timestamp': new Date().getTime(),
			'x-client-id': '',
			'x-client-type': 'wechat',
			'x-client-os': 'wechat',
			'x-client-os-version': '0',
			'x-client-channel':'0',
			'x-client-hardware':'0',
			'x-client-version-name':'wechat',
			'x-client-version-code':'0',
			'x-request-time': new Date().getTime(),
			'x-client-source':'7',
			'x-client-appId': constant.APP_ID,
			'x-client-fruit':'watermelon'
		};
	}
	calculateKey(token, key){
		if(!token){
			token = constant.DEFAULT_TOKEN;
		}
		if(!key){
			key = constant.AES_BASE_KEY;
		}
		let res = CryptoJS.SHA256(token+key).toString().substr(0,16);
		return res;
	}
	Signature(data){
		return CryptoJS.MD5(JSON.stringify(data) + constant.APP_ID + constant.APP_SECURITY).toString().toUpperCase();
	}
	aesEncrypt(data, key) {
		/**
		 * CipherOption, 加密的一些选项:
		 *   mode: 加密模式, 可取值(CBC, CFB, CTR, CTRGladman, OFB, ECB), 都在 CryptoJS.mode 对象下
		 *   padding: 填充方式, 可取值(Pkcs7, AnsiX923, Iso10126, Iso97971, ZeroPadding, NoPadding), 都在 CryptoJS.pad 对象下
		 *   iv: 偏移量, mode === ECB 时, 不需要 iv
		 * 返回的是一个加密对象
		 */
		let cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return cipher.toString();
	}
	aesDecrypt(encryptedStr, key){
		let data = CryptoJS.AES.decrypt(encryptedStr, CryptoJS.enc.Utf8.parse(key),{
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		return data.toString(CryptoJS.enc.Utf8);
	}
  getParams(url, data, _header){
			const index = url.indexOf("/");
			url = config.getRequestUrl(url.slice(0,index)) + '/' + url.slice(index+1);

		const htToken = localStorage['htToken'];
		if(htToken){
			this.Header['x-security-token'] = htToken;
		}

		let headers = Object.assign({}, this.Header, _header);

		let signature = this.Signature(data);
		let key =  this.calculateKey(htToken);
		data = this.aesEncrypt(JSON.stringify({signature:signature, params:data}), key);

		let aesDecrypt = data =>{
			return this.aesDecrypt(data, key);
		}

		return {
			url,
			headers,
			data,
			aesDecrypt
		}
	}
}

export default new Encrypt();

