<template>
  <vx-card no-shadow>
    <vs-table :data="invoices">

      <template slot="thead">
        <vs-th>Payment Date</vs-th>
        <vs-th>Amount</vs-th>
        <vs-th>Status</vs-th>
        <vs-th>Invoice</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">

          <vs-td :data="data[indextr].email">
            {{ data[indextr].created }}
          </vs-td>

          <vs-td :data="data[indextr].id">
            {{ data[indextr].total }}
          </vs-td>

          <vs-td :data="data[indextr].id">
            {{ data[indextr].status }}
          </vs-td>

          <vs-td class="whitespace-no-wrap">
            <a :href="data[indextr].invoice_pdf">
              <feather-icon icon="DownloadIcon" style="cursor: pointer" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2"/>
            </a>
          </vs-td>

        </vs-tr>
      </template>

    </vs-table>
  </vx-card>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    components: {

    },
    props: {
      propInvoices: null
    },
    data() {
      return {
        invoices: null
      }
    },
    computed: {
      activeUserInfo() {
        return this.$store.state.AppActiveUser
      }
    },
    created() {
      this.invoices = this.propInvoices;
    },
    methods: {
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
      downloadInvoice(link) {

      }
    }
  }
</script>
