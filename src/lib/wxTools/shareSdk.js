import axios from 'axios';
import wx from 'weixin-js-sdk'

function wxShare(){
	var config = {};
	var wxDomain = 'xxxxxxx.com';
	var domain = location.hostname;

	axios({
		url: 'https://'+ wxDomain +'/index.php/Api/Wxapi/JsSignPackage?url=' +location.href,
		method:'GET',
	}).then(function (res) {
		var wxConfig = res;
		delete wxConfig.url;
		wxConfig.jsApiList = [
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'onMenuShareQZone',
			'hideOptionMenu',
			'showOptionMenu',
			'hideMenuItems',
			'showMenuItems',
			'chooseWXPay',
			'hideOptionMenu',
			'showOptionMenu',
			'hideMenuItems',
			'showMenuItems'
		];

		wx.config(wxConfig);
		wx.error(function(res){
			console.log("验证失败："  +JSON.stringify(res));
		});
		/*分享页面*/
		wx.ready(function () {
			var shareObjtofriends = {
				title: options.title,
				desc: options.desc,
				link: options.link,
				imgUrl: options.imgUrl,
				trigger: function (res) {
				},
				success: function (res) {
				},
				cancel: function (res) {
				},
				fail: function (res) {
				}
			};
			var shareTimeline = {
				title: options.desc,
				link: options.link,
				imgUrl: options.imgUrl,
				trigger: function (res) {
				},
				success: function (res) {
				},
				cancel: function (res) {
				},
				fail: function (res) {
				}
			};
			console.log(shareObjtofriends);
			//分享朋友
			wx.onMenuShareAppMessage(config.toFriend);
			//分享朋友圈
			wx.onMenuShareTimeline(config.toTimeLine);
		});
	});

	return {
		toFriend:(opt)=>{
			config.toFriend = opt;
			wx.onMenuShareAppMessage(opt)
		},
		toTimeLine:(opt, isInit)=>{
			config.toFriend = opt;
			wx.onMenuShareTimeline(opt)
		}
	};
}

export default wxShare()
