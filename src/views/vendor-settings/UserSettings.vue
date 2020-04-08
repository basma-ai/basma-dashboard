<template>
  <vs-tabs v-if="vendor != null" :position="isSmallerScreen ? 'top' : 'left'" class="tabs-shadow-none" id="profile-tabs" :key="isSmallerScreen">
    <vs-tab icon-pack="feather" icon="icon-info" :label="!isSmallerScreen ? 'Info' : ''">
      <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-info :vendor="vendor"/>
      </div>
    </vs-tab>
    <vs-tab icon-pack="feather" icon="icon-clock" :label="!isSmallerScreen ? 'Working Hours' : ''">
      <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-working-hours :vendor="vendor"/>
      </div>
    </vs-tab>
    <vs-tab icon-pack="feather" icon="icon-film" :label="!isSmallerScreen ? 'Recording' : ''">
      <div class="tab-text md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-recording :vendor="vendor"/>
      </div>
    </vs-tab>

  </vs-tabs>
</template>

<script>
import UserSettingsInfo from './UserSettingsInfo.vue'
import UserSettingsWorkingHours from './UserSettingsWorkingHours.vue'
import UserSettingsRecording from "./UserSettingsRecording";
import axios from '@/axios.js'
import API from '@/api.js'

export default {
  components: {
    UserSettingsInfo,
    UserSettingsWorkingHours,
    UserSettingsRecording
  },
  data () {
    return {
      vendor: null
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    },
    isSmallerScreen () {
      return this.$store.state.windowWidth < 768
    }
  },
  created() {
    this.getVendor()
  },
  methods: {
    getVendor(){
      let this_app = this;

      let params = {
        "vu_token": this.activeUserInfo.token
      };

      axios.post(API.SETTINGS_GET, params).then((res) => {
        this_app.vendor = res.data.data.vendor
      }).catch((err) => {
        console.log(err);
      });
    },
  }
}
</script>

<style lang="scss">
#profile-tabs {
  .vs-tabs--content {
    padding: 0;
  }
}
</style>
