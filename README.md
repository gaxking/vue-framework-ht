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
│   └── static  
│       ├── css  
│       └── js  
├── index.html  
├── package.json  
├── src  
│   ├── App.vue  
│   ├── assets  //全局用到的静态资源  
│   │   ├── css  
│   │   │   └── global.less  
│   │   └── images  
│   ├── components //公用组件  
│   ├── http  //请求相关  
│   │   ├── config.js  
│   │   ├── encrypt.js  
│   │   ├── error.js  
│   │   ├── filter.js  
│   │   └── index.js  
│   ├── lib //库  
│   │   ├── animation //转场动画  
│   │   ├── appTools  //拦截协议  
│   │   └── wxTools  //微信相关  
│   ├── main.js //主文件入口  
│   ├── mj //业务逻辑  
│   │   ├── Index  
│   │   │   ├── css  
│   │   │   ├── images  
│   │   │   ├── js  
│   │   │   ├── route.js   //文件中的路由   
│   │   │   └── index.vue  
│   │   └── Login  
│   │       ├── forgetPwd.vue  
│   │       ├── index.vue  
│   │       └── setPwd.vue  
│   ├── router //路由  
│   │   ├── broadCast.js  
│   │   ├── index.js  
│   │   └── plugin.js  
│   └── utils //小工具static  
│       ├── cookies.js  
│       └── global.js  
└── static  //一些外部不希望被编译的js、css文件,比如jq文件  
  ```
