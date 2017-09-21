<template>
  <transition name="move">
    <div class="food" v-show="showFlag">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="icon-back" @click="closeDetail">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <p class="detail">月售{{food.sellCount}}份&ensp;&ensp;好评率{{food.rating}}%</p>
          <div class="price">
            <span class="new"><i>¥</i>{{food.price}}</span>
            <span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <div class="food-info" v-show="food.info">
          <h3 class="title">商品介绍</h3>
          <p class="text">{{food.info}}</p>
        </div>
        <div class="ratings">
          <h3 class="title">商品评价</h3>
          <ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li class="rating-item border-line" v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" :src="rating.avatar" :alt="rating.avatar">
              </div>
              <div class="time">{{rating.rateTime | formatData}}</div>
              <p class="text">
                <span class="thumb" :class="{'icon-thumb_up':rating.rateType == 0,'icon-thumb_down':rating.rateType == 1}"></span>
                <span class="rating-text">{{rating.text}}</span>
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
        <div class="padding"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
//  const POSITIVE = 0
//  const NEGATIVE = 1
  const ALL = 2
  import cartcontrol from '@/components/cartcontrol/cartcontrol'
  import ratingselect from '@/components/ratingselect/ratingselect'
  import {formatData} from '@/common/js/date.js'
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data () {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽2333'
        }
      }
    },
    created: function () {
      // 监听子组件的自定义事件
      var _this = this
      this.$root.eventHub.$on('ratingType.select', function (type) {
        _this.selectType = type
        _this.$nextTick(function () {
          _this.foodDetailScroll && _this.foodDetailScroll.refresh()
        })
      })
      this.$root.eventHub.$on('content.toggle', function (onlyContent) {
        _this.onlyContent = onlyContent
        _this.$nextTick(function () {
          _this.foodDetailScroll && _this.foodDetailScroll.refresh()
        })
      })
    },
    methods: {
      // 供父组件调用 一般组件私有的方法加下划线_,可以被父组件调用的直接写函数名
      showFoodDetail: function () {
        this.showFlag = true

        this.selectType = ALL // 每次初始化这个页面的时候都把selectType置为all
        this.onlyContent = false

        console.log(this.food)
        this.$nextTick(() => { // 在nextTick时才能保证dom是被渲染出来的,高度是可以获得的
          if (!this.foodDetailScroll) {
            this.foodDetailScroll = new BScroll(document.querySelector('.food'), {
              click: true
            })
          } else {
            this.foodDetailScroll.refresh()
          }
        })
      },
      closeDetail: function () {
        this.showFlag = false
      },
      addFirst: function (event) {
        if (!event._constructed) {
          return  // bscroll 注册的点击事件,放置自带的点击事件造成多次点击
        }
        Vue.set(this.food, 'count', 1)  // 给vue的food加入的字段添加观测
      },
      needShow: function (type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else if (this.selectType === type) {
          return true
        } else {
          return false
        }
      }
    },
    filters: {
      formatData: function (time) {
        let date = new Date(time)
        return formatData(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      cartcontrol: cartcontrol,
      ratingselect: ratingselect
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import '../../common/style/base.scss';

  .food{
    width:100%;
    height:100%;
    position: fixed;
    left:0;
    top:0;
    z-index: 6;
    background: #f2f5f7;
    &.move-enter{
       transform: translate3d(100%,0,0);
    }
    &.move-enter-active{
       transition: all 0.2s linear;
    }
    &.move-leave{

    }
    &.move-leave-active{
       transition: all 0.2s linear;
       transform: translate3d(100%,0,0);
     }
    .image-header{
      width:100%;
      position: relative;
      height:0;
      /* padding 如果设置为百分比的话是相对于盒子的宽度计算的百分比,得到一个宽高相等的容器 */
      padding-top:100%;
      img{
        width:100%;
        height:100%;
        position: absolute;
        left:0;
        top:0;
      }
      .icon-back{
        position: absolute;
        top:.2rem;
        left:.2rem;
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
        background: rgba(0,0,0,.8);
        .icon-arrow_lift{
          display: block;
          font-size: .36rem;
          line-height: .8rem;
          text-align: center;
          color: #fff;
        }
      }
    }
    .content{
      padding:.36rem;
      border-bottom: 1px solid rgba(7,17,27,0.1);
      background: #fff;
      margin-bottom: .32rem;
      position: relative;
      .title{
        font-size: .28rem;
        line-height: .28rem;
        font-weight: 700;
        color: rgb(7,17,27);
      }
      .detail{
        font-size: .2rem;
        line-height: .52rem;
        color: rgb(147,153,159);
      }
      .price{
        font-weight: 700;
        margin-top: .16rem;
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
      .cartcontrol-wrapper{
        position: absolute;
        right: .20rem;
        bottom: .20rem;
      }
      .buy{
        position: absolute;
        right:.36rem;
        bottom:.36rem;
        width:1.48rem;
        height:.48rem;
        border-radius: .24rem;
        background: rgb(0,160,220);
        color: #fff;
        font-size: .2rem;
        text-align: center;
        line-height: .48rem;
        &.fade-enter{
           opacity: 0;
         }
        &.fade-enter-active{
           transition: all 0.2s;
           opacity: 1;
         }
        &.fade-leave{
           opacity: 1;
        }
        &.fade-leave-active{
          transition: all 0.2s;
          opacity: 0;
        }
      }
    }
    .food-info{
      background: #fff;
      padding: .24rem .36rem;
      border-top:1px solid rgba(7,17,27,0.1);
      border-bottom:1px solid rgba(7,17,27,0.1);
      margin-bottom: .32rem;
      .title{
        line-height: .52rem;
        font-size: .28rem;
        color: rgb(7,17,27);
      }
      .text{
        color: rgb(77,85,93);
        line-height: .48rem;
        font-size: .24rem;
      }
    }
    .ratings{
      background: #fff;
      padding: .24rem .36rem 0;
      border-top:1px solid rgba(7,17,27,0.1);
      border-bottom:1px solid rgba(7,17,27,0.1);
      .title{
        line-height: .52rem;
        font-size: .28rem;
        color: rgb(7,17,27);
      }
    }
    .rating-wrapper{
      padding: 0 .36rem;
      background: #fff;
      .rating-item{
        padding:.32rem 0;
        position: relative;
        @include border-line(rgba(7,17,27,0.1));
        .user{
          position: absolute;
          right:0;
          top:.32rem;
          font-size: 0;
          .name{
            display: inline-block;
            color: rgb(147,153,159);
            font-size: .2rem;
            line-height: .24rem;
          }
          img.avatar{
            width:.24rem;
            height:.24rem;
            margin-left: .12rem;
            border-radius: 50%;
            vertical-align: top;
          }
        }
        .time{
          color: rgb(147,153,159);
          font-size: .2rem;
          line-height: .4rem;
        }
        .text{
          font-size: .24rem;
          .rating-text{
            color: rgb(7,17,27);
            line-height: .32rem;
          }
          .thumb{
            line-height: .48rem;
            &.icon-thumb_up{
               color: rgb(0,160,220);
            }
            &.icon-thumb_down{
              color: rgb(147,153,159);
            }
          }
        }
        &:last-child{
          @include border-none();
         }
      }
      .no-rating{
        font-size: .24rem;
        padding: .36rem 0;
        color: rgb(147,153,159);
      }
    }
    .padding{
      height:.96rem;

    }
  }
</style>
