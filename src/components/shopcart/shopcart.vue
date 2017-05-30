<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
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
  </div>
</template>

<script>
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
      return {}
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
      }
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
  }

</style>
