<template>
  <div id="data-list-list-view" class="data-list-container">

    <vs-table ref="table" :sst="true" :max-items="perPage" :total="total" :data="data">

      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">

        <div class="flex flex-wrap-reverse items-center data-list-btn-container">

          <!-- ACTION - DROPDOWN -->
          <vs-dropdown vs-trigger-click class="dd-actions cursor-pointer mr-4 mb-4">

            <div
              class="p-4 shadow-drop rounded-lg d-theme-dark-bg cursor-pointer flex items-center justify-center text-base font-medium w-32 w-full">
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
        <vs-th sort-key="id">Event #</vs-th>
        <vs-th sort-key="id">Time</vs-th>
        <vs-th sort-key="name">User</vs-th>
        <vs-th sort-key="time">Model</vs-th>
        <vs-th sort-key="status">Item ID #</vs-th>
        <vs-th sort-key="service">Event Type</vs-th>
        <vs-th>Changes</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

          <vs-td>
            <p>{{ tr.id }}</p>
          </vs-td>

          <vs-td>
            <p>{{ -(new Date().getTime() - tr.time) | duration('humanize', true) }}</p>
          </vs-td>

          <vs-td>
            <p>{{ tr.user.name }}</p>
          </vs-td>

          <vs-td>
            <p>{{ tr.table_name }}</p>
          </vs-td>

          <vs-td>
            <p>{{ tr.row_id }}</p>
          </vs-td>

          <vs-td>
            <p>{{ tr.type }}</p>
          </vs-td>

          <vs-td  class="whitespace-no-wrap">
            <feather-icon style="top: 5px;" icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current" @click.stop="viewData(tr)"/>
            <span v-if="Object.keys(tr.changed).length > 0">
              ({{maybe_pluralize(Object.keys(tr.changed).length, 'change')}})
            </span>
          </vs-td>

        </vs-tr>
        </tbody>
      </template>
    </vs-table>

    <vs-pagination :total="totalPages" v-model="currentPage" :max="5" prev-icon="arrow_back"
                   next-icon="arrow_forward"></vs-pagination>

    <vs-popup title="Changes" :active.sync="changes_dialog" width="700">

      <v-card>
        <v-card-text v-if="selected_item != null">

          <div style="padding:20px 0">
            <div class="title text-center">
              Item #{{selected_item.row_id}} ({{selected_item.table_name}})
            </div>
            <div class="text-center">
              {{$moment(new Date(selected_item.time*1000)).format('LLL')}}
              <br />
              event type: <strong>{{selected_item.type}}</strong>
              <br />
              log event #<strong>{{selected_item.id}}</strong>
            </div>
          </div>

          <div v-if="Object.keys(selected_item.changed).length < 1" class="title text-center">
            <div style="height:20px"></div>
            No changes
          </div>

          <div v-if="Object.keys(selected_item.changed).length > 0">


            <vs-table :data="[{id:''}]">
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left">Field</th>
                  <th class="text-left highlighted_tf"><strong>Old value</strong></th>
                  <th class="highlighted_tf"></th>
                  <th class="text-left highlighted_tf"><strong>New value</strong></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in Object.keys(selected_item.changed)">
                  <td class="highlighted_tf"><strong>{{item}}</strong></td>
                  <td>

                    <UserChip v-if="item.includes('user_id')" :user="selected_item.old_value[item.replace('user_id', 'user')]"></UserChip>

                    <span v-if="!item.includes('user_id')">
                                            {{selected_item.old_value[item]}}
                                        </span>
                  </td>
                  <td>
                    →
                  </td>
                  <td>
                    <UserChip v-if="item.includes('user_id')" :user="selected_item.new_value[item.replace('user_id', 'user')]"></UserChip>

                    <span v-if="!item.includes('user_id')">
                                            {{selected_item.new_value[item]}}
                                        </span>

                  </td>
                </tr>
                </tbody>
              </template>
            </vs-table>

          </div>


        </v-card-text>


      </v-card>
      </vs-popup>

  </div>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'
  import UserChip from '@/components/UserChip.vue';

  export default {
    components: {
      UserChip
    },
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
        sidebarData: {},

        loading: false,
        changes_dialog: false,
        selected_item: null
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

          this.loadData()
        },
        immediate: true
      },
    },
    methods: {
      maybe_pluralize: function(count, noun, suffix = 's') {
        return `${count} ${noun}${count !== 1 ? suffix : ''}`;
      },
      changePerPage: function (pages) {

        this.perPage = pages;
        this.currentPage = 1;
        this.loadData()
      },
      viewData(data) {
        if(this.changes_dialog == false) {
          this.selected_item = data;
          this.changes_dialog = true;
        } else {
          this.changes_dialog = false;
        }
      },
      getChangeTypeColor(type) {
        if (type === 'ended') return 'success'
        if (type === 'started') return 'warning'
        if (type === 'missed') return 'danger'
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

        axios.post(API.AUDIT_LOG_LIST, params).then((res) => {

          this_app.data = res.data.data.list;
          if (!!res.data.data.pagination.total) {
            this_app.total = res.data.data.pagination.total;
          }
          this_app.from = res.data.data.pagination.from;
          this_app.to = res.data.data.pagination.to;
        }).catch((err) => {

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
