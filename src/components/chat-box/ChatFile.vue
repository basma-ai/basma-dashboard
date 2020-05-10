<template>
  <div>
    <img class="chat-image-preview" v-if="file_loaded" :src="file_url">
  </div>
</template>
<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: ['file_id'],
    data() {
      return {
        file_url: '',
        file_loaded: false
      }
    },
    methods: {
      getFile() {
        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "file_id": this.file_id
        };

        axios.post(API.FILE_GET, params).then(function (res) {
          if (res.data.success) {
            this.file_url = res.data.data.signed_url;
            this.file_loaded = true
          }

        }.bind(this));
      },
    },
    created() {
      if(null != this.file_id) {
        this.getFile()
      }
    },
  }
</script>

<style>
  img.chat-image-preview {
    width: 200px;
  }
</style>
