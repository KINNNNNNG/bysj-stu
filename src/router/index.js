import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import KS from '@/components/KS'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path:'/ks',
      name:'KS',
      component:KS
    }
  ]
})
