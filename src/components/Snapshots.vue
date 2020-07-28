<template>
  <div>
    <vs-button style="width:100%" @click="takeSnapshot" icon="add_a_photo" type="border" color="secondary">Take a snapshot</vs-button>

    <div class="snapshots">
      <div v-for="snapshot in snaps" class="snapshot_box">
        <img :src="snapshot.url" id="thumb" />
        <textarea label="Description" :disabled="snapshot.upload_status != 'not_started'" v-model="snapshot.description" placeholder="Enter description here"></textarea>
        <v-btn @click="uploadFile(snapshot)" :disabled="snapshot.upload_status != 'not_started'">Upload</v-btn>
        <div v-if="snapshot.upload_status == 'uploading'">
          <v-progress-circular indeterminate color="primary"></v-progress-circular> Uploading
        </div>
        <div v-if="snapshot.upload_status == 'success'" style="color:green">
          <v-icon color="green">done</v-icon> Uploaded
        </div>
        <div v-if="snapshot.upload_status == 'error'" style="color:red">
          Error
        </div>
      </div>
    </div>

    <canvas id="canvas" width="640" height="480" style="display:none"></canvas>
  </div>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: ['call_id'],
    data() {
      return {
        snaps: [],
        saveable: false
      }
    },
    watch: {},
    computed: {},
    methods: {
      takeSnapshot: function() {

        this.saveable = true;

        var video = document.querySelector("#remote-media-div video")

        if (null != video) {
          var context = canvas.getContext('2d');
          var w, h, ratio;

          ratio = video.videoWidth / video.videoHeight;
          w = 500 - 100;
          h = parseInt(w / ratio, 10);
          canvas.width = w;
          canvas.height = h;
          context.fillRect(0, 0, w, h);
          context.drawImage(video, 0, 0, w, h);

          var jpegUrl = canvas.toDataURL("image/jpeg");

          this.snaps.push({
            'url': jpegUrl,
            'description': '',
            'upload_status': 'not_started'
          });
        }

      },
      uploadFile: function(snapshot) {

        var this_app = this;

        // find it
        var i = 0;
        var snapshot_index = 0;
        this.snaps.forEach(function(for_snapshot) {
          if (for_snapshot.url == snapshot.url) {
            snapshot_index = i;
          }
          i++;
        });

        this_app.snaps[snapshot_index].upload_status = 'uploading';

        var file_data = snapshot.url;
        var encodedImage = file_data.split(',')[1];

        axios.post(API.FILE_UPLOAD, {
          "vu_token": this_app.$store.state.AppActiveUser.token,
          "belongs_to": "calls",
          "belongs_to_id": this_app.call_id,
          "file_base64": encodedImage,
          "filename": "snap.jpg",
          "description": snapshot.description
        })
          .then(function (response) {
            if (response.data.success) {
              console.log("it's a success!");
              this_app.snaps[snapshot_index].upload_status = 'success';
            } else {
              console.log("it's a failure!");
              this_app.snaps[snapshot_index].upload_status = 'error';
            }
          })
          .catch(function (error) {
            console.log(error);
            this_app.snaps[snapshot_index].upload_status = 'error';
          });
      }
    },
    components: {
    },
    created() {
    },
  }
</script>

<style lang="scss">

</style>
