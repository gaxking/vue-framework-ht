<template>
  <div id="app">
    <!--<transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">-->

    <!--</transition>-->
    <router-view class="router-view" ></router-view>
  </div>
</template>

<script>
  import { mapState, mapActions} from 'vuex'
  import Vue from "vue"
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    components : {

    },
    computed:{
      ...mapState({
        direction: state => state.mutations.direction,
      })
    },
  }
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import "./assets/css/global.less";
</style>
