<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <h4>{{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }} ITEM</h4>
        <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :settings="settings" :key="$vs.rtl">

      <div class="p-6">

        <vs-input v-validate="'required'" name="username" label-placeholder="Username" v-model="username" class="w-full mb-6" />

        <vs-input v-validate="'required'" name="email" label-placeholder="Email" v-model="email" class="w-full mb-6"/>

        <vs-input v-if="Object.entries(this.data).length === 0" v-validate="'required'" type="password" name="password" label-placeholder="Password" v-model="password" class="w-full mb-6"/>

        <vs-input v-validate="'required'" name="name" label-placeholder="Name" v-model="name" class="w-full mb-6"/>

        <vs-select v-validate="'required'" name="role" label="Role" v-model="role" class="w-full mb-6">
          <vs-select-item :value="r" :text="r.charAt(0).toUpperCase() + r.slice(1)" v-for="r in roles" />
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
import { Validator } from 'vee-validate';

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
      default: () => {}
    }
  },
  components: {
    VuePerfectScrollbar
  },
  data () {
    return {
      // errors: [''],
      roles: ['agent','admin'],
      username: '',
      password: '',
      name: '',
      email: '',
      role: 'agent',
      category_choices: [
        {text:'Audio', value:'audio'},
        {text:'Computers', value:'computers'},
        {text:'Fitness', value:'fitness'},
        {text:'Appliance', value:'appliance'}
      ],

      order_status_choices: [
        {text:'Pending', value:'pending'},
        {text:'Canceled', value:'canceled'},
        {text:'Delivered', value:'delivered'},
        {text:'On Hold', value:'on_hold'}
      ],
      settings: { // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: .60
      }
    }
  },
  watch: {
    isSidebarActive (val) {
      if (!val) return
      if (Object.entries(this.data).length === 0) {
        this.initValues()
        // this.$validator.reset()
      } else {
        const { username, name, email, role} = JSON.parse(JSON.stringify(this.data))
        this.username = username
        this.name = name
        this.email = email
        this.role = role
        this.initValues()
      }
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    }
  },
  computed: {
    isSidebarActiveLocal: {
      get () {
        return this.isSidebarActive
      },
      set (val) {
        if (!val) {
          this.$emit('closeSidebar')
          // this.$validator.reset()
          this.initValues()
        }
      }
    },
    isFormValid () {
      if (Object.entries(this.data).length === 0){
        return this.username && this.password && this.name && this.email && this.role

      }else{
        return this.username && this.name && this.email && this.role
      }
    },
    scrollbarTag () { return this.$store.getters.scrollbarTag }
  },
  methods: {
    initValues () {
      if (this.data.id) return
      this.username = ''
      this.password = ''
      this.name = ''
      this.email = ''
    },
    submitData () {
      if (!this.isFormValid){
        return
      }

      const this_app = this;
      this_app.$vs.loading();

      const params = {
        "vu_token": this.$store.state.AppActiveUser.token,
        "username": this.username,
        "password": this.password,
        "name": this.name,
        "email": this.email,
        "role": this.role
      };

      axios.post(API.USERS_CREATE, params).then((res) => {
        console.log(res);

        this_app.$vs.loading.close();

        console.log(res);

        if (!res.data.success){
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
            text: "User is created!",
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
