import Vue from 'vue'
import Router from 'vue-router'

import Msite from '../pages/Msite/Msite'
import Search from '../pages/Search/Search'
import Order from '../pages/Order/Order'
import Profile from '../pages/Profile/Profile'
import Login from '../pages/Login/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/profile',
      component: Profile},
    {path: '/search',
      component: Search},
    {path: '/order',
      component: Order},
    {path: '/msite',
      component: Msite},
    {path:'/login',
      component:Login},
    {path:'/',
    redirect:'/profile'}
  ]
})
