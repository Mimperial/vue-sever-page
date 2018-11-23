import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage' // 基本信息页面
import AccountPage from '@/components/AccountPage' // 键统计页面
import DetailPage from '@/components/DetailPage' // 键详情页面
import PerformancePage from '@/components/PerformancePage' // 性能监控页面
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/AccountPage',
      name: 'AccountPage',
      component: AccountPage
    },
    {
      path: '/DetailPage',
      name: 'DetailPage',
      component: DetailPage
    },
    {
      path: '/PerformancePage',
      name: 'PerformancePage',
      component: PerformancePage
    }
  ]
})
