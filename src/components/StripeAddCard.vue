<template>
  <div>
    <vs-popup classContent="popup-example" title="Add Card" :active.sync="popupActive">
      <label>Card details</label>
      <div id="card-element" class="p-3 mb-4"></div>

      <label>Card holdername</label>
      <vs-input id="card-holder-name" type="text" v-model="name" class="form-control w-full"></vs-input>

      <!-- We'll put the error messages in this element -->
      <div id="card-errors" role="alert"></div>

      <vs-button color="success" class="float-right mt-4" :loading="loading" v-on:click="createPaymentMethod()">Add</vs-button>
    </vs-popup>

    <div class="flex flex-wrap items-center justify-end mt-base">
      <vs-button @click="popupActive=true" color="success" type="filled">Add Card</vs-button>
    </div>
  </div>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: {
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
        popupActive: false,

        stripe: null,
        elements: null,
        card: null,
        name: '',
        loading: false,
        clientSecret: '',

        addPaymentStatus: 0,
        addPaymentStatusError: '',

      }
    },
    mounted() {
      this.includeStripe('js.stripe.com/v3/', function () {
        this.configureStripe();
      }.bind(this));
    },
    computed: {},
    methods: {
      showPopup(){
        this.popupActive = true;
      },
      createPaymentMethod() {
        let this_app = this;

        this.loading = true;
        this_app.$vs.loading();
        this.addPaymentStatus = 1;

        this.stripe.createPaymentMethod({
          type: 'card',
          card: this.card,
          billing_details: {
            name: this.name
          }
        }).then(function (result) {
          this.loading = false;

          if (result.error) {
            this_app.$vs.loading.close();
            this.addPaymentStatus = 3;
            this.addPaymentStatusError = result.error.message;
            console.log(result.error.message);
          } else {
            console.log(result);
            // if (result.paymentIntent.status === 'succeeded') {
            this.popupActive = false
            this.savePaymentMethod(result.paymentMethod.id);
            this.addPaymentStatus = 2;
            this.card.clear();
            this.name = '';
            this.clientSecret = '';
            // }
          }
        }.bind(this));
      },

      /* Saves the payment method for the user and re-loads the payment methods. */
      savePaymentMethod(paymentMethodId) {
        let this_app = this;

        axios.post(API.BILLING_ADD_CARD, {
          vu_token: this.$store.state.AppActiveUser.token,
          stripe_payment_method_id: paymentMethodId
        }).then(function () {
          this_app.$emit('reloadCards')
          this_app.$vs.loading.close();
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
        this.elements = this.stripe.elements();

        // Set up Stripe.js and Elements to use in checkout form
        var style = {
          base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#aab7c4"
            }
          },
          invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
          }
        };

        this.card = this.elements.create("card", {style: style});
        this.card.mount('#card-element');
      },
    }
  }
</script>

<style>
  #card-element {
      border: 1px solid #ccc;
      border-radius: 5px;
  }
</style>
