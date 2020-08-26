/*
通过mutations间接更新state的多个方法
*/
import {RECEIVE_ADDRESS, RECEIVE_CATEGORYS, RECEIVE_SHOPS,} from './mutations-types'
import {reqAddress,reqFoodCategorys,reqShops} from '../api'
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

}
