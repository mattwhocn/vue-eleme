<template>
  <div id="app">
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab border-line">
      <div class="tab-item"><router-link to="/goods">商品</router-link></div>
      <div class="tab-item"><router-link to="/ratings">评论</router-link></div>
      <div class="tab-item"><router-link to="/seller">商家</router-link></div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
  const ERR_NO = 0
  import Vue from 'vue'
  import header from './components/header/header'
  export default {
    name: 'app',
    data: function () {
      return {
        seller: {},
        eventHub: new Vue()
      }
    },
    created () {
      this.$http.get('/api/seller').then(function (res) {
        res = res.body
        console.log(res)  // 在获取完数据后的对象中,vue自动回给每个数据加上get和set方法
        if (res.code === ERR_NO) {
          this.seller = res.data
        }
      })
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="scss" type="text/scss">
  @import './common/style/base.scss';
  @import './common/style/icon-font.css';
  #app{
    font-size: 0.32rem;
    .tab{
      display: flex;
      width: 100%;
      height: .8rem;
      line-height: .8rem;
      font-size: .28rem;
      @include border-line(rgba(7,17,27,0.1));
      .tab-item{
        flex:1;
        text-align: center;
        color: rgb(77,85,93);
        a{
          display: block;
        }
        .active{
          color: rgb(240,20,20);
        }
      }
    }

  }
</style>
