<template>
    <vs-button color="secondary" icon-pack="feather" icon="icon-paperclip" type="border" class="file_box" @click="pick_file">
      <input :ref="'upload_file'+_uid" type="file" accept="image/*,.pdf,.doc,.docx,.txt,.odt,.odf,.xls,.xlsx,.ppt,.pptx" @change="start_upload($event)">
    </vs-button>
</template>

<style scoped>
  .file_box input {
    display: none;
  }
</style>

<script>
  import axios from '@/axios.js';
  import API from '@/api.js';

  export default {
    props: ['file_type', 'user_token', 'belongs_to', 'belongs_to_id'],
    data() {
      return {
        loading: false,
        file_id: null
      }
    },
    methods: {
      pick_file: function () {
        this.$refs['upload_file' + this._uid].click();
      },
      start_upload: async function (event) {

        this.loading = true;

        let imageTypes = ['jpg', 'jpeg', 'png', 'gif'];
        let fileTypes = ['pdf', 'docx', 'txt', 'odt', 'odf', 'xls', 'xlsx', 'ppt', 'pptx'];

        let base64_file = '';

        let thisApp = this;

        let input = event.target;

        // Ensure that you have a file before attempting to read it
        if (input.files && input.files[0]) {

          let extension = input.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
            isImage = imageTypes.indexOf(extension) > -1,  //is extension in acceptable types
            isFile = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

          if (!(isImage || isFile)) {
            console.log("unknown file type, can't be uploaded, sorry mate")
            return;
          }

          let file_type = isImage ? 'image' : (isFile ? 'file' : '');

          // create a new FileReader to read this file and convert to base64 format
          let reader = new FileReader();

          // Define a callback function to run, when FileReader finishes its job
          reader.onload = (e) => {
            // Note: arrow function used here, so that "this.fileData" refers to the fileData of Vue component
            // Read file as base64 and set to fileData
            base64_file = e.target.result;


            axios.post(API.FILE_UPLOAD, {
              "vu_token": this.user_token || this.$store.state.AppActiveUser.token,
              "belongs_to": this.belongs_to,
              "belongs_to_id": this.belongs_to_id,
              "file_base64": base64_file,
              "filename": input.files[0].name,
            })
              .then(function (response) {
                if (response.data.success) {
                  console.log("it's a success!");

                  thisApp.file_id = response.data.data.file_id;

                  let res = {
                    "type": file_type,
                    "id": thisApp.file_id
                  };

                  thisApp.$emit('uploaded', res);
                } else {
                  console.log("it's a failure!");
                }

                thisApp.loading = false;
              })
              .catch(function (error) {
                console.log(error);
                thisApp.loading = false;
              });

          }

          // Start the reader job - read file as a data url (base64 format)
          reader.readAsDataURL(input.files[0]);
        }
      }
    }
  }
</script>

<style lang="scss">
  .file_box {
    padding: 0.6rem 0.8rem !important;
    i {
      margin: 0 !important;
      font-size: 20px;
    }
  }
</style>
