import BroadCast from '@/mm/broadCast/list.vue'
import BroadCastDetail from '@/mm/broadCast/detail.vue'


export default [
  {
    path: '/broadCast',
    meta: {
      title: '小区广播'
    },
    component: BroadCast,
  },
  {
    path: '/broadCast/detail/:id',
    meta: {
      title: '广播详情'
    },
    component: BroadCastDetail
  }
]
