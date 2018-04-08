import {isWeiXin} from '@/utils/common'

let defaultShareObj, config = {}, wx; //配置

//异步读取微信sdk
if(isWeiXin){
	require.ensure([], function(require){
		return require('@/lib/wxTools/shareSdk').default;
	}).then(function(_wx){
		wx = _wx;

		wx.toFriend(config.toFriend || defaultShareObj);
		wx.toTimeLine(config.toFriend || defaultShareObj);
	});
}else{
	console.log('非微信浏览器，微信sdk不运行');
}

export default {
	setDefaultShareConf: function(opt){
		defaultShareObj = opt;
	},
	toFriend:function(opt){
		config.toFriend = opt

		if(wx){
			wx.toFriend(opt)
		}
	},
	toTimeLine:function(opt){
		config.toFriend = opt

		if(wx){
			wx.toTimeLine(opt)
		}
	}
}
