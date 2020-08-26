<template>
  <section class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" :class="{on: !loginWay}" @click="loginWay=false">短信登录</a>
          <a href="javascript:;" :class="{on: loginWay}" @click="loginWay = true">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on: !loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button :disabled="!rightphone" class="get_verification"
                      :class="{right_phone:rightphone}" @click.prevent="getCode">
                {{computeTime>0 ? `已发送(${computeTime}s)`:'获取验证码'}}
              </button>
            </section>
            <section class="login_verification">
              <input type="tel" maxlength="6" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: loginWay}">
            <section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="password" maxlength="8" placeholder="密码" v-if="!isShow" v-model="pwd">
                <input type="text" maxlength="8" placeholder="密码" v-else="isShow" v-model="pwd">
                <div class="switch_button" :class="isShow?'on':'off'"  @click="isShow=!isShow">
                  <div class="switch_circle" :class="{right:isShow}"></div>
                  <span class="switch_text" >{{isShow?'abc':'...'}}</span>
                </div>
              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img class="get_verification" src="http://localhost:4000/captcha"
                     @click="getCaptcha" id="img" alt="captcha">
              </section>
            </section>
          </div>
          <button class="login_submit" >登录</button>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <a href="javascript:" class="go_back" @click="$router.back()">
        <i class="iconfont icon-jiantou2"></i>
      </a>
    </div>
    <AlertTip :alertText="alertText" v-show="showTip" @closeTip="closeTip"></AlertTip>
  </section>
</template>

<script>
  import  AlertTip from '../../components/AlertTip/AlertTip'
  import {reqSmsLogin,reqPwdLogin,reqSendCode} from '../../api'


    export default {
    components:{
      AlertTip
    },
      data(){
        return{
          loginWay :true,  //密码登录为true      短信登陆为flase
          phone:'',//登录的手机号码
          code:'',//短信验证码
          computeTime:0,//发送验证码的计时时间
          isShow:false,//切换显示或者隐藏密码
          pwd:'',//输入的密码
          name:'',//用户名
          captcha:'',//用户名登录验证码图片验证码
          alertText : '',//弹出的对话框提示文本
          showTip : false,//一开始不弹出

        }
      },
      computed:{
        rightphone(){
          return /^1\d{10}$/.test(this.phone)
        },

      },
      methods:{
        //获取一次性短信验证码
        async getCode(){
         // alert('hello')
          //发送验证码倒计时
          if (this.computeTime==0){
            this.computeTime = 30
            this.intervalId=setInterval(()=>{
              if(this.computeTime<=0) {
                // 停止计时
                clearInterval(this.intervalId)
              }
            },1000)
          }
          //异步发送ajax请求获得验证码
          const result = await reqSendCode(this.phone)
          //验证码发送失败
          if (result.code===1){
            this.showTip = true
            //显示提示
            this.alertText = result.msg
            //倒计时为零
            if(this.computeTime) {
              this.computeTime = 0
              clearInterval(this.intervalId)
              this.intervalId = undefined
            }
          }

        },
        //获取动态一次性图片验证码
        getCaptcha(){
          document.getElementById("img").src="http://localhost:4000/captcha?"+Math.random();
          //this.getElementById('img').src = "http://localhost:4000/captcha?"+Math.random();
        },
        /*showAlert(alertText) {
          this.showTip = true
          this.alertText = alertText
        },*/
        //异步登录
          async  login(){
          //前台表单验证
          if (!this.loginWay){//短信验证码登录
             const {phone,code} = this
            if (!/^1\d{10}$/.test(phone)){
             /* this.showAlert('手机号不正确')*/
              this.showTip=true
              this.alertText='手机号不正确'
              return
            }else if(!/^\d{6}$/.test(code)){
              /*this.showAlert('验证必须是6位数字')*/
              this.showTip=true
              this.alertText='验证必须是6位数字'
              return
            }
             //异步发送ajax请求短信登陆
            const result = await reqSmsLogin(this.phone,this.code)
            // 停止计时
            if(this.computeTime) {
              this.computeTime = 0
              clearInterval(this.intervalId)
              this.intervalId = undefined
            }
            if (result.code === 1){
              this.showTip=true
              this.alertText=result.msg
            } else {
              //将登陆的用户数据保存到vuex的state中去
              const user = result.data
              this.$store.dispatch('recordUsers',user)
              //跳转到个人中心界面
              this.$router.replace('/msite')
            }

          } else {//用户密码登录
            const {name,pwd,captcha}=this
            if (!this.name){
              this.showTip=true
              this.alertText='用户名必须指定'
              return

            } else if (!this.pwd){
              this.showTip=true
              this.alertText='密码必须指定'
              return
            } else if (!this.captcha) {
              this.showTip=true
              this.alertText='验证码必须指定'
              return
            }
            //异步发送ajax请求用户名登陆
            const result = await reqPwdLogin({name,pwd,captcha})
            if (result.code === 1){
              //显示新的图片验证码
              this.getCaptcha()
              //弹出文本提示
              this.showTip=true
              this.alertText=result.msg
            } else {
              //将登陆的用户数据保存到vuex的state中去
              const user = result.data
              this.$store.dispatch('recordUsers', user)
              //跳转到个人中心界面
              this.$router.replace('/msite')
            }

          }
        },
        // 关闭警告框
        closeTip () {
          this.showTip = false
          this.alertText=''
        },


      },


    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                 color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle

                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(27px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
