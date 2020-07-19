<template>
  <div class="h-screen flex w-full bg-img">
    <div class="vx-col sm:w-3/5 md:w-3/5 lg:w-3/4 xl:w-3/5 mx-auto self-center">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row">
            <div class="vx-col hidden sm:hidden md:hidden lg:block lg:w-1/2 mx-auto self-center">
              <img :src="vendor.logo_url" alt="login" class="mx-auto" style="max-height: 180px;max-width: 180px;">
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 mx-auto self-center  d-theme-dark-bg">
              <div class="p-8">
                <div class="vx-card__title mb-8">
                  <h4 class="mb-4">Reset Password</h4>
                  <p>Please enter your new password.</p>
                </div>
                <vs-input type="password" v-validate="'min:6|max:10'" label-placeholder="Password" v-model="password"
                          class="w-full mb-6"/>
                <vs-input type="password" v-validate="'min:6|max:10|confirmed:password'"
                          label-placeholder="Confirm Password" v-model="confirm_password" class="w-full mb-8"/>

                <div class="flex flex-wrap justify-between flex-col-reverse sm:flex-row">
                  <vs-button style="visibility: hidden" type="border" to="login" class="w-full sm:w-auto mb-8 sm:mb-auto mt-3 sm:mt-auto">Go Back
                    To Login
                  </vs-button>
                  <vs-button color="success" class="w-full sm:w-auto" @click="reset">Reset</vs-button>
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

  import {Validator} from 'vee-validate';

  Validator.localize('en')

  export default {
    data() {
      return {
        password: '',
        confirm_password: '',
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
      reset() {
        this.$vs.loading()
        const this_app = this;

        let payload = {
          "vendor_id": this_app.vendor.id,
          "fp_token": this_app.$route.params.token,
          "password": this_app.password,
        };

        axios.post("/agent/do_reset_password", payload).then((res) => {
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
            text: 'Your password has been reset',
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
