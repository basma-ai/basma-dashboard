<template>
    <div id="demo-card-analytics">
        <!-- ROW 1 -->
        <div v-if="false" class="vx-row">

            <!-- LINE CHART -->
            <div class="vx-col w-full md:w-2/3 mb-base">
                <vx-card title="Spend Summary">

                    <template slot="actions">
                        <feather-icon icon="SettingsIcon" svgClasses="w-6 h-6 text-grey"></feather-icon>
                    </template>

                    <div slot="no-body" class="p-6 pb-0">

                        <div class="flex" v-if="revenueComparisonLine.analyticsData">
                            <div class="mr-6">
                                <p class="mb-1 font-semibold">This Month</p>
                                <p class="text-3xl text-success"><sup class="text-base mr-1">$</sup>{{ revenueComparisonLine.analyticsData.thisMonth.toLocaleString() }}</p>
                            </div>
                            <div>
                                <p class="mb-1 font-semibold">Last Month</p>
                                <p class="text-3xl"><sup class="text-base mr-1">$</sup>{{ revenueComparisonLine.analyticsData.lastMonth.toLocaleString() }}</p>
                            </div>
                        </div>

                        <vue-apex-charts
                          type="line"
                          height="266"
                          :options="analyticsData.revenueComparisonLine.chartOptions"
                          :series="revenueComparisonLine.series" />
                    </div>
                </vx-card>
            </div>

            <!-- RADIAL CHART -->
            <div class="vx-col w-full md:w-1/3 mb-base">
                <vx-card title="Limit Overview">
                    <template slot="actions">
                        <feather-icon icon="HelpCircleIcon" svgClasses="w-6 h-6 text-grey"></feather-icon>
                    </template>

                    <!-- CHART -->
                    <template slot="no-body">
                        <div class="mt-10">
                            <vue-apex-charts
                              type="radialBar"
                              height="240"
                              :options="analyticsData.goalOverviewRadialBar.chartOptions"
                              :series="goalOverview.series" />
                        </div>
                    </template>

                    <!-- DATA -->
                    <div
                      v-if="goalOverview.analyticsData"
                      class="flex justify-between text-center mt-4"
                      slot="no-body-bottom">

                        <div class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0 border-l-0">
                            <p class="mt-4">Completed</p>
                            <p class="mb-4 text-3xl font-semibold">{{ goalOverview.analyticsData.completed.toLocaleString() }}</p>
                        </div>
                        <div class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0">
                            <p class="mt-4">In Progress</p>
                            <p class="mb-4 text-3xl font-semibold">{{ goalOverview.analyticsData.inProgress.toLocaleString() }}</p>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>

    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'

import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import analyticsData from './analyticsData.js'
import ChangeTimeDurationDropdown from '@/components/ChangeTimeDurationDropdown.vue'

export default {
  data () {
    return {
      // sessionsData: {},
      // productsOrder: {},
      // customersData: {},
      //
      // salesRadar: {},
      // supportTracker: {},

      revenueComparisonLine: {},
      goalOverview: {},

      // salesBarSession: {},
      // sessionDataTime: 'lastWeek',
      // todoToday: {},
      //
      // salesLine: {},
      // funding: {},
      //
      // browserStatistics: [],
      // clientRetentionBar: {},

      analyticsData
    }
  },
  components: {
    VueApexCharts,
    StatisticsCardLine,
    ChangeTimeDurationDropdown
  },
  created () {
    // // Sessions By Device
    // this.$http.get('/api/card/card-analytics/session-by-device')
    //   .then((response) => { this.sessionsData = response.data })
    //   .catch((error) => {  })
    //
    //   // Products Order
    // this.$http.get('/api/card/card-analytics/products-orders')
    //   .then((response) => { this.productsOrder = response.data })
    //   .catch((error) => {  })
    //
    //   // Customers
    // this.$http.get('/api/card/card-analytics/customers')
    //   .then((response) => { this.customersData = response.data })
    //   .catch((error) => {  })
    //
    //   // Sales Radar
    // this.$http.get('/api/card/card-analytics/sales/radar')
    //   .then((response) => { this.salesRadar = response.data })
    //   .catch((error) => {  })
    //
    //   // Support Tracker
    // this.$http.get('/api/card/card-analytics/support-tracker')
    //   .then((response) => { this.supportTracker = response.data })
    //   .catch((error) => {  })
    //
    //   // Revenue Comparison
    // this.$http.get('/api/card/card-analytics/revenue-comparison')
    //   .then((response) => { this.revenueComparisonLine = response.data })
    //   .catch((error) => {  })
    //
    //   // Goal Overview
    // this.$http.get('/api/card/card-analytics/goal-overview')
    //   .then((response) => { this.goalOverview = response.data })
    //   .catch((error) => {  })
    //
    //   // Sales bar
    // this.$http.get('/api/card/card-analytics/sales/bar')
    //   .then((response) => { this.salesBarSession = response.data })
    //   .catch((error) => {  })
    //
    //   // Todo
    // this.$http.get('/api/card/card-analytics/todo/today')
    //   .then((response) => { this.todoToday = response.data })
    //   .catch((error) => {  })
    //
    //   // Funding
    // this.$http.get('/api/card/card-analytics/funding')
    //   .then((response) => { this.funding = response.data })
    //   .catch((error) => {  })
    //
    //   // Sales line
    // this.$http.get('/api/card/card-analytics/sales/line')
    //   .then((response) => { this.salesLine = response.data })
    //   .catch((error) => {  })
    //
    //   // Browser Analytics
    // this.$http.get('/api/card/card-analytics/browser-analytics')
    //   .then((response) => { this.browserStatistics = response.data })
    //   .catch((error) => {  })
    //
    //   // Client Retention
    // this.$http.get('/api/card/card-analytics/client-retention')
    //   .then((response) => { this.clientRetentionBar = response.data })
    //   .catch((error) => {  })
  }
}
</script>


<style lang="scss">
#demo-card-analytics {
    .tasks-today-container {
        .tasks-today__task {
            transition: background .15s ease-out;
            .tasks-today__actions {
                display: none;
            }

            &:hover {
                background: rgba(var(--vs-primary),.04) ;
                .tasks-today__actions {
                    display: flex;
                }
            }
        }
    }
}
</style>
