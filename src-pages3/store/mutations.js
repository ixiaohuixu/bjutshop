/*
直接更新state的多个方法
*/
import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  SET_USER_INFO
}
from './mutations-types'
export default {
  [RECEIVE_ADDRESS] (state, {address}) {
    state.address = address
  },
  [RECEIVE_CATEGORYS](state,{categorys}){
    state.categorys = categorys

  },
  [RECEIVE_SHOPS](state,{shops}){
    state.shops = shops

  },
  [RECEIVE_USER_INFO](state,{userInfo}){
    state.userInfo = userInfo
  },
  [SET_USER_INFO](state){
    state.userInfo = ''
  }

}
