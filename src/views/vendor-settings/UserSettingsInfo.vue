<template>
  <vx-card no-shadow>
    <!-- Name -->
    <vs-input class="w-full mt-8" label-placeholder="Company" v-model="vendor.name"></vs-input>

    <!-- Bio -->
<!--    <vs-textarea label="Bio" v-model="bio" placeholder="Your bio..." />-->

    <!-- SMS Template -->
    <vs-textarea class="w-full mt-5" label="SMS Template" rows="4" v-model="vendor.call_request_sms_template" placeholder="Your SMS call request template" />

    <!-- Website  -->
    <vs-input class="w-full mt-8" disabled label-placeholder="Call Center URL" v-model="website"></vs-input>

    <!-- DOB -->
<!--    <div class="mt-8">-->
<!--      <label class="text-sm">Birth Date</label>-->
<!--      <flat-pickr v-model="dob" :config="{ dateFormat: 'd F Y' }" class="w-full" />-->
<!--    </div>-->

    <!-- Country -->
<!--    <div class="mt-8">-->
<!--      <label class="text-sm">Country</label>-->
<!--      <v-select v-model="country" :options="countryOptions" :dir="$vs.rtl ? 'rtl' : 'ltr'" />-->
<!--    </div>-->

    <!-- Languages -->
<!--    <div class="mt-8">-->
<!--      <label class="text-sm">Languages</label>-->
<!--      <v-select v-model="lang_known" multiple :closeOnSelect="false" :options="langOptions" :dir="$vs.rtl ? 'rtl' : 'ltr'" />-->
<!--    </div>-->

    <!-- Mobile Number -->
<!--    <vs-input class="w-full mt-8" type="number" label-placeholder="Mobile" v-model="mobile" />-->


    <!-- Save & Reset Button -->
    <div class="flex flex-wrap items-center justify-end mt-base">
      <vs-button class="ml-auto mt-2" @click="update">Save Changes</vs-button>
<!--      <vs-button class="ml-4 mt-2" type="border" color="warning">Reset</vs-button>-->
    </div>
  </vx-card>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import vSelect from 'vue-select'
import axios from '@/axios.js'
import API from '@/api.js'

export default {
  props: ["vendor"],
  components: {
    flatPickr,
    vSelect
  },
  data () {
    return {
      bio: this.$store.state.AppActiveUser.about,
      dob: null,
      country: 'Bahrain',
      lang_known: ['English', 'Russian'],
      gender: 'male',
      mobile: '',
      company: this.$store.state.AppActiveUser.info.vendor.name,
      website: 'https://video.basma.ai/' + this.$store.state.AppActiveUser.info.vendor.username,

      // Options
      countryOptions: [
        { label: 'Australia',  value: 'australia'  },
        { label: 'France',     value: 'france'     },
        { label: 'Germany',    value: 'germany'    },
        { label: 'India',      value: 'india'      },
        { label: 'Jordan',     value: 'jordan'     },
        { label: 'Morocco',    value: 'morocco'    },
        { label: 'Portuguese', value: 'portuguese' },
        { label: 'Syria',      value: 'syria'      },
        { label: 'USA',        value: 'usa'        }
      ],
      langOptions: [
        { label: 'English',  value: 'english'  },
        { label: 'Spanish',  value: 'spanish'  },
        { label: 'French',   value: 'french'   },
        { label: 'Russian',  value: 'russian'  },
        { label: 'German',   value: 'german'   },
        { label: 'Arabic',   value: 'arabic'   },
        { label: 'Sanskrit', value: 'sanskrit' }
      ]
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    }
  },
  methods: {
    update() {
      // this.$refs.observer.validate();

      let this_app = this;

      this_app.$vs.loading();

      const vendor = this.activeUserInfo.info.vendor.username;

      let params = {
        "vu_token": this.activeUserInfo.token,
        "name": this.vendor.name,
        "call_request_sms_template": this.vendor.call_request_sms_template
      };

      axios.post(API.SETTINGS_EDIT, params).then((res) => {

        this_app.$vs.loading.close();

        if (res.data.success) {
          this_app.$vs.notify({
            title: 'Success',
            text: "Settings has been changed!",
            iconPack: 'feather',
            icon: 'icon-check-circle',
            color: 'success'
          });

        } else {
          const error = res.data.data.errors[0];

          this_app.$vs.notify({
            title: 'Error',
            text: error,
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }
}
</script>
