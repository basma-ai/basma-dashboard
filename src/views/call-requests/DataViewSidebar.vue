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

        <!-- Schedule Date/Time -->
        <label class="vs-input--label">Schedule Date/Time</label>
<!--        <flat-pickr :config="configdateTimePicker" v-model="datetime" placeholder="Date Time" class="w-full mb-6"/>-->
        <datetime type="datetime" v-model="datetime" use12-hour :minute-step="5" class="w-full mb-6"></datetime>

        <!-- AGENT -->
        <label class="vs-input--label">Agent</label>
        <multiselect class="w-full mb-6" v-model="selected_user" track-by="name" label="name" :options="users" :searchable="true" :allow-empty="false" :show-labels="false">
          <template slot="singleLabel" slot-scope="{ option }">{{ option.name }}</template>
        </multiselect>

        <!--        <select name="user_id" label="Agents" v-model="user_id" v-validate="'required'"-->
<!--                style="width:100%;font-size:16px;padding:10px!important;">-->
<!--          <option v-for="r in users" :key="r.id" :value="r.id">{{r.name}}</option>-->
<!--        </select>-->

        <!-- SERVICE -->
        <div v-if="services.length > 0">
          <label class="vs-input--label">Service</label>
          <multiselect  class="w-full mb-6" v-model="selected_service" track-by="name" label="name" :options="services" :searchable="true" :allow-empty="false" :show-labels="false">
            <template slot="singleLabel" slot-scope="{ option }">{{ option.name }}</template>
          </multiselect>
        </div>

        <custom-fields :is_agent_view="false" v-if="custom_fields != null"
                       :custom_fields="custom_fields"></custom-fields>

        <vs-checkbox class="w-full mb-6" v-model="send_sms">Send SMS (upon agent making the call)</vs-checkbox>
        <vs-checkbox class="w-full mb-6" v-model="make_it_ring">Ring in Agent Phone</vs-checkbox>
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
  import CustomFields from '@/components/CustomFields.vue';

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
      flatPickr,
      CustomFields
    },
    data() {
      return {
        // errors: [''],
        chips: [],
        name: '',
        mobile: '',
        services: [],
        selected_service: null,
        users: [],
        selected_user: null,
        custom_fields: [],

        send_sms: true,
        make_it_ring: false,

        datetime: new Date().toISOString(),
        configdateTimePicker: {
          enableTime: true,
          // dateFormat: 'd-m-Y H:i',
          minuteIncrement: 15,
          minDate: new Date(),
          // defaultDate: new Date().toDateString(),
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

            const {username, name, email, role, groups, roles} = res.data.data.user;
            this_app.username = username
            this_app.name = name
            this_app.email = email
            this_app.role = role
            this_app.initValues()
          }).catch((err) => {

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
          return this.selected_user && this.datetime
        } else {
          return this.selected_user && this.datetime
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

          let custom_fields = res.data.data.list;

          let matched = custom_fields.filter((a) => {
            return a.type === 'mobile' && a.agent_only === 0;
          });

          if (matched[0] == null) {
            custom_fields.unshift({
              type: "mobile",
              label: "Mobile",
              value_description: "",
              value: "",
              is_mandatory: 1,
              agent_only: 0
            })
          }

          // if (custom_fields.filter(x => x['name'].toLowerCase() === 'name') == null) {
          //   custom_fields.unshift({
          //     type: "text",
          //     name: "name",
          //     label: "Name",
          //     is_mandatory: 1})
          // }

          this_app.custom_fields = custom_fields

        }).catch((err) => {

        });
      },
      loadServices() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token
        };

        axios.post(API.SERVICES_LIST, params).then((res) => {

          this_app.services = res.data.data.list;
        }).catch((err) => {

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

          this_app.users = res.data.data.list;

          let user = this_app.users.filter((u) => {
              return u.id == this_app.$store.state.AppActiveUser.info.id
          })

          if (user[0] != null) {
            this_app.selected_user = user[0];
          }

        }).catch((err) => {

        });
      },
      initValues() {
        if (this.data.id) return
        this.datetime = new Date().toISOString()
        // this.selected_user = null
        this.selected_service = null
      },
      submitData() {
        if (!this.isFormValid) {
          return
        }

        const this_app = this;
        this_app.$vs.loading();

        let params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "vu_id": this.selected_user.id,
          "scheduled_time": this.$moment(this.datetime).unix() * 1000,
          "send_sms": this.send_sms,
          "make_it_ring": this.make_it_ring,
          "custom_fields_values": this.custom_fields,
        };

        if (!this_app.isNew) {
          // params.vu_id = this_app.data.id;
        }

        if (this.selected_service !== null) {
          params.service_id = this.selected_service.id
        }

        const endpoint = this_app.isNew ? API.CALL_REQUESTS_CREATE : API.CALL_REQUESTS_EDIT;

        axios.post(endpoint, params).then((res) => {

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

<style>
  .vdatetime-input {
    padding: .7rem !important;
    color: inherit;
    position: relative;
    border-radius: 5px;
    border: 1px solid rgba(0,0,0,.2);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-box-shadow: 0 0 0 0 rgba(0,0,0,.15);
    box-shadow: 0 0 0 0 rgba(0,0,0,.15);
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
    width: 100%;
    font-size: 1rem !important;
  }
</style>
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
