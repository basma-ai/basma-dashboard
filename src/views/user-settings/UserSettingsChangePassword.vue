<template>
  <vx-card no-shadow>
    <!--    <vs-input class="w-full mb-base" label-placeholder="Old Password" v-model="old_password" />-->
    <vs-input type="password" v-validate="{ required: true, regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.[\W]).{8,}$/ }" class="w-full mb-base" label-placeholder="New Password"
              v-model="new_password"/>
    <span class="text-danger text-sm"  v-show="errors.has('password')">{{ errors.first('password') }}</span>

    <vs-input type="password" v-validate="'min:6|max:10|confirmed:password'" class="w-full mb-base" label-placeholder="Confirm Password"
              v-model="confirm_new_password" data-vv-as="password"/>
    <span class="text-danger text-sm"  v-show="errors.has('confirm_new_password')">{{ errors.first('confirm_new_password') }}</span>


    <!-- Save & Reset Button -->
    <div class="flex flex-wrap items-center justify-end">
      <vs-button class="ml-auto mt-2" @click="updatePassword">Save Changes</vs-button>
      <vs-button class="ml-4 mt-2" type="border" color="warning" @click="new_password = ''; confirm_new_password = ''">Reset</vs-button>
    </div>
  </vx-card>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {

    data() {
      return {
        // old_password: '',
        new_password: '',
        confirm_new_password: ''
      }
    },
    computed: {
      activeUserInfo() {
        return this.$store.state.AppActiveUser
      }
    },
    methods: {
      updatePassword() {
        // this.$refs.observer.validate();

        let this_app = this;

        this_app.$vs.loading();

        const vendor = this.activeUserInfo.info.vendor.username;

        let params = {
          "vu_token": this.activeUserInfo.token,
          "vu_id": this.activeUserInfo.info.id,
          "password": this.new_password
        };

        axios.post(API.USERS_EDIT, params).then((res) => {

          this_app.$vs.loading.close();

          if (res.data.success){
            this_app.$vs.notify({
              title: 'Success',
              text: "Password has changed!",
              iconPack: 'feather',
              icon: 'icon-check-circle',
              color: 'success'
            });

            setTimeout(() => {

              this_app.$store.commit('UPDATE_USER_INFO', null);
              window.location = '/'+vendor+'/login';
            }, 1000);

          } else {
            const error = res.data.data.errors[0];

            this_app.$vs.notify({
              title: 'Error',
              text: error,
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger'
            });

            return
          }


        }).catch((err) => {
          console.log(err);
        });
      }
    }
  }
</script>
