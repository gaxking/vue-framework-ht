import Vue from 'vue'
import Router from 'vue-router'

import * as routerConf from '../pages/**/route.js';

//用import-glob 的写法把_conf.js的配置信息全部读出来
var routerFromFile = (() => {
	let routes = [];

	for (let key in routerConf) {
		let route = routerConf[key];

		let checkFileName = key.split("$").some((v)=>{
			return v.search(/^[^A-Z]/)==0;
		});

		if(checkFileName){
			console.error("警告:"+key.replace("$","/")+"\n文件夹命名请使用大驼峰写法(首字母大写)");
		}

		route.forEach((v)=>{
			if(v.component && v.component.__file){
				if(v.component.__file.search(/\/[A-Z]\w*.vue$/)!==-1){
					console.error("警告:"+v.component.__file+"\nVue文件命名请使用小驼峰写法(首字母小写)");
				}
			}
		});
		let _key = key.toLowerCase();
		_key = _key.split("$");
		_key[0] = _key[0]==='index'?'/':'/'+_key[0];  //第一个路由要加/在前面

		route = route.map((v)=>{

			v.path = v.path || '';
			v.path = _key.join("/") + v.path;
			return v;
		});

		routes = routes.concat(route);
	}

	return routes;
})();


const customRoutes = [
]
Vue.use(Router);

export default new Router({
  mode: 'history',
  scrollBehavior () {
    return { x: 0, y: 0 }
  },
  routes:customRoutes.concat(routerFromFile)
})
