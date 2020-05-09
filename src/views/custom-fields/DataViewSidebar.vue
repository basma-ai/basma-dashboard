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

        <vs-input label="Label" v-model="label" class="mt-5 w-full" name="item-name" v-validate="'required'"/>

        <!-- SERVICE -->
        <vs-select v-validate="'required'" name="type" label="Type" v-model="type" class="w-full mt-5">
          <vs-select-item :value="r.value" :text="r.text" v-for="r in types"/>
        </vs-select>

        <!-- Values -->
        <vs-chips v-if="isChecklist" placeholder="Type and enter.." class="w-full mt-5" v-model="chips">
          <vs-chip
            color="primary"
            :key="chip"
            @click="remove(chip)"
            v-for="chip in chips"
            closable>
            {{ chip }}
          </vs-chip>
        </vs-chips>

        <vs-checkbox label="Is Mandatory?" v-model="is_mandatory" class="mt-5 w-full" name="item-name"
                     v-validate="'required'">Is Mandatory?
        </vs-checkbox>

        <vs-checkbox label="Is Visible?" v-model="is_visible_in_menus" class="mt-5 w-full" name="item-name"
                     v-validate="'required'">Is Visible?
        </vs-checkbox>

        <vs-checkbox label="Is For Agent?" v-model="is_for_agent" class="mt-5 w-full" name="item-name"
                     v-validate="'required'">Is For Agent?
        </vs-checkbox>

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
        type: '',
        chips: [],
        types: [{
          text: 'Text',
          value: 'text'
        }, {
          text: 'Number',
          value: 'number'
        }, {
          text: 'Mobile',
          value: 'mobile'
        }, {
          text: 'Checkbox',
          value: 'boolean'
        }, {
          text: 'Checklist',
          value: 'checklist'
        }],
        label: '',
        is_mandatory: false,
        is_visible_in_menus: false,
        is_for_agent: false,

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
          const {id, name, type, label, is_mandatory, is_visible_in_menus, agent_only, value_description} = JSON.parse(JSON.stringify(this.data))
          this.id = id
          this.name = name
          this.type = type
          this.label = label
          this.is_mandatory = is_mandatory
          this.is_visible_in_menus = is_visible_in_menus
          this.is_for_agent = agent_only
          if (null != value_description) {
            this.chips = JSON.parse(value_description)
          }
          this.initValues()
        }
        // Object.entries(this.data).length === 0 ? this.initValues() : { this.id, this.name, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
      }
    },
    computed: {
      isChecklist() {
        return this.type === "checklist"
      },
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
        return this.label
      },
      scrollbarTag() {
        return this.$store.getters.scrollbarTag
      }
    },
    methods: {
      remove(item) {
        this.chips.splice(this.chips.indexOf(item), 1)
      },
      initValues() {
        if (this.data.id) return
        this.id = null
        this.name = ''
        this.type = ''
        this.label = ''
        this.is_mandatory = false
        this.is_visible_in_menus = false
        this.is_for_agent = false
        this.chips = []
      },
      submitData() {
        if (!this.isFormValid) {
          return
        }

        const this_app = this;
        this_app.$vs.loading();

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "label": this.label,
          "type": this.type,
          "is_mandatory": this.is_mandatory,
          "is_visible_in_menus": this.is_visible_in_menus,
          "agent_only": this.is_for_agent
        };

        if (this_app.isChecklist) {
          params.value_description = JSON.stringify(this_app.chips)
        }

        if (!this_app.isNew) {
          params.custom_field_id = this_app.data.id;
        }

        const endpoint = this_app.isNew ? API.CUSTOM_FIELDS_CREATE : API.CUSTOM_FIELDS_EDIT;

        axios.post(endpoint, params).then((res) => {


          this_app.$vs.loading.close();

          if (res.data.success) {
            this_app.$vs.notify({
              title: 'Success',
              text: this_app.isNew ? "Custom field is created!" : "Custom field is updated!",
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
<style>
  .con-chips {
    justify-content: flex-start !important;
  }
</style>
