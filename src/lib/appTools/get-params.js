/**
 * Created by skhero on 2016/11/24.
 */
define(function(require, exports, module){
    var params = {
        data:{},
        init: function(){
            var _this = this;
            var hash = location.href;
            var urlArr = hash.split('?');
            if(urlArr.length>1){
              var url = '?' + urlArr[1];
              var theRequest = new Object();
              if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for(var i = 0; i < strs.length; i ++) {
                  theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
                }
              }
              _this.data = theRequest;
            }

        }
    };
    params.init();
    return params.data;
});
