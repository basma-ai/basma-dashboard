<template>
  <div>
    <vs-table :data="paymentMethods">

      <template slot="thead">
        <vs-th>Name</vs-th>
        <vs-th>Valid thru</vs-th>
        <vs-th>Card Last 4 Digits</vs-th>
        <vs-th>Card Type</vs-th>
        <vs-th>Delete</vs-th>
      </template>

      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">

          <vs-td :data="data[indextr].email">
            {{ data[indextr].billing_details.name }}
          </vs-td>

          <vs-td :data="data[indextr].id">
            {{ data[indextr].card.exp_month }}/{{ data[indextr].card.exp_year }}
          </vs-td>

          <vs-td :data="data[indextr].id">
            <feather-icon icon="CreditCardIcon" style="top: 2px; display: inline-block;" svgClasses="w-4 h-4 stroke-current"/> XXXX XXXX XXXX {{ data[indextr].card.last4 }}
          </vs-td>

          <vs-td :data="data[indextr].username">
            {{ data[indextr].card.brand }}
          </vs-td>

          <vs-td class="whitespace-no-wrap">
            <feather-icon icon="TrashIcon" style="cursor: pointer" svgClasses="w-5 h-5 hover:text-danger stroke-current" class="ml-2"
                          @click.stop="removePaymentMethod(data[indextr].id)"/>
          </vs-td>

        </vs-tr>
      </template>

    </vs-table>
  </div>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: {
      paymentMethods: null,
      stripeKey: {
        type: String,
        required: true
      },
      button: {
        type: String,
        require: false,
        default: 'Purchase'
      },
      options: {
        type: Object,
        default: function () {
          return {}
        }
      },
      buttonClass: {
        type: String,
        require: false,
        default: 'btn btn-primary'
      },
      onSuccess: {
        type: String,
        required: false,
        default: 'submit',
        validator: function (value) {
          return (value === 'submit' || value === 'broadcast')
        }
      }
    },
    data() {
      return {
        stripe: null,
        loading: false,
      }
    },
    mounted() {
      this.includeStripe('js.stripe.com/v3/', function () {
        this.configureStripe();
      }.bind(this));

      this.loadPaymentMethods();
    },
    computed: {},
    methods: {
      /* Loads all of the payment methods for the user.*/
      loadPaymentMethods() {
        axios.post(API.BILLING_LIST_CARDS, {
          vu_token: this.$store.state.AppActiveUser.token
        })
          .then(function (response) {
            this.paymentMethods = response.data.data.list;
          }.bind(this));
      },

      removePaymentMethod(paymentMethodId) {
        axios.post(API.BILLING_REMOVE_CARD, {
          vu_token: this.$store.state.AppActiveUser.token,
          stripe_payment_method_id: paymentMethodId
        }).then(function (response) {
          this.loadPaymentMethods();
        }.bind(this));
      },

      /* Includes Stripe.js dynamically */
      includeStripe(URL, callback) {
        let documentTag = document, tag = 'script',
          object = documentTag.createElement(tag),
          scriptTag = documentTag.getElementsByTagName(tag)[0];
        object.src = '//' + URL;
        if (callback) {
          object.addEventListener('load', function (e) {
            callback(null, e);
          }, false);
        }
        scriptTag.parentNode.insertBefore(object, scriptTag);
      },

      /* Configures Stripe by setting up the elements and creating the card element. */
      configureStripe() {
        this.stripe = Stripe(this.stripeKey);
      },
    }
  }
</script>
