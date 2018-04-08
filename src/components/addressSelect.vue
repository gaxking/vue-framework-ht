
<template>
  <div>
    <scroller lock-x :scrollbar-y=false :bounce=false>
      <div>
        <ul class="addressList">
          <li class="addressItem" :class="{'current':addressId==item.addressId}" v-for="(item,index) in list" :key="index" @click="selectAddress(item)">
            <div class="content">
              <flexbox :gutter="0">
                <flexbox-item span="30">
                  <i class="location_b"></i>
                </flexbox-item>
                <flexbox-item>
                  <div class="user">
                    <b>{{item.name}}</b>
                    <span>{{item.mobile}}</span>
                  </div>
                  <p class="address">{{item.address}}</p>
                </flexbox-item>
              </flexbox>
            </div>
            <div class="option-menu">
              <a @click="edit(index)"><i class="fa fa-edit fa-1x"></i>编辑</a>
              <a @click="del(index)"><i class="fa fa-trash-o fa-1x"></i>删除</a>
            </div>
          </li>
        </ul>
        <div class="p_10">
          <x-button class="addBtn mb_20" @click.native="add"><i class="fa fa-plus"></i>添加地址</x-button>
        </div>
      </div>

    </scroller>
    <!--收货地址修改-->
    <div class="diyDialog" v-if="showDialog">
      <group class="firstGroup">
        <x-input title="收货人" placeholder="请输入收货人" label-width="5" v-model="form.name"></x-input>
        <x-input title="手机号码" placeholder="请输入手机号" is-type="china-mobile" label-width="5"  v-model="form.mobile"></x-input>
        <popup-picker :data="areaList" :columns="3" v-model="form.area" value-text-align="left" show-name @on-shadow-change="areaChange">
          <div slot="title" class="areaTitle">所在地区</div>
        </popup-picker>
        <x-input title="详细地址" placeholder="请输入详细地址" label-width="5" v-model="form.address"></x-input>
      </group>
      <div class="m_10">
        <x-button class="saveBtn mt_20" @click.native="saveAddress">保存</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import  { ConfirmPlugin, LoadingPlugin  } from 'vux'
  Vue.use(ConfirmPlugin);
  Vue.use(LoadingPlugin);

  import http from "@/http";

  import {
    TransferDom, Cell, XInput, Group, Flexbox, FlexboxItem, XButton, Popup, PopupPicker, Scroller
  } from 'vux'

  export default {
    props: ['aid'],
    directives: {
      TransferDom
    },
    components: {
      Cell, XInput, Group, Flexbox, FlexboxItem, XButton, Popup, PopupPicker, Scroller
    },
    methods: {
      selectAddress(item){
        if(this.addressId){
          this.addressId = item.addressId;
        }

        this.$emit('selectAddress', item);
      },
      del(index){
        event.stopPropagation();

        let _this = this;
        this.$vux.confirm.show({
          title:'删除',
          content:'确定要删除该地址吗？',
          onCancel () {
            console.log('onCancel');
          },
          onConfirm () {
            _this.$vux.loading.show({
              text: '删除中...'
            });
            setTimeout(function () {
              _this.list.splice(index, 1);
              _this.$vux.loading.hide();
            },1000);
          }
        });
      },
      edit(index){
        event.stopPropagation();
        this.form = this.list[index];
        this.showDialog=true;
      },
      add(){
        this.form = {
          name:'',
          mobile:'',
          area:[],
          address:''
        };
        this.showDialog=true;
      },
      areaChange(value){
        console.log(value);
      },
      saveAddress(){
        console.log(this.form);
        this.showDialog=false;
      },
      /*转换地址信息*/
      renderAddress(list){
        if(list && list.length>0){
          return list.map((v,i)=>{
            return {value:v['regionId'].toString(), parent:v['parentId'].toString(), name:v['regionName']}
          })
        }
      },
    },
    mounted(){
      /*全量加载省市区地址*/
      http('region-api/region/getAllRegionsByLevel', {level:3})
        .then(function(data){
          if(data.result){
            this.areaList = this.renderAddress(data.result);
          }
        }.bind(this));
    },
    data () {
      return {
        addressId:this.aid,
        list:[
          {addressId:1, name:'张飞', area:['27730', '27731', '27793'], mobile:'13800138001', address:'广东省广州市天河区黄埔大道西78号恒大中心25楼恒腾网络集团2559'},
          {addressId:2, name:'关羽', area:['27730', '27731', '27793'], mobile:'13800138002', address:'广东省广州市天河区黄埔大道西78号恒大中心25楼恒腾网络集团2560'},
          {addressId:3, name:'刘备', area:['27730', '27731', '27793'], mobile:'13800138003', address:'广东省广州市天河区黄埔大道西78号恒大中心25楼恒腾网络集团2561'},
          {addressId:4, name:'曹操', area:['27730', '27731', '27793'], mobile:'13800138003', address:'广东省广州市天河区黄埔大道西78号恒大中心25楼恒腾网络集团2561'},
          {addressId:5, name:'吕布', area:['27730', '27731', '27793'], mobile:'13800138003', address:'广东省广州市天河区黄埔大道西78号恒大中心25楼恒腾网络集团2561'},
          {addressId:6, name:'诸葛亮', area:['27730', '27731', '27793'], mobile:'13800138003', address:'广东省广州市天河区黄埔大道西78号恒大中心25楼恒腾网络集团2561'},
          {addressId:7, name:'孙权', area:['27730', '27731', '27793'], mobile:'13800138003', address:'广东省广州市天河区黄埔大道西78号恒大中心25楼恒腾网络集团2561'},
          {addressId:8, name:'司马懿', area:['27730', '27731', '27793'], mobile:'13800138003', address:'广东省广州市天河区黄埔大道西78号恒大中心25楼恒腾网络集团2561'}
        ],
        level1:[],
        level2:[],
        level3:[],
        areaList:[],
        form:{
          name:'',
          mobile:'',
          area:[],
          address:''
        },
        showDialog:false
      }
    }
  }

</script>

<style lang="less" scoped>
  .firstGroup /deep/ .vux-cell-value{ color:#000;}
  .addressItem{ padding: 10px 0 10px; background-color: #fff; margin: 20px;color:#222; border: 1PX solid #eee;}
  .addressItem.current{ border: 1PX solid #D0B473;}
  .user{ line-height: 60px;}
  .user b{ margin-right: 20px; font-weight: normal;}
  .address{ font-size: 12PX;}
  .content{ margin: 0 20px 10px;}
  .option-menu{ border-top:1PX solid #eee; text-align: right; padding-top: 10px;}
  .option-menu a{ margin-right: 20px; line-height: 48px; display: inline-block; height: 48px; padding: 0 20px; font-size: 12PX; border-radius: 24px; border: 1PX solid #ccc;}
  .option-menu a i{ margin-right: 6px;}

  .addBtn{ background-color: #fff; font-size: 16PX; line-height: 100px;}
  .addBtn i{ margin-right: 10px;}

  .areaTitle{ width: 105PX;}
  .saveBtn{ background-color: #FFB000; border-radius: 50px; line-height: 100px; height: 100px; color:#fff; font-size: 16PX;}

</style>
