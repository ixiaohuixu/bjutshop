import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Button from 'mint-ui/lib/button'
Vue.component(Button.name,Button)//标签组件，标签为<mt-button>

import './mock/mockServer'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',

  components: { App },
  template: '<App/>',
  router,//会有$router  ￥route     <router-link>    <router-view>
  store,//注册使用store

})
