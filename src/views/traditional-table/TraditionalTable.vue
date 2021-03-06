<template>

  <div id="page-user-list">

    <vx-card ref="filterCard" title="Filters" class="user-list-filters mb-8" actionButtons @refresh="resetColFilters" @remove="resetColFilters">
      <div class="vx-row">
        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Role</label>
          <v-select :options="roleOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="roleFilter" class="mb-4 md:mb-0" />
        </div>
        <div class="vx-col md:w-1/4 sm:w-1/2 w-full">
          <label class="text-sm opacity-75">Department</label>
          <v-select :options="departmentOptions" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" v-model="departmentFilter" />
        </div>
      </div>
    </vx-card>

    <div class="vx-card p-6">

      <div class="flex flex-wrap items-center">

        <!-- ITEMS PER PAGE -->
        <div class="flex-grow">
          <vs-dropdown vs-trigger-click class="cursor-pointer">
            <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
              <span class="mr-2">{{ from }} - {{ to <= total ? to : total }} of {{ total }}</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
            <vs-dropdown-menu>

              <vs-dropdown-item @click="changePerPage(10)">
                <span>10</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="changePerPage(20)">
                <span>20</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="changePerPage(25)">
                <span>25</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="changePerPage(30)">
                <span>30</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>

      </div>


      <!-- AgGrid Table -->
      <ag-grid-vue
        ref="agGridTable"
        :components="components"
        :gridOptions="gridOptions"
        class="ag-theme-material w-100 my-4 ag-grid-table"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :rowData="callsData"
        rowSelection="single"
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
        :max="7"
        v-model="currentPage" />

    </div>
  </div>

</template>

<script>
import axios from '@/axios.js'
import { AgGridVue } from 'ag-grid-vue'
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss'
import vSelect from 'vue-select'

// Store Module
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

// Cell Renderer
import CellRendererLink from './CellRendererLink.vue'
import CellRendererStatus from './CellRendererStatus.vue'
import CellRendererVerified from './CellRendererVerified.vue'
import CellRendererActions from './CellRendererActions.vue'
import CellRendererTime from './CellRendererTime.vue'


export default {
  components: {
    AgGridVue,
    vSelect,

    // Cell Renderer
    CellRendererLink,
    CellRendererStatus,
    CellRendererVerified,
    CellRendererActions,
    CellRendererTime
  },
  data () {
    return {
	    callsData: [],
      total: 0,
      perPage: 10,
      currentPage: 1,
      from: 0,
      to: 0,
      // Filter Options
      roleFilter: { label: 'All', value: 'all' },
      roleOptions: [
        { label: 'All', value: 'all' },
        { label: 'Admin', value: 'admin' },
        { label: 'Agent', value: 'agent' }
	    ],
      departmentFilter: { label: 'All', value: 'all' },
      departmentOptions: [
        { label: 'All', value: 'all' }
      ],

      searchQuery: '',

      // AgGrid
      gridApi: null,
      gridOptions: {
        rowSelection: 'single'
      },
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMenu: true
      },
      columnDefs: [
        {
          headerName: 'ID',
          field: 'id',
          width: 125,
          filter: true,
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true
        },
        {
          headerName: 'Status',
          field: 'status',
          filter: true,
          width: 210,
        },
        {
          headerName: 'Time',
          field: 'creation_time',
          filter: true,
          width: 225,
          cellRendererFramework: 'CellRendererTime'
        },
        {
          headerName: 'Agent',
          field: 'vu.name',
          filter: true,
          width: 200
        },
        {
          headerName: 'Role',
          field: 'vu.role',
          filter: true,
          width: 200
        },
        {
          headerName: 'Service',
          field: 'vendor_service.name',
          filter: true,
          width: 250
        },
        // {
        //   headerName: 'Department',
        //   field: 'department',
        //   filter: true,
        //   width: 150
        // },
      ],

      // Cell Renderer Components
      components: {
        CellRendererLink,
        CellRendererStatus,
        CellRendererVerified,
        CellRendererActions,
        CellRendererTime
      }
    }
  },
  watch: {
    currentPage(obj) {

      this.loadData();
    },
    roleFilter ( v) {
      this.setColumnFilter('role', obj.value)
    },
    statusFilter (obj) {
      this.setColumnFilter('status', obj.value)
    },
    isVerifiedFilter (obj) {
      const val = obj.value === 'all' ? 'all' : obj.value === 'yes' ? 'true' : 'false'
      this.setColumnFilter('is_verified', val)
    },
    departmentFilter (obj) {
      this.setColumnFilter('department', obj.value)
    }
  },
  computed: {
    totalPages() {
      return this.total === 0 ? 1 : Math.ceil(this.total / this.perPage)
    }
  },
  methods: {
    changePerPage: function(pages) {

      this.perPage = pages;
      this.currentPage = 1;
      this.loadData()
      this.gridApi.paginationSetPageSize(pages)
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
	},
	loadData() {
		const this_app = this;

    const params = {
      "vu_token": this.$store.state.AppActiveUser.token,
      "page": this.currentPage,
      "per_page": this.perPage
    };

		axios.post("/vendor/calls/list", params).then((res) => {

			this_app.callsData = res.data.data.list;
      if (!!res.data.data.pagination.total) {
        this_app.total = res.data.data.pagination.total;
      }
      this_app.from = res.data.data.pagination.from;
      this_app.to = res.data.data.pagination.to;
		}).catch((err) => {

		});
	}
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
  },
  created () {
	this.loadData();
  }
}

</script>

<style lang="scss">
#page-user-list {
  .user-list-filters {
    .vs__actions {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-58%);
    }
  }
}
</style>
