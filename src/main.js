// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import * as route from './router/index'
import store from './lib/animation/store/'
import './utils/global'
import 'lib-flexible'
import wx from '@/lib/wxTools'
import './assets/css/font-awesome-4.7.0/css/font-awesome.min.css'

wx.setDefaultShareConf({
	title: window.document.title,
	desc: '',
	link: window.location.href,
	imgUrl: 'https://ht-img1-test.htmimi.com/group1/M00/02/48/CmSjC1o8bVSABR6HAAE-c3ZvcAw654.jpg',
});


const router = route['default'];

router.afterEach(function (to) {
	// isPush = false;
  /*title*/
  if(to.meta && to.meta.title){
    window.document.title = to.meta.title;
  }else{
    window.document.title = '密蜜家居';
  }
});

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app-box');
