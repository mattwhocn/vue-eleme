<template>
  <div class="ratingselect">
    <div class="rating-type border-line">
      <span @click="select(2,$event)" class="block positive" :class="{active: selectType == 2}">{{desc.all}} <i class="count"> {{ratings.length}}</i></span>
      <span @click="select(0,$event)" class="block positive" :class="{active: selectType == 0}">{{desc.positive}} <i class="count"> {{positiveCommon.length}}</i></span>
      <span @click="select(1,$event)" class="block negative" :class="{active: selectType == 1}">{{desc.negative}} <i class="count"> {{negativeCommon.length}}</i></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{active:onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  export default {
    props: {
      ratings: {
        type: Array,
        default: function () {
          return []
        }
      },
      desc: {
        type: Object,
        default: function () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    data: function () {
      return {
        selectType: ALL,
        onlyContent: false
      }
    },
    computed: {
      positiveCommon: function () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negativeCommon: function () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      select: function (type, event) {
        if (!event._constructed) {
          return
        }
        this.selectType = type
        // 下面绑定一个自定义事件,通知父组件 props 传过来的selectType 发生了改变
        this.$root.eventHub.$emit('ratingType.select', type)
      },
      toggleContent: function (event) {
        if (!event._constructed) {
          return
        }
        this.onlyContent = !this.onlyContent

        // 同样通知父组件 onlyContent 发生了改变
        this.$root.eventHub.$emit('content.toggle', this.onlyContent)
      }
    },
    created: function () {
      console.log(this.selectType)
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import "../../common/style/base.scss";
  .rating-type{
    padding: .24rem 0 .36rem;
    @include border-line(rgba(7,17,27,0.1));
    font-size: 0;
    .block{
      margin-right: .16rem;
      padding:.16rem .24rem;
      font-size: .28rem;
      display: inline-block;
      color: rgb(77,85,93);
      .count{
        font-size: .16rem;
        font-style: normal;
      }
      &.positive{
        background: rgba(0,160,220,0.2);
        &.active{
           background: rgba(0,160,220,1);
           color: #fff;
        }
      }
      &.negative{
        background: rgba(77,85,93,0.2);
        &.active{
           background: rgb(77,85,93);
           color: #fff;
         }
      }
    }
  }
  .switch{
    padding:.24rem 0;
    color: rgb(147,153,159);
    .icon-check_circle{
      font-size: .48rem;
      display: inline-block;
    }
    .text{
      font-size: .24rem;
      line-height: .48rem;
      display: inline-block;
      vertical-align: top;
    }
    &.active{
       color: rgb(0,160,220);
    }
  }
</style>
