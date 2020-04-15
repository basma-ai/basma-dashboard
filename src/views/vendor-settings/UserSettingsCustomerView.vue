<template>
  <vx-card no-shadow>

    <div class="mb-base">
      <h6 class="mb-4">Customer View</h6>

      <div class="flex items-center mb-4">
        <vs-switch v-model="vendor.is_customer_view_enabled"/>
        <span class="ml-4">Enable or disable customer view for the public to call at anytime (If disabled you'll not recive calls from the Agent Phone however.</span>
      </div>

    </div>

    <!-- Save & Reset Button -->
    <div class="flex flex-wrap items-center justify-end mt-base">
      <vs-button class="ml-auto mt-2" @click="update">Save Changes</vs-button>
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
          "is_customer_view_enabled": this.vendor.is_customer_view_enabled
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
