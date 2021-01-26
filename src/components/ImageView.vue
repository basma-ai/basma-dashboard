<template>
  <div class="snap">
    <a target="_blank" :href="image.signed_url">
      <img class="snap-thumb" :src="image.signed_url" id="thumb" />
    </a>
  </div>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: ['file_id'],
    data() {
      return {
        image: null
      }
    },
    watch: {},
    computed: {},
    methods: {
    },
    components: {
    },
    created() {
      console.log("hahaha");
      const params = {
        "vu_token": this.$store.state.AppActiveUser.token,
        "file_id": this.file_id
      };

      axios.post(API.FILE_GET, params).then(function (res) {
        if (res.data.success) {
          this.image = res.data.data;
        }

      }.bind(this));

    },
  }
</script>


<style lang="scss">
  .snap{
    float: left;
    margin-right: 10px;
  }
  .snap-thumb {
    height: 80px;
    border-radius: 5px;
    display: inline-block;
    vertical-align: top;
  }
</style>
