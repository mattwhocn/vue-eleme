<template>
  <div class="ratings">
      <div class="ranking">
        <div class="left">
          <p class="score">{{seller.score}}</p>
          <p class="desc">综合评分</p>
          <p class="above">高于周边商家{{seller.rankRate}}%</p>
        </div>
        <div class="right">
          <div class="service-score right-item">
            <p class="name">服务态度</p>
            <p class="star"><star :size="36" :score="seller.serviceScore"></star></p>
            <p class="score">{{seller.serviceScore}}</p>
          </div>
          <div class="food-score right-item">
            <p class="name">服务态度</p>
            <p class="star"><star :size="36" :score="seller.foodScore"></star></p>
            <p class="score">{{seller.serviceScore}}</p>
          </div>
          <div class="delivery-time right-item">
            <span>送达时间</span>{{seller.deliveryTime}}分钟
          </div>
        </div>
      </div>
      <div class="ratings-wrap">
        <div class="ratingselect-wrap">
          <ratingselect :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings" :desc="desc"></ratingselect>
        </div>
        <div class="ratings-list">
          <ul>
            <li v-for="rating in ratings">
              <div class="avatar"><img width="28px" height="28px" :src="rating.avatar" alt=""></div>
              <div class="right">
                <div class="info">
                  <p class="username">{{rating.username}}</p>
                  <p class="star">
                    <star :size="36" :score="rating.score"></star>
                    <span>{{rating.deliveryTime}}分钟送达</span>
                  </p>
                  <p class="time">{{rating.rateTime}}</p>
                </div>
                <div class="text">
                  <p>{{rating.text}}</p>
                </div>
                <div class="recommends" v-if="rating.recommend">
                  <p v-for="recommend in rating.recommend">{{recommend}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const ALL = 2
  import star from '@/components/star/star'
  import ratingselect from '@/components/ratingselect/ratingselect'
  const ERR_NO = 0
  export default{
    data: function () {
      return {
        ratings: {},
        seller: {},
        onlyContent: false,
        selectType: ALL,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    created: function () {
      this.$http.get('api/ratings').then(function (res) {
        if (res.body.code === ERR_NO) {
          this.ratings = res.body.data
        }
      })
      this.seller = this.$root.seller
    },
    components: {
      star,
      ratingselect
    }
  }
</script>

<style lang="scss" type="text/scss">
  .ratings{
    background: #f3f5f7;
  }
  .ranking{
    margin-bottom: .36rem;
    background: #fff;
    border-bottom: 1px solid #e6e7e8;
    display: flex;
    padding: .36rem 0;
    .left{
      flex:0 0 2.57rem;
      border-right:1px solid #e6e7e8;
      p{
        text-align: center;
      }
      .score{
        font-size: .48rem;
        color: rgb(255,153,0);
        line-height: .56rem;
        margin-bottom: .12rem;
      }
      .desc{
        color: rgb(7,17,27);
        font-size: .24rem;
        line-height: .24rem;
        margin-bottom: .16rem;
      }
      .above{
        color: rgb(147,153,159);
        font-size: .2rem;
        line-height: .2rem;
        margin-bottom: .12rem;
      }
    }
    .right{
      flex:1;
      line-height: .30rem;
      font-size: .24rem;
      color: rgb(7,17,27);
      padding:0 .48rem;
      .right-item{
        margin: .06rem 0 .12rem;
        &:last-child{
          margin-bottom: .06rem;
         }
      }
      .name,.star,.score{
        display: inline-block;
        vertical-align: top;
      }
    }
  }
  .ratings-wrap{
    border-top: 1px solid #e6e7e8;
    background: #fff;
    .ratingselect-wrap{
      padding:0 .36rem;
      border-bottom: 1px solid #e6e7e8;
    }
  }
</style>
