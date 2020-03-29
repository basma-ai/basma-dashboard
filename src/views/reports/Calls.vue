<template>
  <div id="ag-grid-demo">

<!--    <vx-card ref="filterCard" title="Filters" class="user-list-filters mb-8" actionButtons @refresh="resetColFilters" @remove="resetColFilters">-->
<!--      <div class="vx-row">-->
<!--        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">-->
<!--          <label class="text-sm opacity-75">Role</label>-->
<!--          <v-select :options="roleOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="roleFilter" class="mb-4 md:mb-0" />-->
<!--        </div>-->
<!--        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">-->
<!--          <label class="text-sm opacity-75">Status</label>-->
<!--          <v-select :options="statusOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="statusFilter" class="mb-4 md:mb-0" />-->
<!--        </div>-->
<!--        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">-->
<!--          <label class="text-sm opacity-75">Verified</label>-->
<!--          <v-select :options="isVerifiedOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="isVerifiedFilter" class="mb-4 sm:mb-0" />-->
<!--        </div>-->
<!--        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">-->
<!--          <label class="text-sm opacity-75">Department</label>-->
<!--          <v-select :options="departmentOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="departmentFilter" />-->
<!--        </div>-->
<!--      </div>-->
<!--    </vx-card>-->

    <div class="vx-card p-6">

      <!-- TABLE ACTION ROW -->
      <div class="flex flex-wrap justify-between items-center">

        <!-- ITEMS PER PAGE -->
        <div class="mb-4 md:mb-0 mr-4 ag-grid-table-actions-left">
          <vs-dropdown vs-trigger-click class="cursor-pointer">
            <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2">{{ from }} - {{ to <= total ? to : total }} of {{ total }}</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
            <vs-dropdown-menu>

              <vs-dropdown-item @click="changePerPage(10)">
                <span>20</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="changePerPage(20)">
                <span>50</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="changePerPage(50)">
                <span>100</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="changePerPage(100)">
                <span>150</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

        <!-- TABLE ACTION COL-2: SEARCH & EXPORT AS CSV -->
        <div class="flex flex-wrap items-center justify-between ag-grid-table-actions-right">
          <vs-input class="mb-4 md:mb-0 mr-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Search..." />
          <vs-button class="mb-4 md:mb-0" @click="gridApi.exportDataAsCsv()">Export as CSV</vs-button>
        </div>
      </div>
      <ag-grid-vue
        ref="agGridTable"
        :components="components"
        :gridOptions="gridOptions"
        class="ag-theme-material w-100 my-4 ag-grid-table"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="data"
        rowSelection="multiple"
        colResizeDefault="shift"
        :animateRows="true"
        :floatingFilter="true"
        :pagination="true"
        :paginationPageSize="perPage"
        :suppressPaginationPanel="true"
        :enableRtl="$vs.rtl">
      </ag-grid-vue>
      <vs-pagination
        :total="totalPages"
        :max="maxPageNumbers"
        v-model="currentPage" />

    </div>
  </div>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'
  import { AgGridVue } from 'ag-grid-vue'
  import contacts from './data.json'

  import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
  import CellRendererTime from './CellRendererTime.vue'

  export default {
    components: {
      AgGridVue,
      CellRendererTime
    },
    data () {
      return {
        // Filter Options
        roleFilter: { label: 'All', value: 'all' },
        roleOptions: [
          { label: 'All', value: 'all' },
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
          { label: 'Staff', value: 'staff' }
        ],

        statusFilter: { label: 'All', value: 'all' },
        statusOptions: [
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Deactivated', value: 'deactivated' },
          { label: 'Blocked', value: 'blocked' }
        ],

        isVerifiedFilter: { label: 'All', value: 'all' },
        isVerifiedOptions: [
          { label: 'All', value: 'all' },
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' }
        ],

        departmentFilter: { label: 'All', value: 'all' },
        departmentOptions: [
          { label: 'All', value: 'all' },
          { label: 'Sales', value: 'sales' },
          { label: 'Development', value: 'development' },
          { label: 'Management', value: 'management' }
        ],

        searchQuery: '',
        gridOptions: {},
        maxPageNumbers: 5,
        selected: [],
        data: [],
        total: 0,
        perPage: 10,
        currentPage: 1,
        from: 0,
        to: 0,
        gridApi: null,
        defaultColDef: {
          sortable: true,
          editable: true,
          resizable: true,
          suppressMenu: true
        },
        columnDefs: [
          {
            headerName: 'id',
            field: 'id',
            width: 175,
            filter: true,
            checkboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: true
          },
          {
            headerName: 'Agent Name',
            field: 'vu.name',
            filter: true,
            width: 175
          },
          {
            headerName: 'Service',
            field: 'vendor_service.name',
            filter: true,
            width: 250,
          },
          {
            headerName: 'Created',
            field: 'creation_time',
            filter: true,
            width: 250,
            cellRendererFramework: 'CellRendererTime'
          },
          {
            headerName: 'Answered',
            field: 'answer_time',
            filter: true,
            width: 250,
            cellRendererFramework: 'CellRendererTime'
          },
          {
            headerName: 'Duration (Seconds)',
            field: 'duration',
            filter: true,
            width: 150
          },
          {
            headerName: 'Call Status',
            field: 'status',
            filter: true,
            width: 125
          },
          {
            headerName: 'Case Status',
            field: 'case_status',
            filter: true,
            width: 125
          },
          {
            headerName: 'Rating',
            field: 'rating',
            filter: true,
            width: 125
          }
        ],

        // Cell Renderer Components
        components: {
          CellRendererTime,
        }
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
      // '$store.state.windowWidth' (val) {
      //   if (val <= 576) {
      //     this.maxPageNumbers = 4
      //     this.gridOptions.columnApi.setColumnPinned('email', null)
      //   } else this.gridOptions.columnApi.setColumnPinned('email', 'left')
      // }
    },
    computed: {
      paginationPageSize () {
        if (this.gridApi) return this.gridApi.paginationGetPageSize()
        else return 500
      },
      totalPages() {
        return this.total === 0 ? 1 : Math.ceil(this.total / this.perPage)
      },
      currentPage: {
        get () {
          if (this.gridApi) return this.gridApi.paginationGetCurrentPage() + 1
          else return 1
        },
        set (val) {
          this.gridApi.paginationGoToPage(val - 1)
        }
      }
    },
    methods: {
      changePerPage: function (pages) {
        console.log(pages);
        this.perPage = pages;
        this.currentPage = 1;
        this.loadData()
      },
      loadData() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "page": this.currentPage,
          "per_page": this.perPage
        };

        axios.post(API.REPORTS_CALLS, params).then((res) => {
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
      },
      setColumnFilter (column, val) {
        const filter = this.gridApi.getFilterInstance(column)
        let modelObj = null

        if (val !== 'all') {
          modelObj = { type: 'equals', filter: val }
        }

        filter.setModel(modelObj)
        this.gridApi.onFilterChanged()
      },
      resetColFilters () {
        // Reset Grid Filter
        this.gridApi.setFilterModel(null)
        this.gridApi.onFilterChanged()

        // Reset Filter Options
        this.roleFilter = this.statusFilter = this.isVerifiedFilter = this.departmentFilter = { label: 'All', value: 'all' }

        this.$refs.filterCard.removeRefreshAnimation()
      },
      updateSearchQuery (val) {
        this.gridApi.setQuickFilter(val)
      }
    },
    created() {
      this.loadData()
    },
    mounted () {
      this.gridApi = this.gridOptions.api

      /* =================================================================
        NOTE:
        Header is not aligned properly in RTL version of agGrid table.
        However, we given fix to this issue. If you want more robust solution please contact them at gitHub
      ================================================================= */
      if (this.$vs.rtl) {
        const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
        header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
      }
    }
  }

</script>

<style lang="scss">
  #ag-grid-demo {
    .user-list-filters {
      .vs__actions {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-58%);
      }
    }
  }
  .ag-grid-table {
    min-height: 600px;
  }
</style>
