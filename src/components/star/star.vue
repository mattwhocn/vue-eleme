<template>
    <div class="star" :class="starType">
      <span v-for="itemClass in itemClasses" :class="itemClass" class="starItem"></span>
    </div>
</template>

<script>
  const LENGTH = 5
  const CLS_ON = 'on'
  const CLS_HALF = 'half'
  const CLS_OFF = 'off'

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType () {
        return 'star-' + this.size
      },
      itemClasses () {
        let result = []
        let score = Math.floor(this.score * 2) / 2
        let int = Math.floor(score)
        let hasHalf = score % 1 !== 0
        for (let i = 0; i < int; i++) {
          result.push(CLS_ON)
        }
        hasHalf && result.push(CLS_HALF)

        while (result.length < LENGTH) {
          result.push(CLS_OFF)
        }
        return result
      }
    },
    data () {
      return {
      }
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import "../../common/style/base.scss";
  .star{
    .starItem{
      display: inline-block;
      background-repeat:no-repeat;
      .starItem:last-child{
        margin-right: 0;
      }

    }
  }
  .star.star-48{
    .starItem{
      width: .4rem;
      height: .4rem;
      margin-right: .44rem;
      background-size: .4rem ;
    }
    .starItem.on{
      @include bg-img('star48_on')
    }
    .starItem.half{
      @include bg-img('star48_half')
    }
    .starItem.off{
      @include bg-img('star48_off')
    }
  }
  .star.star-36{
    .starItem{
      width: .30rem;
      height: .30rem;
      margin-right: .12rem;
      background-size: .30rem ;
    }
    .starItem.on{
      @include bg-img('star36_on')
      }
      .starItem.half{
      @include bg-img('star36_half')
      }
      .starItem.off{
      @include bg-img('star36_off')
    }
  }
  .star.star-24{
    .starItem{
      width: .20rem;
      height: .20rem;
      margin-right: .06rem;
      background-size: .20rem ;
    }
    .starItem.on{
      @include bg-img('star24_on')
    }
    .starItem.half{
      @include bg-img('star24_half')
    }
    .starItem.off{
      @include bg-img('star24_off')
    }
  }
</style>
