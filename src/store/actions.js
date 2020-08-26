/*
通过mutations间接更新state的多个方法
*/
import {RECEIVE_ADDRESS, RECEIVE_CATEGORYS, RECEIVE_SHOPS,RECEIVE_USER_INFO,SET_USER_INFO,RECEIVE_SHOP_INFO,RECEIVE_SHOP_RATINGS,RECEIVE_SHOP_GOODS,INCREMENT_FOOD_COUNT,DECREMENT_FOOD_COUNT,RECEIVE_SEARCH_SHOPS,CLEAR_CART} from './mutations-types'
import {reqAddress,reqFoodCategorys,reqShops,reqUserInfo,reqLogout,reqShopGoods,reqShopRatings,reqShopInfo,reqSearchShop} from '../api'
export default {
    //异步获取地址
  async getAddress({commit,state}){
    //发送异步ajax请求
    const geohash = state.latitude +','+ state.longitude
    const result =  await reqAddress(geohash)
    if (result.code===0){
      //提交一个mutation
      const address = result.data
      commit(RECEIVE_ADDRESS, {address})
    }
  },

    //异步获取食品分类
  async getCategorys({commit}){
    //发送异步ajax请求
    const result =  await reqFoodCategorys()
    if (result.code===0){
      //提交一个mutation
      const categorys = result.data
      commit(RECEIVE_CATEGORYS,{categorys})
    }
  },

    //异步获取商家列表
  async getShops({commit,state}){
    //发送异步ajax请求
    const latitude = state.latitude
    const longitude = state.longitude
    const result =  await reqShops(longitude,latitude)
    if (result.code===0){
      //提交一个mutation
      const shops = result.data
      commit(RECEIVE_SHOPS,{shops})
    }
  },

  //同步记录用户信息
  recordUsers({commit},userInfo){
    commit(RECEIVE_USER_INFO,{userInfo})
  },

  //异步获取用户信息实现自动登录
  async getUserInfo({commit}){
    const result = await reqUserInfo()
    if (result.code===0){
      //提交mutation
      const userInfo = result.data
      commit(RECEIVE_USER_INFO,{userInfo})

    }
  },
  //异步退出登录
  async reqlogout({commit}){
    const result = await reqLogout()
    if(result.code===0){
      commit(SET_USER_INFO)

    }

  },
/*
  //异步获取商家商品信息
  async getshopgoods({commit}){
    const result = await reqShopGoods()
    if (result.code === 0) {
      //提交一个mutation
      const goods = result.data
      commit(RECEIVE_SHOP_GOODS, {goods})

    }
  },*/

  // 异步获取商家商品列表
  async getshopgoods({commit}, callback) {
    const result = await reqShopGoods()
    if (result.code === 0) {
      const goods = result.data
      commit(RECEIVE_SHOP_GOODS, {goods})
      // 数据更新了, 通知一下组件
      callback && callback()
    }
  },


  //异步获取商家的评价的列表
  async getshopratings({commit}){
    const result = await reqShopRatings()
    if (result.code === 0) {
      //提交一个mutation
      const ratings = result.data
      commit(RECEIVE_SHOP_RATINGS, {ratings})

    }
  },

  //异步获取商家的信息
  async getshopinfo({commit}){
    const result = await reqShopInfo()
    if (result.code === 0) {
      //提交一个mutation
      const info = result.data
      commit(RECEIVE_SHOP_INFO, {info})

    }
  },

  // 同步更新food中的count值
  updateFoodCount({commit}, {isAdd, food}) {
    if (isAdd) {
      commit(INCREMENT_FOOD_COUNT, {food})
    } else {
      commit(DECREMENT_FOOD_COUNT, {food})
    }
  },

  //同步清空购物车
  clearCart({commit}){
    commit(CLEAR_CART)
  },


  //异步获取searchfoods列表
  async reqSearchShops({commit,state},keyword){
    const geohash = state.latitude +','+ state.longitude
    const result = await reqSearchShop(geohash,keyword)
    if (result.code===0){
      const searchShops = result.data
      commit(RECEIVE_SEARCH_SHOPS,{searchShops})
    }
  }







}






