import appIntercept from '@/mm/app/intercept.vue'
import wxShare from '@/mm/wx/share.vue'


export default [
  {
    path: '/app',
    meta: {
      title: 'app接口'
    },
    component: appIntercept
  },
  {
    path: '/wxShare',
    meta: {
      title: '微信分享'
    },
    component: wxShare
  }

]
