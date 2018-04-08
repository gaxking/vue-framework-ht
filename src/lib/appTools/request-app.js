/**
 * Created by skhero on 2016/12/08.
 */

/*app拦截协议全局回调方法-start*/
window.getToken_APP = function(obj){
  var token = '';
  require(['./get-params.js'], function(Params){
     if(Params && Params['token']){
         token = Params['token'];
     }
     else if(obj && obj['token']){
         token = obj['token'];
     }
     else if(token == ''){
         location.href = "htmmowner://oAuth/getToken?isLogin=true&callback=getToken_APP";
     }

    var storage = window.localStorage;
    delete storage['t-token'];
    storage['t-token'] = token;

    /*token回调*/
    var afterGetTokenFun = window.afterGetToken;
    if(afterGetTokenFun &&  typeof afterGetTokenFun == 'function'){
      afterGetTokenFun(token);
    }
  });
};
window.showAlertAfter = function(after){
  var afterfun = window.alertAfterFunction;
  if(afterfun &&  typeof afterfun == 'function'){
    afterfun(after);
  }
};
window.toHouseAuth = function(after){
  var toHouseAuthfun = window.toHouseAuthFunction;
  if(toHouseAuthfun &&  typeof toHouseAuthfun == 'function'){
    toHouseAuthfun(after);
  }
};
window.getCurrentCommunityId = function(after){
  var getCurrentCommunityIdFun = window.getCurrentCommunityIdFunction;
  if(getCurrentCommunityIdFun &&  typeof getCurrentCommunityIdFun == 'function'){
    getCurrentCommunityIdFun(after);
  }
};
/*app拦截协议全局回调方法-end*/

define(function(require, exports, module){
  var appOjb = {
    /*判断是否是微信浏览器*/
    isWeiXin: function(){
      var ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
      }else{
        return false;
      }
    },

    /*获取app-token*/
    getToken: function(cb){
      var _this = this;
      require(['./get-params.js'], function(Params){
         if(Params && Params['token']){
             var storage = window.localStorage;
             delete storage['t-token'];
             storage['t-token'] = Params['token'];
             if(cb && typeof cb == 'function'){
                 cb(Params['token']);
             }
         }else{
             if(cb && typeof cb == 'function'){
                 window.afterGetToken = cb;
             }else{
                 delete window.afterGetToken;
             }
             location.href = "htmmowner://oAuth/getToken?isLogin=false&callback=getToken_APP";
         }
      });
    },

    /*调用app-alert*/
    showAlert: function (msg, cb) {
      var showAlertinit = function(Params){
        if(Params && Params['isDebug']){
          alert(msg);
          if(cb && typeof cb == 'function'){
            cb();
          }
        }else{
          if(cb && typeof cb == 'function'){
            window.alertAfterFunction = cb;
          }else{
            delete window.alertAfterFunction;
          }
          location.href = 'htmmowner://common/showAlert?message=' + msg + '&callback=showAlertAfter'
        }
      };
      require(['./get-params.js'], function(Params){
        showAlertinit(Params);
      });

    },

    /*跳转到app的房产认证页面*/
    toHouseAuth: function (cb) {
      var toHouseAuthInit = function(){
        if(cb && typeof cb == 'function'){
          window.toHouseAuthFunction = cb;
        }else{
          delete window.toHouseAuthFunction;
        }
        location.href = 'htmmowner://gLoginInfo/toHouseAuth?&callback=toHouseAuth'
      };
      toHouseAuthInit();
    },

    /*获取当前app小区ID*/
    getCurrentCommunityId: function (cb) {
      require(['./get-params.js'], function(Params){
        if(Params && Params['communityId']){
          cb(Params);
        }else{
          var getCurrentCommunityIdInit = function(){
            if(cb && typeof cb == 'function'){
              window.getCurrentCommunityIdFunction = cb;
            }else{
              delete window.getCurrentCommunityIdFunction;
            }
            location.href = 'htmmowner://common/getCurrentCommunityId?&callback=getCurrentCommunityId'
          };
          getCurrentCommunityIdInit();
        }
      });
    },

    /*显示获得积分弹窗*/
    showIntegralAlert: function(integral){
      location.href = 'htmmowner://htintegral/showIntegralAlert?integral=' + integral
    },

    /*跳转至邀请注册页*/
    jumpToInviteNeighbor:function () {
      location.href = 'htmmowner://htintegral/jumpToInviteNeighbor'
    },

    /*跳转至查看已邀请好友数*/
    jumpToInviteRecords:function () {
      location.href = 'htmmowner://htintegral/jumpToInviteRecords'
    },

    /*跳转到蜜积分页面*/
    jumpToInviteMain:function () {
      location.href = 'htmmowner://htintegral/jumpToInviteMain'
    }
  };
  return appOjb;
});
