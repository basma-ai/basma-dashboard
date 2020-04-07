<template>
  <div id="data-list-list-view" class="data-list-container">

    <vs-table ref="table" :sst="true" :max-items="perPage" :total="total" :data="data">

      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

        <div class="flex flex-wrap-reverse items-center data-list-btn-container">

          <!-- ACTION - DROPDOWN -->
          <vs-dropdown vs-trigger-click class="dd-actions cursor-pointer mr-4 mb-4">

            <div
              class="p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-lg font-medium w-32 w-full">
              <span class="mr-2">Actions</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4"/>
            </div>

            <vs-dropdown-menu>

              <vs-dropdown-item>
                        <span class="flex items-center">
                          <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2"/>
                          <span>Delete</span>
                        </span>
              </vs-dropdown-item>

              <vs-dropdown-item>
                        <span class="flex items-center">
                          <feather-icon icon="ArchiveIcon" svgClasses="h-4 w-4" class="mr-2"/>
                          <span>Export</span>
                        </span>
              </vs-dropdown-item>

              <vs-dropdown-item>
                        <span class="flex items-center">
                          <feather-icon icon="FileIcon" svgClasses="h-4 w-4" class="mr-2"/>
                          <span>Print</span>
                        </span>
              </vs-dropdown-item>

              <vs-dropdown-item>
                        <span class="flex items-center">
                          <feather-icon icon="SaveIcon" svgClasses="h-4 w-4" class="mr-2"/>
                          <span>Another Action</span>
                        </span>
              </vs-dropdown-item>

            </vs-dropdown-menu>
          </vs-dropdown>

        </div>

        <!-- ITEMS PER PAGE -->
        <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
          <div
            class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
            <span class="mr-2">{{ from }} - {{ to <= total ? to : total }} of {{ total }}</span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4"/>
          </div>
          <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
          <vs-dropdown-menu>

            <vs-dropdown-item @click="changePerPage(10)">
              <span>10</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="changePerPage(20)">
              <span>20</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="changePerPage(50)">
              <span>50</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="changePerPage(100)">
              <span>100</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <template slot="thead">
        <vs-th sort-key="id">#ID</vs-th>
        <vs-th sort-key="name">Agent Name</vs-th>
        <vs-th sort-key="time">Time</vs-th>
        <vs-th sort-key="status">Status</vs-th>
        <vs-th sort-key="service">Service</vs-th>
        <vs-th>Action</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

          <vs-td :data="tr.id">
            <p class="font-medium truncate">{{ tr.id }}</p>
          </vs-td>

          <vs-td v-if="null != tr.vu" :data="tr.vu.name">
            <vs-avatar style="float: left" size="30px" :src="`https://ui-avatars.com/api/?name=${tr.vu.name}.jpg`"/>
            <span style="position: relative;top: 10px;margin-left: 5px;">
              {{ tr.vu.name }}
            </span>
          </vs-td>
          <vs-td v-else>
          </vs-td>

          <vs-td>
            <p>{{ -(new Date().getTime() - tr.creation_time) | duration('humanize', true) }}</p>
          </vs-td>

          <vs-td>
            <vs-chip :color="getOrderStatusColor(tr.status)" class="product-order-status">{{ tr.status }}</vs-chip>
          </vs-td>

          <vs-td v-if="null != tr.vendor_service">
            <p>{{ tr.vendor_service.name }}</p>
          </vs-td>
          <vs-td v-else>
          </vs-td>

          <vs-td class="whitespace-no-wrap">
            <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current"
                          @click.stop="viewData(tr)"/>
          </vs-td>

        </vs-tr>
        </tbody>
      </template>
    </vs-table>

    <vs-pagination :total="totalPages" v-model="currentPage" :max="5" prev-icon="arrow_back"
                   next-icon="arrow_forward"></vs-pagination>
  </div>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    components: {},
    data() {
      return {
        selected: [],
        data: [],
        total: 0,
        perPage: 10,
        currentPage: 1,
        from: 0,
        to: 0,
        isMounted: false,

        // Data Sidebar
        addNewDataSidebar: false,
        sidebarData: {}
      }
    },
    computed: {
      totalPages() {
        return this.total === 0 ? 1 : Math.ceil(this.total / this.perPage)
      },
      queriedItems() {
        return this.$refs.table ? this.$refs.table.queriedResults.length : this.data.length
      }
    },
    watch: {
      currentPage: {
        handler(current, old) {
          console.log("current", current, "old", old)
          this.loadData()
        },
        immediate: true
      },
    },
    methods: {
      changePerPage: function (pages) {
        console.log(pages);
        this.perPage = pages;
        this.currentPage = 1;
        this.loadData()
      },
      viewData(data) {
        // this.sidebarData = JSON.parse(JSON.stringify(this.blankData))
        // this.sidebarData = data
        console.log(data);
        this.$router.push(`/calls-history/view-call/${data.id}`).catch(() => {})
      },
      getOrderStatusColor(status) {
        if (status === 'ended') return 'success'
        if (status === 'started') return 'warning'
        if (status === 'missed') return 'danger'
        return 'primary'
      },
      getPopularityColor(num) {
        if (num > 90) return 'success'
        if (num > 70) return 'primary'
        if (num >= 50) return 'warning'
        if (num < 50) return 'danger'
        return 'primary'
      },
      toggleDataSidebar(val = false) {
        this.addNewDataSidebar = val
      },
      loadData() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "page": this.currentPage,
          "per_page": this.perPage
        };

        axios.post(API.CALLS_LIST, params).then((res) => {
          console.log(res);
          this_app.data = res.data.data.list;
          if (!!res.data.data.pagination.total) {
            this_app.total = res.data.data.pagination.total;
          }
          this_app.from = res.data.data.pagination.from;
          this_app.to = res.data.data.pagination.to;
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    created() {
      this.loadData()
    },
    mounted() {
      this.isMounted = true
    }
  }
</script>

<style lang="scss">
  #data-list-list-view {
    .vs-con-table {

      /*
        Below media-queries is fix for responsiveness of action buttons
        Note: If you change action buttons or layout of this page, Please remove below style
      */
      @media (max-width: 689px) {
        .vs-table--search {
          margin-left: 0;
          max-width: unset;
          width: 100%;

          .vs-table--search-input {
            width: 100%;
          }
        }
      }

      @media (max-width: 461px) {
        .items-per-page-handler {
          display: none;
        }
      }

      @media (max-width: 341px) {
        .data-list-btn-container {
          width: 100%;

          .dd-actions,
          .btn-add-new {
            width: 100%;
            margin-right: 0 !important;
          }
        }
      }

      .product-name {
        max-width: 23rem;
      }

      .vs-table--header {
        display: flex;
        flex-wrap: wrap;
        margin-left: 1.5rem;
        margin-right: 1.5rem;

        > span {
          display: flex;
          flex-grow: 1;
        }

        .vs-table--search {
          padding-top: 0;

          .vs-table--search-input {
            padding: 0.9rem 2.5rem;
            font-size: 1rem;

            & + i {
              left: 1rem;
            }

            &:focus + i {
              left: 1rem;
            }
          }
        }
      }

      .vs-table {
        border-collapse: separate;
        border-spacing: 0 1.3rem;
        padding: 0 1rem;

        tr {
          box-shadow: 0 4px 20px 0 rgba(0, 0, 0, .05);

          td {
            padding: 20px;

            &:first-child {
              border-top-left-radius: .5rem;
              border-bottom-left-radius: .5rem;
            }

            &:last-child {
              border-top-right-radius: .5rem;
              border-bottom-right-radius: .5rem;
            }
          }

          td.td-check {
            padding: 20px !important;
          }
        }
      }

      .vs-table--thead {
        th {
          padding-top: 0;
          padding-bottom: 0;

          .vs-table-text {
            text-transform: uppercase;
            font-weight: 600;
          }
        }

        th.td-check {
          padding: 0 15px !important;
        }

        tr {
          background: none;
          box-shadow: none;
        }
      }

      .vs-table--pagination {
        justify-content: center;
      }
    }
  }
</style>
