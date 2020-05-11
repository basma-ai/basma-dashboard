<template>
  <a v-if="file_loaded" target="_blank" @click="showFile">
    <vs-button v-if="file_type == 'file'" icon-pack="feather" icon="icon-file-text" size="medium" color="dark" type="border">{{file.filename}}</vs-button>
    <img v-else class="chat-image-preview" :src="file.signed_url">
  </a>
</template>
<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: ['file_type','file_id'],
    data() {
      return {
        file: null,
        file_loaded: false
      }
    },
    methods: {
      showFile() {
        let this_app = this;

        this.getFile(function() {
          window.open(this_app.file.signed_url, "_blank")
        });
      },
      getFile(onDone = null) {
        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "file_id": this.file_id
        };

        axios.post(API.FILE_GET, params).then(function (res) {
          if (res.data.success) {
            this.file = res.data.data;
            this.file_loaded = true
            if(onDone != null) {
              onDone()
            }
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
    display: block;
  }
</style>
