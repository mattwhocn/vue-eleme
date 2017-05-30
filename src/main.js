// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Goods from './components/goods/goods.vue'
import Ratings from './components/ratings/ratings.vue'
import Seller from './components/seller/seller.vue'

import App from './App'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueResource)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/goods'
    }, {
      path: '/goods',
      name: 'Goods',
      component: Goods
    }, {
      path: '/ratings',
      name: 'Ratings',
      component: Ratings
    }, {
      path: '/seller',
      name: 'Seller',
      component: Seller
    }
  ],
  linkActiveClass: 'active'
})

// 自定义指令要写着vue实例化对象之前
Vue.directive('dom', {
  inserted: function (el, vm) {
    return vm.arg
  }
})

/* eslint-disable no-new */
// 实例化vue对象
new Vue({
  el: '#app',
  router: router,
  ...App  // ... es6 扩展运算符
})

// rem布局适应屏幕大小
document.documentElement.style.fontSize = innerWidth / 7.5 + 'px'
window.onresize = function () {
  document.documentElement.style.fontSize = innerWidth / 7.5 + 'px'
}
