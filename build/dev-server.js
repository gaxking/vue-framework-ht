require('./check-versions')()
var fs = require("fs");

var isProd = process.env.HT_ENV === 'release'
var config = require('../config')[isProd?'build':'dev']

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = require('../config/dev.env').NODE_ENV;
}


var path = require('path')
var express = require('express')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'production'
	? require('./webpack.prod.conf')
	: require('./webpack.dev.conf')
// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.port

// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.proxyTable
var request = require('request')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var FileStore = require('session-file-store')(session);

//微信登录相关
var redirect_url = 'http://xx.xx.xx.xx:3801';
var appid = 'appid：xxxxxxxxxxxxxxxx';
var appsecret = 'xxxxxxxxxxxxxxxxxxxxxxxxxx';

var app = express()

//session相关
var identityKey = 'skey';
app.use(cookieParser());
app.use(session({
	secret: '12345',
	name: 'name',
	cookie: {maxAge: 600000},
	resave: false,
	saveUninitialized: true,
}));


if(!isProd){
	var opn = require('opn')
	var webpack = require('webpack')

	// automatically open browser, if not set will be false
	var autoOpenBrowser = !!config.autoOpenBrowser

	var compiler = webpack(webpackConfig)

	var devMiddleware = require('webpack-dev-middleware')(compiler, {
		publicPath: webpackConfig.output.publicPath,
		serverSideRender: true,   //让webpack-dev-middleware拥有服务端渲染的钩子
		quiet: true
	})

	var hotMiddleware = require('webpack-hot-middleware')(compiler, {
		log: () => {}
	})
	// force page reload when html-webpack-plugin template changes
	compiler.plugin('compilation', function (compilation) {
		compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
			hotMiddleware.publish({ action: 'reload' })
			cb()
		})
	})

	

	
	// serve webpack bundle output
	app.use(devMiddleware)

	//app.use(require('connect-history-api-fallback')({verbose:true}))

	app.use(/.*/, ssr);

	
	// enable hot-reload and state-preserving
	// compilation error display
	app.use(hotMiddleware)

	// serve pure static assets
	var uri = 'http://localhost:' + port

	var _resolve
	var readyPromise = new Promise(resolve => {
		_resolve = resolve
	})
}else{
	app.use("/static", express.static(config.assetsRoot+"/static"));

	app.get(/.*/, ssr);
}

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
	var options = proxyTable[context]
	if (typeof options === 'string') {
		options = { target: options }
	}
	app.use(proxyMiddleware(options.filter || context, options))
})


var staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var server = app.listen(port, function(error) {
	if (error) {
		console.error(error)
	} else {
		console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
	}
})

module.exports = {
	ready: readyPromise,
	close: () => {
		server.close()
	}
}


function getWxAccess(req){
	return new Promise(function(resolve, reject){
		var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+appid+'&secret='+appsecret+'&code='+req.query.code+'&grant_type=authorization_code';


		request(url,function (error, response, data) {
		console.log(data);
			data = JSON.parse(data);
			req.session.access_token = data.access_token;
			req.session.openid = data.openid;

			var url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+data.access_token+'&openid='+data.openid+'&lang=zh_CN';
			request(url,function (error, response, data) {
				resolve(data);
			})
		});
	});
}


function ssr(req, res, next){
	var headers = req.headers;

	//参考connect-history-api-fallback的匹配写法
    if (req.method !== 'GET') {
      return next();
    } else if (!acceptsHtml(headers.accept,	{})) {
      return next();
    }

	if(config.wxLogin){
		if(!req.session.access_token || !req.session.openid || !req.session.wxInfo){
			//const fullURL = req.protocol + '://' + req.host + ":"+ port + req.originalUrl
			let fullURL = redirect_url + req.originalUrl;
			let authorize_url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+encodeURIComponent(fullURL)+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';

			if(req.query.code){
				getWxAccess(req).then(info=>{
					console.log(info);
					info = JSON.parse(info);
					req.session.wxInfo = info;
					res.redirect(302, fullURL.replace(/\?.*$/,''));
				});
			}else{
				res.redirect(302, authorize_url);
			}
			return;
		}
	}

	sendFile();

	function sendFile(){
		//输出index.html ,任意地址都指向html文件

		var indexPath = isProd?path.join(__dirname,'../dist','index.html'):path.join(__dirname,'../','index.html');

		var html = fs.readFile(indexPath,function(err,data){
			if(err){
				next(err);
			}else{
				data = data.toString();
				if(!isProd){
					const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName

					data = data.replace("</body>", `</body>
					${
						normalizeAssets(assetsByChunkName.main)
						.filter(path => path.endsWith('.js'))
						.map(path => `<script src="/${path}"></script>`).join('')
					}`);
				}

				if(config.wxLogin){
					data = data.replace("</head>", "</head><script>window.wxInfo={nickname:'"+req.session.wxInfo.nickname+"'}</script>");
				}
				
				data = data.replace("</head>", "</head><script>window.wxInfo={nickname:123}</script>");

				//console.log(data.toString());
				res.send(data);
			}
		})
	}


	function normalizeAssets(assets) {
		return Array.isArray(assets) ? assets : [assets]
	}


	function acceptsHtml(header, options) {
		options.htmlAcceptHeaders = options.htmlAcceptHeaders || ['text/html', '*/*'];
		for (var i = 0; i < options.htmlAcceptHeaders.length; i++) {
			if (header.indexOf(options.htmlAcceptHeaders[i]) !== -1) {
				return true;
			}
		}
		return false;
	}
}
