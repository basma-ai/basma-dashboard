<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
              class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ isNew ? "ADD NEW" : "UPDATE" }}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

      <div class="p-6">

        <vs-input :disabled="!isNew" v-validate="'required'" name="username" label-placeholder="Username"
                  v-model="username" class="w-full mb-6"/>

        <vs-input v-validate="'required'" name="name" label-placeholder="Name" v-model="name" class="w-full mb-6"/>

        <vs-input v-validate="'required|rule'" name="email" label-placeholder="Email" v-model="email"
                  class="w-full mb-6"/>

        <!--        <vs-input v-validate="'required'" type="password" name="password" label-placeholder="Password" v-model="password" class="w-full mb-6"/>-->

        <!-- Password 1 -->
        <vs-input type="password" v-validate="'min:6|max:10'" label="Password" name="password" v-model="password"
                  class="mt-5 w-full"/>
        <!--        <span class="text-danger text-sm" v-show="errors.has('password')">{{ errors.first('password') }}</span>-->

        <!-- Confirm Password -->
        <!--        <vs-input type="password" v-validate="'min:6|max:10|confirmed:password'" label="Confirm Password" name="confirm_password" v-model="confirm_password" class="mt-5 w-full" data-vv-as="password" />-->
        <!--        <span class="text-danger text-sm" v-show="errors.has('confirm_password')">{{ errors.first('confirm_password') }}</span>-->

        <!-- ROLES -->
        <vs-select multiple v-validate="'required'" name="roles_ids" label="Roles" v-model="roles_ids" class="w-full mb-6">
          <vs-select-item :value="r.id" :text="r.name" v-for="r in roles"/>
        </vs-select>

        <!-- GROUPS -->
        <vs-select multiple v-validate="'required'" name="groups_ids" label="Groups" v-model="groups_ids"
                   class="w-full mb-6">
          <vs-select-item :value="r.id" :text="r.name" v-for="r in groups"/>
        </vs-select>

      </div>
    </component>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid">Submit</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancel</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  import axios from '@/axios.js'
  import API from '@/api.js'
  import {Validator} from 'vee-validate';

  // register custom messages
  Validator.localize('en')

  export default {
    props: {
      isSidebarActive: {
        type: Boolean,
        required: true
      },
      data: {
        type: Object,
        default: () => {
        }
      }
    },
    components: {
      VuePerfectScrollbar
    },
    data() {
      return {
        // errors: [''],
        username: '',
        password: '',
        confirm_password: '',
        name: '',
        email: '',
        role: 'agent',
        groups_ids: [],
        groups: [],
        roles: [],
        roles_ids: [],

        settings: { // perfectscrollbar settings
          maxScrollbarLength: 60,
          wheelSpeed: .60
        }
      }
    },
    watch: {
      isSidebarActive(val) {
        if (!val) return
        if (this.isNew) {
          this.initValues()
          // this.$validator.reset()
        } else {
          let this_app = this;

          const params = {
            "vu_token": this.$store.state.AppActiveUser.token,
            "vu_id": this.data.id
          };

          axios.post(API.USERS_GET, params).then((res) => {
            console.log(res);
            const {username, name, email, role, groups, roles} = res.data.data.user;
            this_app.username = username
            this_app.name = name
            this_app.email = email
            this_app.role = role
            this_app.groups_ids = groups.map(x => x.id)
            this_app.roles_ids = roles.map(x => x.id)
            this_app.initValues()
          }).catch((err) => {
            console.log(err);
          });


        }
        // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
      }
    },
    computed: {
      isNew() {
        return Object.entries(this.data).length === 0
      },
      isSidebarActiveLocal: {
        get() {
          return this.isSidebarActive
        },
        set(val) {
          if (!val) {
            this.$emit('closeSidebar')
            // this.$validator.reset()
            this.initValues()
          }
        }
      },
      isFormValid() {
        if (Object.entries(this.data).length === 0) {
          return this.username && this.password && this.name && this.email

        } else {
          return this.username && this.name && this.email
        }
      },
      scrollbarTag() {
        return this.$store.getters.scrollbarTag
      }
    },
    methods: {
      loadGroups() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token
        };

        axios.post(API.GROUPS_LIST, params).then((res) => {
          console.log(res);
          this_app.groups = res.data.data.list;
        }).catch((err) => {
          console.log(err);
        });
      },
      loadRoles() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token
        };

        axios.post(API.ROLES_LIST, params).then((res) => {
          console.log(res);
          this_app.roles = res.data.data.list;
        }).catch((err) => {
          console.log(err);
        });
      },
      initValues() {
        if (this.data.id) {
          this.password = ''
          return
        }else{
          this.username = ''
          this.password = ''
          this.name = ''
          this.email = ''
          this.groups_ids = []
          this.roles_ids = []
        }
      },
      submitData() {
        if (!this.isFormValid) {
          return
        }

        const this_app = this;
        this_app.$vs.loading();

        let params = {
          "vu_token": this_app.$store.state.AppActiveUser.token,
          "username": this_app.username,
          "name": this_app.name,
          "email": this_app.email,
          "roles_ids": this_app.roles_ids,
          "groups_ids": this_app.groups_ids
        };

        if (!this_app.isNew) {
          params.vu_id = this_app.data.id;
        }

        if (this_app.password.length > 0) {
          params.password = this_app.password;
        }

        console.log("params: ", params);

        const endpoint = this_app.isNew ? API.USERS_CREATE : API.USERS_EDIT;

        axios.post(endpoint, params).then((res) => {
          console.log(res);

          this_app.$vs.loading.close();

          if (res.data.success) {
            this_app.$vs.notify({
              title: 'Success',
              text: this_app.isNew ? "User is created!" : "User is updated!",
              iconPack: 'feather',
              icon: 'icon-check-circle',
              color: 'success'
            });

            this_app.$emit('closeSidebar')
            this_app.$emit('reloadData')
            this_app.initValues()
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
    },
    created() {
      this.loadGroups();
      this.loadRoles();
    }
  }
</script>

<style lang="scss" scoped>
  .add-new-data-sidebar {
    ::v-deep .vs-sidebar--background {
      z-index: 52010;
    }

    ::v-deep .vs-sidebar {
      z-index: 52010;
      width: 400px;
      max-width: 90vw;

      .img-upload {
        margin-top: 2rem;

        .con-img-upload {
          padding: 0;
        }

        .con-input-upload {
          width: 100%;
          margin: 0;
        }
      }
    }
  }

  .scroll-area--data-list-add-new {
    // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
    height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

    &:not(.ps) {
      overflow-y: auto;
    }
  }
</style>
