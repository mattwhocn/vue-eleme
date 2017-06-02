<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left" @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{highlight:totalCount>0}"><span class="icon-shopping_cart"></span></div>
          <div v-show="totalCount>0" class="num">{{totalCount}}</div>
        </div>
        <div class="price" :class="{highlight:totalPrice>0}">¥{{totalPrice}}</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <p class="pay" :class="payClass">{{payDesc}}</p>
      </div>
    </div>
    <div class="ball-container">
      <transition name="drop" v-for="ball in balls"
                  v-on:before-enter="beforeEnter"
                  v-on:enter="enter"
                  v-on:leave="leave"
                  v-bind:css="false">
        <div class="ball" v-show="hide"><div class="inner inner-hook"></div></div>
      </transition>
    </div>
    <transition name="">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content">
          <ul>
            <li class="food" v-for="food in selectFoods">
              <span class="name">{{food.name}}</span>
              <div class="price"><span>¥{{food.price*food.count}}</span></div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <div class="list-mask" v-show="listShow">

    </div>
  </div>
</template>

<script>
  import cartcontrol from '../cartcontrol/cartcontrol'
  import BetterScroll from 'better-scroll'
  export default {
    props: {
      selectFoods: {
        type: Array,
        default () {
          return [{
            price: 10,
            count: 0
          }]
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        hide: false,
        fold: true,
        balls: [{
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }],
        dropBalls: []
      }
    },
    created: function () {
      let this_ = this
      this.$root.eventHub.$on('cart.add', function (el) {
        // el 就是点击的那个cartcontrol组件 拿到 cartcontrol 组件的元素只是为了获取其位置
        console.log(el)
        // 遍历balls 拿到一个show 为false的球,执行动画
        for (let i = 0; i < this_.balls.length; i++) {
          let ball = this_.balls[i]
          if (!ball.show) {
            ball.show = true  // 当置show为true时才执行动画
            ball.el = el  // 把当前点击元素对象赋值给drop[i]
            this_.dropBalls.push(ball)
            return
          }
        }
      })
    },
    computed: {
      totalPrice: function () {
        let total = 0
        this.selectFoods.forEach((food, index) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount: function () {
        let count = 0
        this.selectFoods.forEach((food, index) => {
          count += food.count
        })
        return count
      },
      payDesc: function () {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          return `还差¥${this.minPrice - this.totalPrice}元起送`
        } else {
          return '去结算'
        }
      },
      payClass: function () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      listShow: function () {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        if (!this.fold) {
          this.$nextTick(function () {
            console.log(this.scroll)
            if (!this.scroll) {
              this.scroll = new BetterScroll(document.querySelector('.list-content'), {click: true})
            } else {
              this.scroll.refresh()
            }
          })
        }
        return !this.fold
      }
    },
    methods: {
      'beforeEnter': function (el) {
        console.log(el)
        // el 指的是执行动画的dom对象
        // js形式的过渡动画,写在动画的钩子函数中
        // 有可能连续点击,所以要循环所有的show为true的小球
        let counts = this.balls.length
        while (counts--) {
          let ball = this.balls[counts]
          if (ball.show) {  // 将要进行运动的小球
            let rect = ball.el.getBoundingClientRect() // 元素相对于视窗的高度--即使小球将要开始运动的位置
            let x = rect.left - 32 // 小球要运动的x方向的距离
            let y = -(window.innerHeight - rect.top - 22) // 小球要运动的y方向的距离
            console.log(x)
            console.log(y)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0,${y},0)`
            el.style.transform = `translate3d(0,${y},0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            console.log(inner)
            inner.style.webkitTransform = `translate3d(${x},0,0)`
            inner.style.transform = `translate3d(${x},0,0)`
          }
        }
      },
      'enter': function (el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight  // 这一句就是触发浏览器的重绘,在动画执行完成之后让小球还原
        this.$nextTick(function () {  // 在dom更新之后把小球的样式重置
          el.style.display = ''
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
        })
      },
      'leave': function (el) {
        // 做完一个动画,把动画的balls元素的show置为false
        var ball = this.dropBalls.shift()
        if (ball.show) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      'toggleList': function () {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      empty: function () {
        this.selectFoods.forEach(function (food) {
          food.count = 0
        })
      }
    },
    components: {
      cartcontrol: cartcontrol
    }
  }
</script>

<style lang="scss" type="text/scss">
  .shopcart{
    position: fixed;
    left:0;
    bottom:0;
    width:100%;
    z-index: 9;
    background: cyan;
    height:.96rem;
    .content{
      display: flex;
      box-sizing: border-box;
      background: #141d27;
      .content-left{
        flex:1;
        font-size: 0;
        .logo-wrapper{
          display: inline-block;
          position: relative;
          top: -0.2rem;
          margin: 0 .24rem;
          padding:.12rem;
          width: 1.12rem;
          height: 1.12rem;
          background: #141d27;
          border-radius: 50%;
          vertical-align: top;
          font-size: .32rem;
          .logo{
            width:100%;
            height:100%;
            border-radius: 50%;
            text-align: center;
            background: #2c343d;
            &.highlight{
              background: rgb(0,160,220);
              span{
                color: #fff;
              }
            }
            span{
              font-size: .48rem;
              color: #80858b;
              line-height: .88rem;
            }
          }
          .num{
            position: absolute;
            top:0;
            right:0;
            width: .48rem;
            height:.32rem;
            line-height: .32rem;
            text-align: center;
            border-radius: .32rem;
            font-size: .18rem;
            color: #fff;
            background: rgb(240,20,20);
            box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
          }
        }
        .price{
          display: inline-block;
          vertical-align: top;
          line-height: .48rem;
          margin-top:.24rem;
          padding-right: .24rem;
          border-right: 1px solid rgba(255,255,255,.1);
          font-size: .32rem;
          font-weight: 700;
          color: #72777d;
          &.highlight{
             color: #fff;
          }
        }
        .desc{
          display: inline-block;
          vertical-align: top;
          line-height: .48rem;
          margin:.24rem 0 0 .24rem;
          font-size: .2rem;
          color: rgba(255,255,255,.4);
        }
      }
      .content-right{
        flex: 0 0 2.1rem;
        font-size: .28rem;
        color: #7a7f84;
        .pay{
          line-height: .96rem;
          height: .96rem;
          text-align: center;
          font-weight: 700;
          &.not-enough{
            background: #2b333b;
          }
          &.enough{
            background: #00b43c;
            color: #fff
          }
        }
      }
    }
    .ball-container{
      .ball{
        position: fixed;
        left:.64rem;
        bottom: .44rem;
        transition: all .4s;
        .inner{
          width:.32rem;
          height:.32rem;
          border-radius: 50%;
          background: rgb(0,160,220);
          transition: all .4s;
        }
        &.drop-enter{

        }
      }
    }
    .shopcart-list{
      position: absolute;
      bottom:0;
      left:0;
      z-index: -1;
      width:100%;
      &.fold-enter{
         transform: translate3d(0,0,0);
      }
      &.fold-enter-active{
        transition: all .5s;
        transform: translate3d(0,-100%,0);
      }

    }
    .list-header{
      height:.8rem;
      font-size: .28rem;
      background: #f3f5f7;
      padding:0 .36rem;
      line-height: .8rem;
      border-bottom: 1px solid rgba(7,17,27,0.1);
      .title{
        float: left;
        font-size: .28rem;
        color: rgb(7,17,27);
      }
      .empty{
        float: right;
        color: rgb(0,160,220);
        font-size: .24rem;
      }
    }
    .list-content{
      background: #fff;
      padding:0 .36rem;
      max-height:4.34rem;
      overflow: hidden;
      margin-bottom: 0.96rem;
      li.food{
        position: relative;
        box-sizing: border-box;
        height:.96rem;
        border-bottom: 1px solid rgba(7,17,27,0.1);
        .name{
          line-height: .96rem;
          font-size: .28rem;
          color: rgb(7,17,27);
        }
        .price{
          position: absolute;
          right:2rem;
          bottom:.24rem;
          line-height: .48rem;
          font-weight: 700;
          color: rgb(240,20,20);
        }
        .cartcontrol-wrapper{
          position: absolute;
          right:0;
          bottom: .06rem;
        }
      }
    }
    .list-mask{
      width:100%;
      height:13.36rem;
      background: rgba(7,17,27,0.6);
      position: fixed;
      top:0;
      left:0;
      z-index: -2;
    }
  }

</style>
