<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" :alt="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <p class="name">{{seller.name }}</p>
        </div>
        <div class="description">
          <p>{{seller.description}}/{{seller.deliveryTime}}分钟送达</p>
        </div>
        <div v-if="seller.supports" class="supports">
          <p class="text" :class="classMap[seller.supports[0].type]">{{seller.supports[0].description}}</p>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <span class="icon-font icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <p class="bulletin-text">{{seller.bulletin}}</p>
      <span class="icon-font icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar" alt="">
    </div>
    <transition name="fade">
    <div class="detail" v-show="detailShow" >
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper"><star :size="48" :score="seller.score"></star></div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li v-for="item in seller.supports" class="supports-item" :class="classMap[item.type]">{{item.description}}</li><!-- :class="classMap[seller.support[$index]]" -->
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <p class="bulletin">{{seller.bulletin}}</p>
        </div>
      </div>
      <div class="detail-close sticky-footer">
        <i class="icon-close" @click="hideDetail"></i><!-- v-on:click 缩写成 @click-->
      </div>
    </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star'
  export default {
    name: 'header',
    props: {
      seller: {
        type: Object
      }
    },
    data: function () {
      return {
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        detailShow: false
      }
    },
    methods: {
      showDetail () {
        this.detailShow = true
      },
      hideDetail () {
        this.detailShow = false
      }
    },
    components: {
      star: star  // 注册组件
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import '../../common/style/base.scss';
  .header{
    width:100%;
    height:2.68rem;
    position: relative;
    overflow:hidden;
    color:#fff;
    .content-wrapper{
      padding: .48rem .24rem .36rem .48rem;
      font-size:0;
      overflow:hidden;
      position:relative;
      .avatar {
        width:1.28rem;
        height:1.28rem;
        float:left;
        img{
          width:100%;
          height:100%;
          border-radius:.04rem;
        }
      }
      .content{
        float: left;
        margin-left: .32rem;
        .title .name{
          @include bg-img('brand');
          background-size: .6rem .36rem;
          background-position:left center ;
          background-repeat:no-repeat;
          margin-top:.04rem;
          font-size: .32rem;
          font-weight: bold;
          line-height: .3rem;
          text-indent: .72rem;
        }
        .description{
          font-size: .24rem;
          line-height: .56rem;
        }
        .supports{
          .text{
            font-size: .2rem;
            line-height: .34rem;
            text-indent: .32rem;
            background-size: .24rem .24rem;
            background-position:left center ;
            background-repeat:no-repeat;
          }

        }
      }
      .support-count{
        width:.86rem;
        height: .48rem;
        position: absolute;
        right:.24rem;
        bottom:.36rem;
        font-size: 0;
        line-height: .48rem;
        border-radius: .24rem;
        text-align: center;
        background: rgba(0,0,0,0.2);
        .count,.icon-font{
          font-size: .24rem;
        }
      }
    }

    .bulletin-wrapper{
      font-size: .2rem;
      padding:0 .24rem;
      height: .56rem;
      line-height: .56rem;
      background: rgba(7,17,27,0.2);
      .bulletin-text{
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width:6.72rem;
        line-height: .56rem;
        text-indent: .52rem;
        @include bg-img('bulletin');
        background-size: .44rem .24rem;
        background-repeat:no-repeat ;
        background-position: left center ;
      }
      .icon-font{
        height:.56rem;
        line-height: .56rem;
        position: absolute;
        right:.24rem;
      }
    }
    .background{
      position: absolute;
      left:0;
      bottom:0;
      width:100%;
      height:100%;
      z-index: -1;
      img{
        width:100%;
        height:100%;
        filter: blur(10px) brightness(60%) ;
      }
    }
    /* 详情浮层 */
    .detail{
      position: fixed;
      z-index: 100;
      width:100%;
      height:100%;
      top:0;
      left:0;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      background: rgba(7,17,27,.8);
      backdrop-filter: blur(10px);
      /*filter:blur(10px);*/
      &.fade-enter,&.fade-leave-active{
        opacity: 0;
      }
      &.fade-enter-active,&.fade-leave-active{
        transition: opacity .8s;
      }
      .detail-wrapper{
        min-height: 100%;
        width:100%;
        .detail-main{
          padding:1.28rem 0;
          .name{
            text-align: center;
            font-size: .32rem;
            font-weight: 700;
          }
          .star-wrapper{
            text-align: center;
            margin:.32rem 0 .56rem 0;
            padding:.04rem 0;
          }
          .title{
            width:80%;
            display: flex;
            margin: auto;
            .line{
              flex:1;
              position: relative;
              top:-0.12rem;
              border-bottom: 1px solid rgba(255,255,255,0.2);
            }
            .text{
              padding:0 .24rem;
              font-weight: 700;
            }
          }
          .supports{
            padding: 0 .96rem;
            font-size: .24rem;
            font-weight: 100;
            line-height: .56rem;
            margin: .48rem 0;
            li{
              text-indent: .44rem;
              font-weight: 200;
              background-repeat: no-repeat ;
              background-position: left center;
              background-size: .32rem;
            }
          }
          .bulletin{
            padding: 0 .96rem;
            font-size: .24rem;
            font-weight: 200;
            margin: .48rem 0;
            line-height: .48rem;
          }
        }
      }
      .detail-close{
        width:.64rem;
        height:.64rem;
        font-size: .64rem;
        margin:-1.28rem auto 0;
        clear: both;
      }
    }
    /* 促销信息的图标 */
    .decrease{
      @include bg-img('decrease_1');
    }
    .discount{
      @include bg-img('discount_1');
    }
    .guarantee{
      @include bg-img('guarantee_1');
    }
    .invoice{
      @include bg-img('invoice_1');
    }
    .special{
      @include bg-img('special_1');
    }
  }
</style>

