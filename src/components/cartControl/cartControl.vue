<template>
  <div class="cartcontrol">
    <!--把需要加入动画的div放入transition中-->
    <transition name="roll">
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
        <i class="icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add" @click="addCart"><i class=" icon-add_circle"></i></div>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {}
    },
    created: function () {
      console.log(this.food)
    },
    methods: {
      addCart: function (event) {
        if (!event._constructed) { // 没有_constructed 代表是原生的点击事件,betterScroll 阻止了默认的点击事件,自己添加了点击事件
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)  // 在新增的字段也让vue 自动检测数值的变化
        } else {
          this.food.count++
        }

        // 调用控制中心绑定事件
        this.$root.eventHub.$emit('cart.add', event.target)
      },
      decreaseCart: function () {
        console.log('click')
        if (!event._constructed) { // 没有_constructed 代表是原生的点击事件,betterScroll 阻止了默认的点击事件,自己添加了点击事件
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  .cartcontrol{
    font-size: 0;
    .cart-decrease,.cart-add,.cart-count{
      display: inline-block;
      padding:.12rem;
      font-size: .48rem;
      line-height: .48rem;
      color: rgb(0,160,220);
    }
    .cart-count{
      vertical-align: top;
      text-align: center;
      font-size: .2rem;
      color: rgb(147,153,159);
    }
    .cart-decrease{
      &.roll-enter{
        opacity: 0;
        transform: translate3D(0,0,0);
      }
      &.roll-enter-active{
         opacity: 0;
         transform: translate3D(0,0,0);
      }
      &.roll-leave{
      }
      &.roll-leave-active{
      }
    }
  }
</style>
