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

        <vs-input v-validate="'required'" name="name" label-placeholder="Name" v-model="name" class="w-full mb-6"/>

        <!-- PERMISSIONS -->
        <vs-select multiple v-validate="'required'" name="permissions_ids" label="Permissions" v-model="permissions_ids"
                   class="w-full mb-6">
          <vs-select-item :value="r.id" :text="r.label" v-for="r in permissions"/>
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
        name: '',
        permissions: [],
        permissions_ids: false,

        settings: { // perfectscrollbar settings
          maxScrollbarLength: 60,
          wheelSpeed: .60
        }
      }
    },
    watch: {
      all_recordings_(val) {
        if (val) {
          this.my_recordings_ = true
        } else {
          this.my_recordings_ = false
        }
      },
      isSidebarActive(val) {
        if (!val) return
        if (this.isNew) {
          this.initValues()
          // this.$validator.reset()
        } else {
          let this_app = this;

          const params = {
            "vu_token": this.$store.state.AppActiveUser.token,
            "role_id": this.data.id
          };

          axios.post(API.ROLES_GET, params).then((res) => {
            console.log(res);
            const { name, permissions } = res.data.data.role;
            this_app.name = name
            this_app.permissions_ids = permissions.map(x => x.id)
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
          return this.name

        } else {
          return this.name
        }
      },
      scrollbarTag() {
        return this.$store.getters.scrollbarTag
      }
    },
    methods: {
      loadPermissions() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token
        };

        axios.post(API.PERMISSIONS_LIST, params).then((res) => {
          console.log(res);
          this_app.permissions = res.data.data.list;
        }).catch((err) => {
          console.log(err);
        });
      },
      initValues() {
        if (this.data.id) return
        this.name = ''
        this.permissions_ids = []
      },
      submitData() {
        if (!this.isFormValid) {
          return
        }

        const this_app = this;
        this_app.$vs.loading();

        let params = {
          "vu_token": this_app.$store.state.AppActiveUser.token,
          "name": this_app.name,
          "permissions_ids": this_app.permissions_ids
        };

        if (!this_app.isNew) {
          params.role_id = this_app.data.id;
        }

        console.log("params: ", params);

        const endpoint = this_app.isNew ? API.ROLES_CREATE : API.ROLES_EDIT;

        axios.post(endpoint, params).then((res) => {
          console.log(res);

          this_app.$vs.loading.close();

          if (res.data.success) {
            this_app.$vs.notify({
              title: 'Success',
              text: this_app.isNew ? "Role is created!" : "Role is updated!",
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
      this.loadPermissions();
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
