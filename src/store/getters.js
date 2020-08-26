/*
包含多个基于state的getter的计算对象
*/
export default {

  totalCount(state){
    return state.cartFoods.reduce((preTotal, food) => preTotal + food.count , 0)
  },

  totalPrice(state){
   return state.cartFoods.reduce((preTotal, food) => preTotal + food.count*food.price , 0)
  }

}
