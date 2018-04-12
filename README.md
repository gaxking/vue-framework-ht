
启动项目
------------
    HT_ENV=beta npm run dev //开启本地服务器，不压缩代码，代理指向测试环境
    npm run build //生产环境代码生成
    npm run start //运行本地服务器，代码指向dist目录，代理默认指向release

项目结构
------------
  ```
├── README.md  
├── build //vue构建目录  
├── config //vue配置目录  
├── dist //构建后生成的文件 
│   ├── index.html  
│   └── static  
│       ├── css  
│       └── js  
├── index.html  
├── package.json  
├── src  
│   ├── App.vue  
│   ├── assets  //全局用到的静态资源  
│   │   ├── css  
│   │   │   └── global.less  
│   │   └── images  
│   ├── components //公用组件  
│   ├── http  //请求相关  
│   │   ├── config.js  
│   │   ├── encrypt.js  
│   │   ├── error.js  
│   │   ├── filter.js  
│   │   └── index.js  
│   ├── lib //库  
│   │   ├── animation //转场动画  
│   │   ├── appTools  //拦截协议  
│   │   └── wxTools  //微信相关  
│   ├── main.js //主文件入口  
│   ├── mj //业务逻辑  
│   │   ├── Index  
│   │   │   ├── css  
│   │   │   ├── images  
│   │   │   ├── js  
│   │   │   ├── route.js   //文件中的路由   
│   │   │   └── index.vue  
│   │   └── Login  
│   │       ├── forgetPwd.vue  
│   │       ├── index.vue  
│   │       └── setPwd.vue  
│   ├── router //路由  
│   │   ├── broadCast.js  
│   │   ├── index.js  
│   │   └── plugin.js  
│   └── utils //小工具static  
│       ├── cookies.js  
│       └── global.js  
└── static  //一些外部不希望被编译的js、css文件,比如jq文件  
  ```

项目说明
------------
	1.本框架是在vue-cli的基础上，根据公司的详细情况，进行拓展。主要集成的技术如下:  
	2.UI框架vux [https://vux.li/#/](https://vux.li/#/)
	3.微信相关sdk的封装 src/lib/wxTools
	恒腾密密相关拦截协议 src/lib/appTools
	http通信封装(含加解密) src/http
	屏幕适配使用 flexible [https://github.com/amfe/lib-flexible](https://github.com/amfe/lib-flexible)
	去掉了webpack-dev-server，换成自己的express写法，可动态修改首屏信息 build/dev-server.js


开发注意事项
------------
1.css 一定要用 scoped
```css
	<style scoped></style>
```
2.修改vux的css要用 deep 链接
```css
	.wrapper /deep/ .vux-check-icon{
		top:55px;
	｝
```
3.路由可直接写在 pages/someProject/route.js
```javascript
	{				//index目录可以不加path
		meta: {
			title: '个人中心'
		},
		component:  () => import('./index.vue')
	},
	{
		path: '/Safe',  //path要加“/”在前面
		meta: {
			title: '安全中心'
		},
		component: () => import('./safe.vue')
	}
```
4.设计图按750px的标准设计，用postCss的 px2rem 编译计算rem的值
```css
	.head{
		border-bottom:1px #EBEBEB solid; //1px就默认是1px，不会被转换rem
		margin-right:6px;  //除了1px的px单位全部被换成rem
		font-size:14PX;   //大写的PX，不会换成rem，一般字体的大小不参与rem换算
	}
```

