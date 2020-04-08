<template>
  <vs-tabs v-if="vendor != null" :position="isSmallerScreen ? 'top' : 'left'" class="tabs-shadow-none" id="profile-tabs" :key="isSmallerScreen">

    <!-- GENERAL -->
<!--    <vs-tab icon-pack="feather" icon="icon-user" :label="!isSmallerScreen ? 'My Profile' : ''">-->
<!--      <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">-->
<!--        <user-settings-general />-->
<!--      </div>-->
<!--    </vs-tab>-->
<!--    <vs-tab icon-pack="feather" icon="icon-lock" :label="!isSmallerScreen ? 'Change Password' : ''">-->
<!--      <div class="tab-change-pwd md:ml-4 md:mt-0 mt-4 ml-0">-->
<!--        <user-settings-change-password />-->
<!--      </div>-->
<!--    </vs-tab>-->
    <vs-tab icon-pack="feather" icon="icon-info" :label="!isSmallerScreen ? 'Info' : ''">
      <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-info :vendor="vendor"/>
      </div>
    </vs-tab>
<!--    <vs-tab icon-pack="feather" icon="icon-github" :label="!isSmallerScreen ? 'Social Links' : ''">-->
<!--      <div class="tab-social-links md:ml-4 md:mt-0 mt-4 ml-0">-->
<!--        <user-settings-social-links />-->
<!--      </div>-->
<!--    </vs-tab>-->
<!--    <vs-tab icon-pack="feather" icon="icon-link-2" :label="!isSmallerScreen ? 'Connections' : ''">-->
<!--      <div class="tab-text md:ml-4 md:mt-0 mt-4 ml-0">-->
<!--        <user-settings-connections />-->
<!--      </div>-->
<!--    </vs-tab>-->
    <vs-tab icon-pack="feather" icon="icon-bell" :label="!isSmallerScreen ? 'Features' : ''">
      <div class="tab-text md:ml-4 md:mt-0 mt-4 ml-0">
        <user-settings-notifications :vendor="vendor"/>
      </div>
    </vs-tab>
  </vs-tabs>
</template>

<script>
import UserSettingsGeneral from './UserSettingsGeneral.vue'
import UserSettingsChangePassword from './UserSettingsChangePassword.vue'
import UserSettingsInfo from './UserSettingsInfo.vue'
import UserSettingsSocialLinks from './UserSettingsSocialLinks.vue'
import UserSettingsConnections from './UserSettingsConnections.vue'
import UserSettingsNotifications from './UserSettingsNotifications.vue'
import axios from '@/axios.js'
import API from '@/api.js'

export default {
  components: {
    // UserSettingsGeneral,
    // UserSettingsChangePassword,
    UserSettingsInfo,
    // UserSettingsSocialLinks,
    // UserSettingsConnections,
    UserSettingsNotifications
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
