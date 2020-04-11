<template>
  <vx-card no-shadow>

    <div class="mb-base">
      <h6 class="mb-4">Recording</h6>

      <div class="flex items-center mb-4">
        <vs-switch v-model="vendor.recording_enabled" disabled/>
        <span class="ml-4">Record all video calls and show them in the call view to the agent.</span>
      </div>
      <!--      <div class="flex items-center mb-4">-->
      <!--        <vs-switch v-model="answer" />-->
      <!--        <span class="ml-4">Email me when someone answers on my form</span>-->
      <!--      </div>-->
      <!--      <div class="flex items-center mb-4">-->
      <!--        <vs-switch v-model="follow" />-->
      <!--        <span class="ml-4">Email me hen someone follows me</span>-->
      <!--      </div>-->
    </div>

    <!--    <div>-->
    <!--      <h6 class="mb-4">Application</h6>-->

    <!--      <div class="flex items-center mb-4">-->
    <!--        <vs-switch v-model="news" />-->
    <!--        <span class="ml-4">News and announcements</span>-->
    <!--      </div>-->
    <!--      <div class="flex items-center mb-4">-->
    <!--        <vs-switch v-model="product_update" />-->
    <!--        <span class="ml-4">Weekly product updates</span>-->
    <!--      </div>-->
    <!--      <div class="flex items-center">-->
    <!--        <vs-switch v-model="blog" />-->
    <!--        <span class="ml-4">Weekly blog digest</span>-->
    <!--      </div>-->
    <!--    </div>-->

    <!-- Save & Reset Button -->
    <div class="flex flex-wrap items-center justify-end mt-base">
      <vs-button class="ml-auto mt-2" @click="update" disabled>Save Changes</vs-button>
    </div>

  </vx-card>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: ["vendor"],
    data() {
      return {
      }
    },
    computed: {
      activeUserInfo() {
        return this.$store.state.AppActiveUser
      }
    },
    methods: {
      update() {
        // this.$refs.observer.validate();

        let this_app = this;

        this_app.$vs.loading();

        const vendor = this.activeUserInfo.info.vendor.username;

        let params = {
          "vu_token": this.activeUserInfo.token,
          "recording_enabled": this.recording
        };

        axios.post(API.SETTINGS_EDIT, params).then((res) => {

          this_app.$vs.loading.close();

          if (res.data.success) {
            this_app.$vs.notify({
              title: 'Success',
              text: "Settings has been changed!",
              iconPack: 'feather',
              icon: 'icon-check-circle',
              color: 'success'
            });

          } else {
            const error = res.data.data.errors[0];

            this_app.$vs.notify({
              title: 'Error',
              text: error,
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger'
            });
          }
        }).catch((err) => {

        });
      }
    }
  }
</script>
