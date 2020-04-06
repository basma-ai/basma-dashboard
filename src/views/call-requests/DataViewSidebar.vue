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
      <h4>{{ isNew ? "SCHEDULE A NEW CALL" : "UPDATE SCHEDULED CALL" }}</h4>
      <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

      <div class="p-6">

        <label class="vs-input--label">Schedule Date/Time</label>
        <flat-pickr :config="configdateTimePicker" v-model="datetime" placeholder="Date Time" class="w-full mb-6" />

<!--        <vs-input-->
<!--          v-if="custom_fields && custom_fields.filter(x => x['name'].toLowerCase() === 'name') == null"-->
<!--          v-model="name"-->
<!--          class="w-full mb-6"-->
<!--          label="Name" />-->

<!--        <vs-input-->
<!--          v-if="custom_fields && custom_fields.filter(x => x['name'].toLowerCase() ==='mobile') == null"-->
<!--          v-model="mobile"-->
<!--          class="w-full mb-6"-->
<!--          label="Mobile" />-->

        <!-- read the fields from the db, and then show them according to their type -->
        <div v-for="(field, index) in custom_fields" v-bind:key="field.id">
          <vs-input
            v-if="field.type === 'text' || field.type === 'number'"
            v-model="field.value"
            :label="field.label + (field.is_mandatory ? '*' : '')"
            :rules="field.is_mandatory ? requiredRules : []"
            class="w-full mb-6" />

          <vs-checkbox
            v-if="field.type === 'boolean'"
            v-model="field.value"
            :label="field.label + (field.is_mandatory ? '*' : '')"
            :rules="field.is_mandatory ? requiredRules : []"
            class="w-full mb-6"
            style="text-align: justify;" />
        </div>

        <!-- AGENT -->
        <vs-select v-validate="'required'" name="user_id" label="Agents" v-model="user_id"
                   class="w-full mb-6">
          <vs-select-item :value="r.id" :text="r.name" v-for="r in users"/>
        </vs-select>

        <!-- SERVICE -->
        <vs-select v-validate="'required'" name="service_id" label="Service" v-model="service_id"
                   class="w-full mb-6">
          <vs-select-item :value="r.id" :text="r.name" v-for="r in services"/>
        </vs-select>

        <vs-checkbox v-model="send_sms">Send SMS</vs-checkbox>

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
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';

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
      VuePerfectScrollbar,
      flatPickr
    },
    data() {
      return {
        // errors: [''],
        name: '',
        mobile: '',
        services: [],
        service_id: '',
        users: [],
        user_id: '',
        custom_fields: [],

        send_sms: false,

        datetime: new Date(),
        configdateTimePicker: {
          enableTime: true,
          dateFormat: 'Y-m-d H:i K',
          minuteIncrement: 15
        },

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
            "call_request_id": this.data.id
          };

          axios.post(API.CALL_REQUESTS_GET, params).then((res) => {
            console.log(res);
            const {username, name, email, role, groups, roles} = res.data.data.user;
            this_app.username = username
            this_app.name = name
            this_app.email = email
            this_app.role = role
            this_app.initValues()
          }).catch((err) => {
            console.log(err);
          });

        }
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
          return this.user_id && this.service_id && this.datetime && this.custom_fields
        } else {
          return this.user_id && this.service_id && this.datetime && this.custom_fields
        }
      },
      scrollbarTag() {
        return this.$store.getters.scrollbarTag
      },
    },
    methods: {
      loadCustomFields() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token
        };

        axios.post(API.CUSTOM_FIELDS_LIST, params).then((res) => {
          console.log(res);
          let custom_fields = res.data.data.list;
          this_app.custom_fields = res.data.data.list;

          if (custom_fields.filter(x => x['name'].toLowerCase() === 'mobile') == null) {
            custom_fields.unshift({
              type: "number",
              name: "mobile",
              label: "Mobile",
              is_mandatory: 1})
          }

          if (custom_fields.filter(x => x['name'].toLowerCase() === 'name') == null) {
            custom_fields.unshift({
              type: "text",
              name: "name",
              label: "Name",
              is_mandatory: 1})
          }

          this_app.custom_fields = custom_fields

        }).catch((err) => {
          console.log(err);
        });
      },
      loadServices() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token
        };

        axios.post(API.SERVICES_LIST, params).then((res) => {
          console.log(res);
          this_app.services = res.data.data.list;
        }).catch((err) => {
          console.log(err);
        });
      },
      loadUsers() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "page": 1,
          "per_page": 100
        };

        axios.post(API.USERS_LIST, params).then((res) => {
          console.log(res);
          this_app.users = res.data.data.list;
        }).catch((err) => {
          console.log(err);
        });
      },
      initValues() {
        if (this.data.id) return
        this.datetime = ''
        this.user_id = ''
        this.service_id = ''
      },
      submitData() {
        if (!this.isFormValid) {
          return
        }

        const this_app = this;
        this_app.$vs.loading();

        let params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "vu_id": this.user_id,
          "service_id": this.service_id,
          "scheduled_time": new Date(this.datetime).getTime(),
          "send_sms": this.send_sms,
          "custom_fields_values": this.custom_fields,
        };

        if (!this_app.isNew) {
          // params.vu_id = this_app.data.id;
        }

        console.log("params: ", params);

        const endpoint = this_app.isNew ? API.CALL_REQUESTS_CREATE : API.CALL_REQUESTS_EDIT;

        axios.post(endpoint, params).then((res) => {
          console.log(res);

          this_app.$vs.loading.close();

          if (res.data.success) {
            this_app.$vs.notify({
              title: 'Success',
              text: this_app.isNew ? "Call is scheduled!" : "Call request is updated!",
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
      this.loadServices();
      this.loadUsers();
      this.loadCustomFields();
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
