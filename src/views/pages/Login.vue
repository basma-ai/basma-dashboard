<template>
  <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">

          <div class="vx-row no-gutter justify-center items-center">

            <div class="vx-col hidden lg:block lg:w-1/2">
              <img :src="vendor.logo_url" alt="login" class="mx-auto" style="max-height: 180px;max-width: 180px;">
            </div>

            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8 login-tabs-container">

                <div class="vx-card__title mb-4">
                  <h4 class="mb-4">Login</h4>
                  <p>Welcome back, please login to your account.</p>
                </div>

                <div>
                  <vs-input
                      name="text"
                      icon-no-border
                      icon="icon icon-user"
                      icon-pack="feather"
                      label-placeholder="Username"
                      v-model="username"
                      class="w-full"
                      v-on:keyup.enter="login" />

                  <vs-input
                      type="password"
                      name="password"
                      icon-no-border
                      icon="icon icon-lock"
                      icon-pack="feather"
                      label-placeholder="Password"
                      v-model="password"
                      class="w-full mt-6"
                      v-on:keyup.enter="login" />

                  <div class="flex flex-wrap justify-between my-5">
                      <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Remember Me</vs-checkbox>
                  </div>
                  <vs-button style="visibility: hidden" type="border">Register</vs-button>
                  <vs-button class="float-right" @click="login">Login</vs-button>

                </div>

              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>

import axios from '@/axios.js'

export default{
  data() {
    return {
      username: "",
      password: "",
      checkbox_remember_me: false,
      vendor: {}
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    }
  },
  mounted() {
    const this_app = this;

    // if (null != this.$store.state.AppActiveUser.token)


    axios.post("/guest/get_vendor", {"vendor_username": this.$route.params.id}).then((res) => {

      this_app.vendor = res.data.data.vendor
    }).catch((err) => {

    });

  },
  methods: {
    login () {
      this.$vs.loading()
      const this_app = this;

      let payload = {
        "vendor_id": this_app.vendor.id,
        "username": this_app.username,
        "password": this_app.password
      };

      axios.post("/agent/request_token", payload).then((res) => {
        this.$vs.loading.close()


        if (!res.data.success){
          const error = res.data.data.errors[0];

          this.$vs.notify({
            title: 'Error',
            text: error,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          })

          return
        }

        let user_data = {
          token: res.data.data.token,
          info: res.data.data.vu_user,
          name: res.data.data.vu_user.name,
          role: res.data.data.vu_user.role,
          photo_url: res.data.data.vu_user.photo_url
        }



        this_app.$store.commit('UPDATE_USER_INFO', user_data);





        this.$router.push('/').catch(() => {})
      }).catch((err) => {

      });


    }
  }
}
</script>

<style lang="scss">
#page-login {
  .social-login-buttons {
    .bg-facebook { background-color: #1551b1 }
    .bg-twitter { background-color: #00aaff }
    .bg-google { background-color: #4285F4 }
    .bg-github { background-color: #333 }
  }
}
</style>
