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
      <h4>{{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }} ITEM</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

      <div class="p-6">

        <!-- NAME -->
        <vs-input label="Name" v-model="name" class="mt-5 w-full" name="item-name" v-validate="'required'"/>
        <!--        <span class="text-danger text-sm" v-show="errors.has('item-name')">{{ errors.first('item-name') }}</span>-->

      </div>
    </component>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid">Submit</vs-button>
      <vs-button type="border" color="danger" @click="isSidebarActiveLocal = false">Cancel</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

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
        id: null,
        name: '',

        category_choices: [
          {text: 'Audio', value: 'audio'},
          {text: 'Computers', value: 'computers'},
          {text: 'Fitness', value: 'fitness'},
          {text: 'Appliance', value: 'appliance'}
        ],

        order_status_choices: [
          {text: 'Pending', value: 'pending'},
          {text: 'Canceled', value: 'canceled'},
          {text: 'Delivered', value: 'delivered'},
          {text: 'On Hold', value: 'on_hold'}
        ],
        settings: { // perfectscrollbar settings
          maxScrollbarLength: 60,
          wheelSpeed: .60
        }
      }
    },
    watch: {
      isSidebarActive(val) {
        if (!val) return
        if (Object.entries(this.data).length === 0) {
          this.initValues()
          // this.$validator.reset()
        } else {
          const {id, name} = JSON.parse(JSON.stringify(this.data))
          this.id = id
          this.name = name
          this.initValues()
        }
        // Object.entries(this.data).length === 0 ? this.initValues() : { this.id, this.name, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
      }
    },
    computed: {
      isSidebarActiveLocal: {
        get() {
          return this.isSidebarActive
        },
        set(val) {
          if (!val) {
            this.$emit('closeSidebar')
            // this.$validator.reset()
            // this.initValues()
          }
        }
      },
      isFormValid() {
        return this.name
      },
      scrollbarTag() {
        return this.$store.getters.scrollbarTag
      }
    },
    methods: {
      initValues() {
        if (this.data.id) return
        this.id = null
        this.name = ''
      },
      submitData() {
        if (!this.isFormValid) {
          return
        }

        const this_app = this;
        this_app.$vs.loading();

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "name": this.name,
          "service_ids": this.service_ids
        };

        axios.post(API.SERVICES_CREATE, params).then((res) => {
          console.log(res);

          this_app.$vs.loading.close();

          if (!res.data.success) {
            const error = res.data.data.errors[0];

            this_app.$vs.notify({
              title: 'Error',
              text: error,
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger'
            });

            return
          } else {
            this_app.$vs.notify({
              title: 'Success',
              text: "Group is created!",
              iconPack: 'feather',
              icon: 'icon-check-circle',
              color: 'success'
            });

            this_app.$emit('closeSidebar')
            this_app.$emit('reloadData')
            this_app.initValues()
          }

        }).catch((err) => {
          console.log(err);
        });
      }
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
