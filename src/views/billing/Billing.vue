<template>
  <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" class="tabs-shadow-none" id="profile-tabs" :key="isSmallerScreen">
    <vs-tab icon-pack="feather" icon="icon-eye" :label="!isSmallerScreen ? 'Overview' : ''">
      <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
        <billing-overview :billing="billing"/>
      </div>
    </vs-tab>
<!--    <vs-tab icon-pack="feather" icon="icon-check-circle" :label="!isSmallerScreen ? 'History' : ''">-->
<!--      <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">-->
<!--        <billing-history />-->
<!--      </div>-->
<!--    </vs-tab>-->
    <vs-tab icon-pack="feather" icon="icon-file-text" :label="!isSmallerScreen ? 'Invoices' : ''">
      <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
        <billing-invoices :prop-invoices="invoices" />
      </div>
    </vs-tab>
    <vs-tab icon-pack="feather" icon="icon-credit-card" :label="!isSmallerScreen ? 'Payment methods' : ''">
      <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
        <billing-payment-methods :payment-methods="paymentMethods" />
      </div>
    </vs-tab>
  </vs-tabs>
</template>

<script>
import BillingOverview from './BillingOverview.vue'
import BillingHistory from './BillingHistory.vue'
import BillingInvoices from './BillingInvoices.vue'
import BillingPaymentMethods from './BillingPaymentMethods.vue'
import axios from '@/axios.js'
import API from '@/api.js'

export default {
  components: {
    BillingOverview,
    BillingHistory,
    BillingInvoices,
    BillingPaymentMethods
  },
  data () {
    return {
      vendor: null,
      billing: null,
      paymentMethods: null,
      invoices: null
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    },
    isSmallerScreen () {
      return this.$store.state.windowWidth < 768
    }
  },
  created() {
    // this.getVendor()
    this.loadBilling()
    this.loadInvoices()
    this.loadPaymentMethods()
  },
  methods: {
    getVendor(){
      let this_app = this;

      let params = {
        "vu_token": this.activeUserInfo.token
      };

      axios.post(API.SETTINGS_GET, params).then((res) => {
        this_app.vendor = res.data.data.vendor
      }).catch((err) => {

      });
    },
    loadInvoices() {
      const this_app = this;

      const params = {
        "vu_token": this.$store.state.AppActiveUser.token
      };

      axios.post(API.BILLING_INVOICES_LIST, params).then((res) => {
        this_app.invoices = res.data.data.list;
      }).catch((err) => {

      });
    },
    loadBilling() {
      const this_app = this;

      const params = {
        "vu_token": this.$store.state.AppActiveUser.token,
      };

      axios.post(API.BILLING_OVERVIEW, params).then((res) => {
        this_app.billing = res.data.data;
      }).catch((err) => {

      });
    },
    loadPaymentMethods() {
      axios.post(API.BILLING_LIST_CARDS, {
        vu_token: this.$store.state.AppActiveUser.token
      })
        .then(function (response) {
          this.paymentMethods = response.data.data.list;
        }.bind(this));
    },
  }
}
</script>

<style lang="scss">
#profile-tabs {
  .vs-tabs--content {
    padding: 0;
  }
}
</style>
