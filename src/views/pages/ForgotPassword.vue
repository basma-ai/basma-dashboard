<template>
  <div class="h-screen flex w-full bg-img">
    <div class="vx-col w-4/5 sm:w-4/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img :src="vendor.logo_url" alt="login" class="mx-auto" style="max-height: 180px;max-width: 180px;">
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">Recover your password</h4>
                  <p>Please enter your username and we'll send you instructions on how to reset your password.</p>
                </div>

                <vs-input type="text" label-placeholder="Username" v-model="username" class="w-full mb-8"/>
                <vs-button type="border" to="login" class="px-4 w-full md:w-auto">Back To Login</vs-button>
                <vs-button color="success" class="float-right px-4 w-full md:w-auto mt-3 mb-8 md:mt-0 md:mb-0" @click="forgot">Recover
                  Password
                </vs-button>
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

  export default {
    data() {
      return {
        username: '',
        vendor: {}
      }
    },
    mounted() {
      const this_app = this;

      // if (null != this.$store.state.AppActiveUser.token)
      if (null != this_app.$route.query.email) {
        this_app.username = this_app.$route.query.email;
      }

      axios.post("/guest/get_vendor", {"vendor_username": this.$route.params.id}).then((res) => {
        this_app.vendor = res.data.data.vendor
      }).catch((err) => {

      });

    },
    methods: {
      forgot() {
        this.$vs.loading()
        const this_app = this;

        let payload = {
          "vendor_id": this_app.vendor.id,
          "username": this_app.username,
        };

        axios.post("/agent/request_reset_password", payload).then((res) => {
          this.$vs.loading.close()

          if (!res.data.success) {
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

          this.$vs.notify({
            title: 'Success',
            text: 'Reset link has been sent to your email',
            iconPack: 'feather',
            icon: 'icon-mail',
            color: 'success'
          })

          setTimeout(function(){
            this_app.$router.push('/' + this_app.vendor.username + '/login').catch(() => {})
          }, 3000);

        }).catch((err) => {

        });


      }
    }
  }
</script>
