<template>
  <div id="dashboard-analytics">

    <div class="vx-row">
      <!-- CARD 1: CONGRATS -->
      <div class="vx-col w-full lg:w-1/2 mb-base">
        <vx-card slot="no-body" class="text-center bg-primary-gradient greet-user">
          <img src="@/assets/images/elements/decore-left.png" class="decore-left" alt="Decore Left" width="200">
          <img src="@/assets/images/elements/decore-right.png" class="decore-right" alt="Decore Right" width="175">
          <feather-icon icon="AwardIcon" class="p-6 mb-8 bg-primary inline-flex rounded-full text-white shadow"
                        svgClasses="h-8 w-8"></feather-icon>
          <h1 class="mb-6 text-white">Congratulations {{ this.$store.state.AppActiveUser.name.split(' ')[0] }},</h1>
          <p class="xl:w-3/4 lg:w-4/5 md:w-2/3 w-4/5 mx-auto text-white">You have discovered basma.ai, you can now rock
            &amp; roll like a rock star!</p>
        </vx-card>
      </div>
      <!-- CARD 2: SUBSCRIBERS GAINED -->
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line icon="ShoppingBagIcon" :statistic="analytics.total_calls" statisticTitle="Total Calls"
                              type="area"></statistics-card-line>
      </div>

      <!-- CARD 3: ORDER RECIEVED -->
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line icon="ShoppingBagIcon"
                              :statistic="(analytics.answered_calls == 0) ? '0%' : parseFloat((analytics.answered_calls/analytics.total_calls)*100).toFixed(2)+'%'"
                              statisticTitle="Answered" color="success" type="area"></statistics-card-line>
      </div>

      <!-- CARD 4: ORDER RECIEVED -->
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base"
           v-if="$store.state.AppActiveUser.role == 'admin'">
        <statistics-card-line icon="ShoppingBagIcon"
                              :statistic="(analytics.unanswered_calls == 0) ? '0%' : parseFloat((analytics.unanswered_calls/analytics.total_calls)*100).toFixed(2)+'%'"
                              statisticTitle="Unnswered" color="danger" type="area"></statistics-card-line>
      </div>

      <!-- CARD 5: ORDER RECIEVED -->
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line icon="ShoppingBagIcon" :statistic="analytics.most_active_agents[0].name"
                              statisticTitle="Most Active Agent" color="success" type="area"></statistics-card-line>
      </div>
    </div>
  </div>
</template>

<script>

  import axios from '@/axios.js'
  import API from '@/api.js'
  import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'

  export default {
    data() {
      return {
        analytics: {
          total_calls: 0,
          answered_calls: 0,
          unanswered_calls: 0,
          most_active_agents: [{name:""}]
        },
        loading: false
      }
    },
    components: {
      // VueApexCharts,
      StatisticsCardLine,
      // ChangeTimeDurationDropdown,
      // VxTimeline
    },
    created() {
      this.loadData();
    },
    methods: {
      loadData() {
        this.loading = true;
        const this_app = this;
        axios.post(API.DASHBOARD_NUMBERS, {"vu_token": this.$store.state.AppActiveUser.token}).then((res) => {
          console.log(res);
          this_app.analytics = res.data.data;
          this.loading = false;
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  }
</script>

<style lang="scss">
  /*! rtl:begin:ignore */
  #dashboard-analytics {
    .greet-user {
      position: relative;

      .decore-left {
        position: absolute;
        left: 0;
        top: 0;
      }

      .decore-right {
        position: absolute;
        right: 0;
        top: 0;
      }
    }

    @media(max-width: 576px) {
      .decore-left, .decore-right {
        width: 140px;
      }
    }
  }

  /*! rtl:end:ignore */
</style>
