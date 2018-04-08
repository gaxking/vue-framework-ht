class Config{
    constructor(props){
        this.conf = {
        isDebug:true,               // 打开后console所有请求结果
			  envName: process.env.HT_ENV,                // 改变控制环境
			  envs:{
          dev:{left:'dev.', right:'.hd', protocol:'http:', proxyStr:'ht-json-dev.hd/1json'},
          test:{left:'ht-', right:'-test.htmimi.com', protocol:'https:', proxyStr:'ht-json-test.htmimi.com/1json'},
          beta:{left:'ht-', right:'-test.htmimi.com', protocol:'https:', proxyStr:'ht-json-test.htmimi.com/1json'},
          fix:{left:'fix.', right:'.hd', protocol:'https:', proxyStr:'ht-json-fix.htmimi.com/1json'},
          sit:{left:'sit.', right:'.hd', protocol:'http:', proxyStr:'ht-json-sit.hd/1json'},
          stress:{left:'stress.', right:'.hd', protocol:'http:', proxyStr:'ht-json-stress.hd/1json'},
          stg:{left:'ht-', right:'-stg.htmimi.com', protocol:'https:', proxyStr:'ht-json-stg.htmimi.com/1json'},
          release:{left:'ht-', right:'.htmimi.com', protocol:'http:', proxyStr:'ht-json.htmimi.com/1json'}
			  }
      }
    }
	getRequestUrl(api){
		let config = this.conf;
		let url = '';
		if(api && api.substr(0,4) == 'http'){
			url = api;
		}else{
			let env = config.envs[config.envName];
			if(env){
        url = env['protocol'] + '//';
				url += env['left'] + api + env['right'];
			}
		}
		return url;
	}
	getProxyTarget(){
		let config = this.conf;
		let url = config.envs[config.envName]['protocol'] + '//';
		url += config.envs[config.envName]['proxyStr'];
		return url;
	}
}

module.exports =  new Config();
