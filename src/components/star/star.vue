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

  }
  .star.star-24{

  }
</style>
