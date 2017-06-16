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
        <div class="ratings-list-wrap">
          <ul class="ratings-list">
            <li v-for="rating in ratings" class="rating-item border-line">
              <div class="top">
                <div class="avatar"><img :src="rating.avatar" alt=""></div>
                <div class="info">
                  <p class="username">{{rating.username}}</p>
                  <p class="star-time">
                    <span class="star-wrap"><star :size="24" :score="rating.score"></star></span>
                    <span class="delivery-time">{{rating.deliveryTime}}分钟送达</span>
                  </p>
                </div>
                <p class="time">{{rating.rateTime | formatData}}</p>
              </div>
              <div class="bottom">
                <div class="text">
                  <p>{{rating.text}}</p>
                </div>
                <div class="recommends" v-if="rating.recommend">
                  <p class="thumb icon-thumb_up"></p>
                  <p class="recommend" v-for="recommend in rating.recommend">{{recommend}}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '@/components/star/star'
  import ratingselect from '@/components/ratingselect/ratingselect'
  import {formatData} from '@/common/js/date.js'
  const ERR_NO = 0
  export default{
    data: function () {
      return {
        ratings: [],
        seller: {},
        onlyContent: false,
        selectType: 2,
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

      // 监听子组件的事件
      var _this = this
      console.log(this.$root.eventHub)
      this.$root.eventHub.$on('ratingType.select', function (type) {
        _this.selectType = type
        _this.$nextTick(function () {
          _this.foodDetailScroll.refresh()
        })
      })
    },
    filters: {
      formatData: function (time) {
        var date = new Date(time)
        return formatData(date, 'yyyy-MM-dd hh:mm')
      }
    },
    components: {
      star,
      ratingselect
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import "../../common/style/base.scss";
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
    .ratings-list{
      padding: 0 .36rem;
      .rating-item{
        padding: .36rem 0;
        @include border-line(rgba(7,17,27,0.1));
        .top{
          display:flex;
          position:relative;
          .avatar{
            flex: 0 0 .56rem;
            width:.56rem;
            height: .56rem;
            img{
              width:100%;
              height:100%;
              border-radius: 50%;
            }
          }
          .info{
            flex:1;
            margin-left: .24rem;
            .username{
              font-size: .2rem;
              color: rgb(7,17,27);
              line-height: .24rem;
              margin-bottom: .08rem;
            }
            .star-time{
              line-height: .2rem;
              span{
                display: inline-block;
                vertical-align: top;
                &.delivery-time{
                    color: rgb(147,153,159);
                    font-size: .2rem;
                    font-weight: 200;
                }
              }
            }
          }
          .time{
            position: absolute;
            right:0;
            top:0;
            color: rgb(147,153,159);
            font-size: .2rem;
            font-weight: 200;
            line-height: .24rem;
          }
        }
        .bottom{
          margin-top: .12rem;
          padding-left:.8rem;
          .text{
            font-size: .24rem;
            color: rgb(7,17,27);
            line-height: .36rem;
          }
          .recommends{
            margin-top: .16rem;
            overflow: hidden;
            p{
              float: left;
              line-height: .32rem;
            }
            .thumb{
              font-size: .18rem;
              color: rgb(147,153,159);
              line-height: .32rem;

              /**/
              /*font-size: .24rem;*/
              /*color: rgb(0, 160, 220);*/
              /*line-height: .32rem;*/

            }
            .recommend{
              padding:0 .12rem;
              font-size: .18rem;
              margin-left: .16rem;
              color: rgb(147,153,159);
              border:1px solid rgba(7,17,27,.1);
              border-radius: 2px;
            }
          }
        }
      }
    }
  }
</style>
