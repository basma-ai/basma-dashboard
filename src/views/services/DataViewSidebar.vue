<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary"
              class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
      <h4>{{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

      <div class="p-6">

        <!-- NAME -->
        <vs-input label="Name" v-model="name" class="mt-5 w-full" name="item-name" v-validate="'required'"/>
        <!--        <span class="text-danger text-sm" v-show="errors.has('item-name')">{{ errors.first('item-name') }}</span>-->
        <vs-tooltip text="If the service is set on restricted only agent assigned to groups with access to this service will be able to answer calls for this specific service" position="top" >
          <vs-checkbox label="Is Restricted?" v-model="is_restricted" class="mt-5 w-full" name="item-name" v-validate="'required'">Is Restricted?</vs-checkbox>
        </vs-tooltip>
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
        is_restricted: false,

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
          const {id, name, is_restricted} = JSON.parse(JSON.stringify(this.data))
          this.id = id
          this.name = name
          this.is_restricted = is_restricted
          this.initValues()
        }
        // Object.entries(this.data).length === 0 ? this.initValues() : { this.id, this.name, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
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
        this.is_restricted = false
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
          "is_restricted": this.is_restricted
        };

        if (!this_app.isNew){
          params.service_id = this_app.data.id;
        }

        const endpoint = this_app.isNew ? API.SERVICES_CREATE : API.SERVICES_EDIT;

        axios.post(endpoint, params).then((res) => {


          this_app.$vs.loading.close();

          if (res.data.success) {
            this_app.$vs.notify({
              title: 'Success',
              text: this_app.isNew ? "Service is created!" : "Service is updated!",
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
