<template>
  <div id="demo-card-analytics">
    <v-loading v-if="null == billing"></v-loading>

    <div class="vx-row" v-if="null != billing">
      <div class="vx-col w-full md-12 mb-base">
        <vx-card title="Plan details" >
          <span>Current Plan: </span><h4 class="mb-5" :class="{'text-success': billing.package.name != 'inactive'}"><b>{{billing.package.name}}</b></h4>
          <span>Trail days left: </span><h4 class="mb-5"><b>14 </b></h4>
          <span>Credit Balance: </span><h4 class="mb-5">$<b>0</b></h4>
<!--          <router-link tag="div" disabled class="vx-logo cursor-pointer flex items-center" to="/billing/subscribe">-->
            <vs-button color="success" disabled class="mt-4">Upgrade</vs-button>
<!--          </router-link>-->
        </vx-card>
      </div>
    </div>

    <div class="vx-row" v-if="null != billing">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="UserIcon"
          icon-right
          :statistic="billing.users.existing_count + '/' + billing.users.limit"
          statisticTitle="Users"/>
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="UsersIcon"
          icon-right
          :statistic="billing.groups.existing_count + '/' + billing.groups.limit"
          statisticTitle="Groups"/>
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="ListIcon"
          icon-right
          :statistic="billing.services.existing_count + '/' + billing.services.limit"
          statisticTitle="Services"/>
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="SquareIcon"
          icon-right
          :statistic="billing.custom_fields.existing_count + '/∞'"
          statisticTitle="Custom Fields"/>
      </div>
    </div>

  </div>
</template>

<script>
  import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
  import axios from '@/axios.js'
  import API from '@/api.js'
  import VLoading from '@/components/VLoading.vue';

  export default {
    props: {
      billing: null
    },
    data() {
      return {
        popupActive: false
      }
    },
    components: {
      StatisticsCardLine,
      VLoading
    },
    methods: {
      loadBilling() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
        };

        axios.post(API.BILLING_OVERVIEW, params).then((res) => {
          this_app.billing = res.data.data;
        }).catch((err) => {

        });
      }
    },
    created() {
      // this.loadBilling();
    }
  }
</script>

<style lang="scss">

</style>
