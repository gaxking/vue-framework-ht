<template>
  <div class="searchHistory">
    <h1>{{title}}</h1>
    <ul>
      <li v-for="(item,index) in searchList" :key="index">
        <a>{{item.title}}</a>
      </li>
    </ul>
  </div>
</template>

<script>

  import {
  } from 'vux'

  export default {
    props: ['title'],
    components: {

    },
    methods: {

    },
    data () {
      return {
        searchList:[
          {title:'家具'},
          {title:'家纺'},
          {title:'家电'},
          {title:'沙发'},
          {title:'茶几'},
          {title:'衣柜'},
          {title:'双人床'},
          {title:'棉被'},
          {title:'四件套'},
          {title:'洗衣机'},
        ]
      }
    }
  }

</script>

<style lang="less" scoped>

  .searchHistory{ padding: 20px;}
  .searchHistory h1{margin-bottom: 20px;}
  .searchHistory li{ background-color: #F3F4F5; line-height: 60px; border-radius: 30px; display: inline-block; min-width: 120px; box-sizing: border-box;;
    text-align: center; margin: 0 20px 20px 0; padding: 0 30px;}
</style>
