<template>
  <div id="app">
 <!--  <router-link to=""></router-link>-->
    <!--一共有两层
    1   路由组件
    2    组件  底部导航-->
    <router-view></router-view><!--显示路由组件的内容-->
    <FooterGuide v-if="$route.path!='/login'"></FooterGuide><!--显示底部导航footerguide-->
  </div>
</template>

<script>
import FooterGuide from './components/FooterGuide/FooterGuide'
export default {
   components:{
     FooterGuide
   }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    width 100%
    height 100%
    background #f5f5f5

</style>
