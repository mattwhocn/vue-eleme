<template>
  <div class="goods" >
    <div class="menu-wrapper" id="menu-wrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{current:index==currentIndex}" @click="selectMenu(index,$event)">
          <span class="text border-line"><i class="icon" v-show="item.type>0" :class="classMap[item.type]"></i>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" id="food-wrapper">
      <ul>
        <li v-for="item in goods"  class="food-list food-list-hook" >
          <h3 class="title">{{item.name}}</h3>
          <ul>
            <li v-for="food in item.foods" class="food-item border-line">
              <div class="icon"><img :src="food.icon" alt=""></div>
              <div class="content">
                <h4 class="name">{{food.name}}</h4>
                <div class="disc" v-if="food.description">{{food.description}}</div>
                <div class="extra"><span>月售{{food.sellCount}}份</span>&ensp;&ensp;<span>好评率{{food.rating}}%</span></div>
                <div class="price"><span class="new"><i>¥</i>{{food.price}}</span><span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span></div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
</template>

<script>
  import BetterScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart'
  const ERR_NO = 0
  export default({
    props: {  // 引入的其他数据
      seller: {
        type: Object
      }
    },
    data: function () {   // 自己创建的数据
      return {
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        goods: [],
        listHeight: [],
        scrollY: 0
      }
    },
    created () {    // 钩子函数 在创建vue实例的时候改变数据
      this.$http.get('api/goods').then(function (res) {
        res = res.body
        if (res.code === ERR_NO) {
          this.goods = res.data
          this.$nextTick(function () {
            this._initScroll()
            this._calcHeight()
          })
        }
      })
    },
    methods: {
      _initScroll: function () {
        // 实例化 betterScroll 对象
        this.menuScroll = new BetterScroll(document.querySelector('#menu-wrapper'), {
          click: true // betterScroll 默认会阻止列表内元素的点击事件
        })

        // betterScroll 提供的探针,检测滚动的位置
        this.foodScroll = new BetterScroll(document.querySelector('#food-wrapper'), {
          probeType: 3
        })
        // 通过监测 BetterScroll的实例对象 foodScroll 的scroll事件,获取滚动的值
        this.foodScroll.on('scroll', (pro) => {
          this.scrollY = Math.round(Math.abs(pro.y))
        })
      },
      _calcHeight: function () {
        // 计算右边的食品列表的高度
        let foodList = document.querySelector('#food-wrapper').querySelectorAll('.food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          height += foodList[i].clientHeight
          this.listHeight.push(height)
        }
        console.log(this.listHeight)
      },
      selectMenu: function (index, event) {
        if (!event._constructed) { // butterscroll 默认阻止了点击事件,再重新定义了点击事件,但是在pc端,阻止不掉点击事件,就会执行两次点击事件,bscroll 的点击事件有一个_constructed 属性,用来区分是原生的点击事件还是bscroll 注册的点击数事件
          return
        }
        let foodElement = document.querySelector('#food-wrapper').querySelectorAll('.food-list-hook')[index]
        this.foodScroll.scrollToElement(foodElement, 300)
        console.log(index)
        console.log(event)
      }
    },
    computed: {
      // Vue检测到数据发生变动时就会执行对相应数据有引用的函数。
      currentIndex: function () {
        for (let i = 0; i < this.listHeight.length; i++) {
          if (!this.listHeight[i + 1] || this.scrollY >= this.listHeight[i] && this.scrollY < this.listHeight[i + 1]) {
            return i
          }
        }
        return 0
      }
    },
    components: {
      shopcart: shopcart
    }
  })
</script>

<style lang="scss" type="text/scss">
  @import "../../common/style/base.scss";
  .goods{
    position: absolute;
    display: flex;
    overflow: hidden;
    top:3.47rem;
    bottom:.96rem;
    width:100%;
    .menu-wrapper{
      flex: 0 0 1.6rem;
      width: 1.6rem;
      background: #f3f5f7;
      .menu-item{
        height: 1.08rem;
        width:100%;
        padding: 0 .24rem;
        display: table;
        &.current{
          background: #fff;
          font-weight: 500;
          position:relative;
          margin: -1px;
          .text{
            @include border-none();
          }
        }
        .text{
          font-size: .24rem;
          line-height: .28rem;
          font-weight: 200;
          width:100%;
          vertical-align: middle;
          display: table-cell;
          @include border-line(rgba(7,17,27,0.1));
        }
        .icon{
          display: inline-block;
          vertical-align: top;
          width: .24rem;
          height: .24rem;
          margin-right: .04rem;
          background-size: .24rem;
          background-repeat: no-repeat;
          &.decrease{
            @include bg-img('decrease_3');
          }
          &.discount{
            @include bg-img('discount_3');
          }
          &.guarantee{
            @include bg-img('guarantee_3');
          }
          &.invoice{
            @include bg-img('invoice_3');
          }
          &.special{
            @include bg-img('special_3');
          }
        }
      }
    }
    .foods-wrapper{
      flex:1;
      .title{
        height:.52rem;
        border-left:.04rem solid #d9dde1;
        color: rgb(147,153,159);
        font-size: .24rem;
        line-height: .52rem;
        text-indent: .24rem;
        background: #f3f5f7;
      }
      .food-item{
        display: flex;
        margin:.32rem .32rem 0;
        padding-bottom: .32rem;
        @include border-line(rgba(7,17,27,0.1));
        &:last-child{
         @include border-none();
        }
        .icon{
          flex: 0 0 1.14rem;
          img{
            width:1.14rem;
            height:1.14rem;
          }
        }
        .content{
          padding: .04rem 0 0 .2rem;
          .name{
            font-size: .28rem;
            line-height: .28rem;
            color: rgb(7,17,27);
          }
          .disc,.extra{
            font-size: .2rem;
            color: rgb(147,153,159);
            line-height: .36rem;
            margin: .08rem 0;
          }
          .price{
            font-weight: 700;
            .new{
              font-size: .28rem;
              color: rgb(240,20,20);
              i{
                font-style: normal;
                font-size: .2rem;
              }
            }
            .old{
              font-size: .2rem;
              color: rgb(147,153,159);
              margin-left: .16rem;
              text-decoration: line-through;
            }
          }
        }
      }
    }
  }
</style>
