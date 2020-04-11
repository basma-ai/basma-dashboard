<template>
  <vx-card no-shadow>

    <!-- Out Of Working Hours Template -->
    <div class="mt-5">
      <label class="text-xs">Out of Working Hours Message</label>
      <vs-textarea class="w-full" rows="4" v-model="vendor.out_of_working_hours_message" />
    </div>

    <!-- Business Hours -->
    <div class="mt-5">
      <label class="text-xs">Business Hours</label>
      <business-hours v-if="days != null" color="#FFB600" type="select" :days="days"></business-hours>
    </div>

    <!-- Save & Reset Button -->
    <div class="flex flex-wrap items-center justify-end mt-base">
      <vs-button class="ml-auto mt-2" @click="update">Save Changes</vs-button>
<!--      <vs-button class="ml-4 mt-2" type="border" color="warning">Reset</vs-button>-->
    </div>
  </vx-card>
</template>

<script>
import axios from '@/axios.js'
import API from '@/api.js'
import BusinessHours from 'vue-business-hours';

export default {
  props: ["vendor"],
  components: {
    BusinessHours
  },
  data () {
    return {
      days: null,
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    }
  },
  created() {
    if (this.vendor.working_hours != null) {
      this.days = JSON.parse(this.vendor.working_hours);
    }
  },
  methods: {
    update() {
      // this.$refs.observer.validate();

      let this_app = this;

      this_app.$vs.loading();

      const vendor = this.activeUserInfo.info.vendor.username;
      let days = JSON.stringify(this.days);

      let params = {
        "vu_token": this.activeUserInfo.token,
        "out_of_working_hours_message": this.vendor.out_of_working_hours_message,
        "working_hours": days
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
