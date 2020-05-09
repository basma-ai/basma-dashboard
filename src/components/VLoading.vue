<template>
  <div>
    <div class="centerx example-loading">
      <div class="fill-row-loading">
        <div :id="'loading-'+random" class="vs-con-loading__container loading-example"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: {},
    data() {
      return {
        random: Math.random().toString().substr(2, 3)
      }
    },
    mounted() {
      console.log(this.random);
      this.$vs.loading({
        container: '#loading-' + this.random,
      })
    },
    computed: {},
    methods: {}
  }
</script>

<style lang="stylus">
  .fill-row-loading
    display flex
    align-items center
    justify-content center
    flex-wrap wrap

    .con-vs-loading
      background transparent !important

    .loading-example
      width 120px;
      float left
      height 120px;
      margin 8px
      transition all .3s ease

      h4
        z-index 40000
        position relative
        text-align center
        padding 10px

      &.activeLoading
        opacity 0 !important
        transform scale(.5)
</style>
