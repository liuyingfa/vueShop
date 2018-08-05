import Vue from 'vue'
import Vuex from 'Vuex'

Vue.use(Vuex)
let store = new Vuex.Store({
  state: {
    carPaneData: [],
    receiveInfo: [{
      'name': '王某某',
      'phone': '13811111111',
      'areaCode': '010',
      'landLine': '64627856',
      'provinceId': 110000,
      'province': '北京市',
      'cityId': 110100,
      'city': '市辖区',
      'countyId': 110106,
      'county': '海淀区',
      'add': '上地十街辉煌国际西6号楼319室',
      'default': false,
      'checked': true
    }, {
      'name': '李某某',
      'phone': '13811111111',
      'areaCode': '010',
      'landLine': '64627856',
      'provinceId': 110000,
      'province': '北京市',
      'cityId': 110100,
      'city': '市辖区',
      'countyId': 110106,
      'county': '海淀区',
      'add': '上地十街辉煌国际东6号楼350室',
      'default': true,
      'checked': false
    }],
    maxOff: false,
    showCar: false,
    carTime: null,
    ball: {
      show: false,
      el: null,
      img: ''
    },
    orderData: []
  },
  getters: {
    totalPrice(state) {
      let price = 0
      state.carPaneData.forEach((item) => {
        price += item.price * item.count
      })
      return price
    },
    totalCount(state) {
      let count = 0
      state.carPaneData.forEach((item) => {
        count += item.count
      })
      return count
    },
    checkAll(state) {
      let allCheck = true
      state.carPaneData.forEach((item) => {
        if (!item.checked) {
          allCheck = false
          return
        }
      })
      return allCheck
    },
    checkCount(state) {
      let count = 0
      state.carPaneData.forEach((item) => {
        if (item.checked) {
          count += item.count
        }
      })
      return count
    },
    checkPrice(state) {
      let price = 0
      state.carPaneData.forEach((item) => {
        if (item.checked) {
          price += item.count * item.price
        }
      })
      return price
    },
    checkedGoods(state) {
      let checkedGoods = []
      state.carPaneData.forEach((item) => {
        if (item.checked) {
          checkedGoods.push(item)
        }
      })
      return checkedGoods
    }
  },
  mutations: {
    addCarPanelDate(state, data) {
      var boff = true
      state.carPaneData.forEach((item) => {
        if (item.sku_id === data.info.sku_id) {
          item.count += data.count
          boff = false
          if (item.count > item.limit_num) {
            item.count -= data.count
            state.maxOff = true
            return
          }
          state.showCar = true
        }
      })
      if (boff) {
        let goodsData = data.info
        Vue.set(goodsData, 'count', data.count)
        Vue.set(goodsData, 'checked', true)
        state.carPaneData.push(goodsData)
        state.showCar = true
      }
      state.ball.el = event.path[0]
      state.ball.show = true
      state.ball.img = data.info.ali_image

    },
    delCarPanelDate(state, id) {
      state.carPaneData.forEach((item, index) => {
        if (item.sku_id === id) {
          state.carPaneData.splice(index, 1)
        }
      })
    },
    closePrompt(state) {
      state.maxOff = false
    },
    showCar(state) {
      clearInterval(state.carTime)
      state.showCar = true
    },
    hideCar(state) {
      state.carTime = setTimeout(() => {
        state.showCar = false
      }, 500)
    },
    plusCountHandle(state, id) {
      state.carPaneData.forEach(function (item, index) {
        if (item.sku_id == id) {
          if (item.count >= item.limit_num) return
          item.count++
        }
      })
    },
    subCountHandle(state, id) {
      state.carPaneData.forEach(function (item) {
        if (item.sku_id == id) {
          if (item.count == 1) return
          item.count--
        }
      })
    },
    checkedGoodsHandle(state, id) {
      state.carPaneData.forEach(function (item) {
        if (item.sku_id == id) {
          item.checked = !item.checked
        }
      })
    },
    checkedAllGoods(state, checked) {
      state.carPaneData.forEach((item) => {
        item.checked = !checked
      })
    },
    delCheckGoods(state) {
      //因为正循环会顶替掉数组下标
      var len = state.carPaneData.length
      while (len--) {
        if (state.carPaneData[len].checked) {
          state.carPaneData.splice(len, 1)
        }
      }
    },
    receiveSubmit(state, data) {
      //更改默认选项
      if (data.default) {
        state.receiveInfo.forEach((receive) => {
          receive.default = false
        })
      }
      state.receiveInfo.push(data)
    },
    submitOrder(state,data){
      state.orderData.unshift(data)
      //把已经购买的商品去掉
      let len =state.carPaneData.length
      while (len--){
        if(state.carPaneData[len].checked){
          state.carPaneData.splice(len,1)
        }
      }
    }

  }
})
export default store
