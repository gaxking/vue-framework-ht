<template>
<div>
	<x-header title="个人中心" :left-options="{backText: ''}"></x-header>
	<ul>
		<li v-for="(item, index) in list" :key="index">
		<img class="fl" src="http://img.jiaju.htmimi.cn/img/2017/11/26/18504884015999824602286_240X240.jpg"/>
		<p class="p1">
			冬日暖阳迎接新家的一缕阳光冬日暖阳迎接新家的一缕阳光冬日暖阳迎接
		</p>
		<p class="p2">
			<span>日系</span>
			<span>三室一厅</span>
			<span>简约</span>
		</p>
		<p class="p3">
			<span class="date fl">2017-10-20 10:00:00</span>
			<span class="fr"><i class="fa fa-heart-o fa-1x"></i>28</span>
			<span class="fr icon1"><i class="fa fa-commenting-o fa-1x"></i>66</span>
		</p>
		</li>
	</ul>
</div>
</template>

<script>
import {XHeader} from 'vux'

export default {
	components: {
		XHeader
	},
		data () {
			return {
				list:[
					{url:'http://img.jiaju.htmimi.cn/img/2017/4/17/14810702260661711334952_240X240.jpg'},
					{url:'http://img.jiaju.htmimi.cn/img/2017/6/26/15703396087411078371535_240X240.jpg'},
					{url:'http://img.jiaju.htmimi.cn/img/2017/6/26/15703513808837471391259_240X240.jpg'},
					{url:'http://img.jiaju.htmimi.cn/img/2017/6/26/15703214264434838789670_240X240.jpg'}
				]

			}
		}
}
</script>

<style lang="less" scoped>
ul{
	li{
		background:#fff;
		padding:20px;
		margin-bottom:10px;
		overflow:hidden;
		img{width:180px;height:180px;margin-right:20px;border-radius:15px}
		.p1{
			line-height:40px;
			font-size:14PX;
			height:80px;
			margin:0 0 12px 0;
		}
		.p2{
			height:40px;
			color:#6B6A72;
			margin-bottom:24px;
			overflow:hidden;
			span{
				border:1px solid #6B6A72;
				font-size:24px;
				line-height:24px;
				padding:6px 16px;
				overflow:hidden;
				border-radius:40px;
				display:inline-block;
			}
		}
		.p3{
			overflow:hidden;
			font-size:24px;
			line-height:24px;
			color:#A1A7AE;
			.icon1{margin-right:20px;}
			i{margin-right:10px;}
		}
	}
}
</style>
