<template>
  <div id="ecommerce-checkout-demo">
    <div class="vx-row">

      <!-- LEFT COL: PAYMENT OPTIONS -->
      <div class="vx-col lg:w-2/3 w-full">
        <vx-card title="Plan" subtitle='' class="mb-base">
          <span class="">Check out our pricing from <a target="_blank" href="https://basma.ai/#pricing">here</a></span>

          <div class="mt-3 select_interval">
            <ul>
              <li class="mr-4 mb-4" v-for="interval in intervals" v-bind:key="interval.name"
                  :class="{ 'active' : interval.name == selected_interval.name}">
                <div class="flex flex-wrap justify-between items-center">
                  <vs-radio vs-name="interval" v-model="selected_interval" :vs-value="interval">
                    <div class="p-6 items-center">
                      <p class="h5">{{interval.name}}</p>
                      <span class="text-primary" style="font-size: 12px" :class="{'text-bold' : interval.name == selected_interval.name}" v-if="interval.name == 'Annually'">FIRST 2 MONTHS FREE!</span>
                    </div>
                  </vs-radio>
                </div>
              </li>
            </ul>
          </div>

          <div class="mt-3 select_package">
            <ul>
              <li class="mr-4 mb-4 " v-for="pkg in packages" v-bind:key="pkg.name"
                  :class="[ pkg.name == selected_package.name ? 'active':'' , 'package-' + pkg.id ]">
                <div class="flex flex-wrap justify-between items-center">
                  <vs-radio vs-name="package" v-model="selected_package" :vs-value="pkg">
                    <div class="p-6 items-center">
                      <p class="mb-2 h5"><b>{{pkg.name}}</b></p>
                      <span v-if="selected_interval.name == 'Monthly'">${{pkg.monthlyPrice.toFixed(2)}}/month</span>
                      <span v-if="selected_interval.name == 'Annually'">${{pkg.annualPrice.toFixed(2)}}/year</span>
                    </div>
                  </vs-radio>
                </div>
              </li>
            </ul>
          </div>
        </vx-card>

        <vx-card title="Payment Options" class="mb-base payment_methods">

          <v-loading class="mb-4 mt-4" v-if="loadingPaymentMethods"></v-loading>

          <div class="mt-3" v-if="!loadingPaymentMethods">
            <ul>
              <li class="mr-4 mb-4" v-for="method in paymentMethods" v-bind:key="method.id"
                  :class="{ 'active' : method.id == selected_payment_method.id}">
                <div class="flex flex-wrap full-width items-center">
                  <vs-radio vs-name="payment_method" v-model="selected_payment_method" :vs-value="method">
                    <div class="p-6 items-center">
                      <p class="mb-2 h5"><b style="text-transform: uppercase">{{ method.billing_details.name }}</b></p>
                      <p class="mb-2 text-uppercase">
                        {{ method.card.brand }} XXXXXX <b style="font-weight: 500">{{ method.card.last4 }}</b></p>
                      <span>{{ method.card.exp_month }}/{{ method.card.exp_year }}</span>
                    </div>
                  </vs-radio>
                </div>
              </li>
              <li class="mr-4 mb-4 add-card" style="vertical-align: top;" @click="addNewCard">
                <div class="items-center">
                  <vs-radio vs-name="add_card">
                    <div class="p-12 items-center">
                      <p class="h5">
                        <feather-icon class="text-success" icon="PlusCircleIcon"
                                      style="top: 2px; display: inline-block;"
                                      svgClasses="w-6 h-5 mr-2 stroke-current"/>
                        <b class="text-uppercase text-success" style="position: relative; top: -1px">Add Card</b></p>
                      <stripe-add-card ref="stripe_add_card" class="hidden" @reloadCards="loadPaymentMethods()"
                                       :stripe-key="stripeKey"></stripe-add-card>
                    </div>
                  </vs-radio>
                </div>
              </li>
            </ul>
          </div>
        </vx-card>
      </div>

      <!-- RIGHT COL: PRICE -->
      <div class="vx-col lg:w-1/3 w-full">
        <vx-card title="Price Details">

          <div class="flex justify-between mb-2">
            <span class="h5 plan">Plan Price <span :class="'package-'+selected_package.id">({{selected_package.name}})</span></span>
            <span class="h3 font-semibold">${{planPrice.toFixed(2)}}</span>
          </div>

          <!--          <div class="flex justify-between mb-2">-->
          <!--            <span>Tax Charges</span>-->
          <!--            <span>$0.00</span>-->
          <!--          </div>-->

          <vs-divider/>

          <div class="flex justify-between">
            <span class="h5">Amount Payable</span>
            <span class="h3 font-semibold">${{planPrice.toFixed(2)}}<span class="text-success" style="font-size: 13px"> / {{selected_interval.name.toLowerCase()}}</span></span>

          </div>

          <div class="mt-6 flex justify-between">
            <span style="font-size: 12px">By clicking Subscribe, on behalf of the purchasing entity, you agree that Basma subscriptions purchased
              hereunder shall be governed by the <b>Master Subscription Agreement</b> and accompanying <b>Product Specific Terms.</b></span>
          </div>

          <div class="mt-6 flex justify-between">
            <vs-button class="w-full text-white" color="success" ref="loadableButton" @click="purchase"
                       :disabled="!isAbleToPurchase">
              <h3 class="text-white">Subscribe</h3>
            </vs-button>
          </div>

          <vs-popup title="Payment Authentication" :active.sync="show3DSecurePopup">
            <iframe v-if="show3DSecurePopup" id="myIframe" width="100%" height="500" :src="iframe_redirect_url"
                    v-on:load="iframeLoaded()"></iframe>
          </vs-popup>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
  import VLoading from '@/components/VLoading.vue';
  import StripeAddCard from '@/components/StripeAddCard.vue'
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    data() {
      return {

        stripeKey: process.env.VUE_APP_STRIPE_KEY,
        selected_package: {
          id: 1,
          name: "Basic",
          monthlyPrice: 29.00,
          annualPrice: 299.00
        },
        selected_payment_method: null,
        selected_interval: {
          name: "Monthly"
        },
        packages: [
          {
            id: 1,
            name: "Basic",
            monthlyPrice: 29.00,
            annualPrice: 299.00
          },
          {
            id: 2,
            name: "Silver",
            monthlyPrice: 99.00,
            annualPrice: 999.00
          },
          {
            id: 3,
            name: "Platinum",
            monthlyPrice: 199.00,
            annualPrice: 1999.00
          },
        ],
        intervals: [
          {
            name: "Monthly"
          },
          {
            name: "Annually"
          }
        ],
        paymentMethods: [],
        loadingPaymentMethods: false,
        loadingPurchase: false,
        show3DSecurePopup: false,
        iframe_redirect_url: '',
        payment_intent: null,
        payment_intent_client_secret: null
      }
    },
    components: {
      VLoading,
      StripeAddCard
    },
    computed: {
      isAbleToPurchase() {
        return true
      },
      planPrice() {
        if (!!this.selected_interval && !!this.selected_package) {
          return this.selected_interval.name === "Monthly" ? this.selected_package.monthlyPrice : this.selected_package.annualPrice
        } else {
          return 0
        }
      }
    },
    mounted() {
      this.includeStripe('js.stripe.com/v3/', function () {
        this.configureStripe();
      }.bind(this));

      this.loadPaymentMethods();
      // this.loadPackages();
      this.selected_package = this.packages[0]
      this.selected_interval = this.intervals[0]

    },
    methods: {
      addNewCard() {
        this.$refs.stripe_add_card.showPopup();
      },
      iframeLoaded() {
        let iframe = document.getElementById("myIframe")

        console.log("loaded");
        console.log("location", iframe.contentWindow.location.search);

        let search = iframe.contentWindow.location.search;
        const hashes = search.slice(search.indexOf('?') + 1).split('&')
        const params = {}
        hashes.map(hash => {
          const [key, val] = hash.split('=')
          params[key] = decodeURIComponent(val)
        })

        this.show3DSecurePopup = false;
        console.log(params)

        if (null != params.payment_intent_client_secret) {
          this.payment_intent = params.payment_intent
          this.payment_intent_client_secret = params.payment_intent_client_secret
          this.on3DSComplete()
        }
      },
      on3DSComplete() {
        const this_app = this;

        this_app.$vs.loading()
        // Check the PaymentIntent
        this.stripe.retrievePaymentIntent(this.payment_intent_client_secret)
          .then(function (result) {
            console.log(result)
            this_app.$vs.loading.close()
            if (result.error) {
              // PaymentIntent client secret was invalid
            } else {
              if (result.paymentIntent.status === 'succeeded') {
                // Show your customer that the payment has succeeded
              } else if (result.paymentIntent.status === 'requires_payment_method') {
                // Authentication failed, prompt the customer to enter another payment method
              }
            }
          });
      },
      purchase() {
        const this_app = this;

        this_app.$vs.loading()

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "package_id": this.selected_package.id,
          "type": this.selected_interval.name.toLowerCase(),
          "default_payment_method_id": this.selected_payment_method.id
        };

        axios.post(API.BILLING_SUBSCRIBE, params).then((res) => {
          this_app.$vs.loading.close()
          let data = res.data.data;

          if (data.subscription.status == "paid") {
            // redirect him to success page
          } else {
            if (null != data.stripe_payment_intent) {
              this_app.confirmPaymentIntent(data.stripe_payment_intent)
            }
          }
          console.log(res);
        }).catch((err) => {

        });
      },

      confirmPaymentIntent(paymentIntent) {
        console.log(paymentIntent);
        this.iframe_redirect_url = paymentIntent.next_action.redirect_to_url.url
        this.show3DSecurePopup = true
      },

      loadPackages() {
        axios.post(API.BILLING_PACKAGES_LIST, {
          vu_token: this.$store.state.AppActiveUser.token
        })
          .then(function (response) {
            this.packages = response.data.data.list;
          }.bind(this));
      },

      /* Loads all of the payment methods for the user.*/
      loadPaymentMethods() {
        this.loadingPaymentMethods = true;

        axios.post(API.BILLING_LIST_CARDS, {
          vu_token: this.$store.state.AppActiveUser.token
        })
          .then(function (response) {
            this.loadingPaymentMethods = false
            this.paymentMethods = response.data.data.list;
            this.selected_payment_method = this.paymentMethods[0];
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
    },

  }
</script>

<style>
  span.vs-radio {
    display: none !important;
  }

  .vs-radio--input {
    display: none !important;
  }

  .vs-radio--label {
    margin: 0 !important;
  }

  /*.vs-popup--header {*/
  /*  display: none;*/
  /*}*/

  /*.vs-popup--content {*/
  /*  overflow: inherit !important;*/
  /*  padding: 0 !important;*/
  /*  margin: 0 !important;*/
  /*}*/
</style>

<style scoped>

  .text-bold {
    font-weight: bold;
  }

  .select_package li.active.package-1 {
    border-color: rgba(var(--vs-dark), 1);
  }
.plan .package-1 {
  color: rgba(var(--vs-dark), 1);
}
  .select_package li.active.package-2 {
    border-color: #1089f8;
  }
  .plan .package-2 {
    color: #1089f8;
  }

  .select_package li.active.package-3 {
    border-color: #feba1d;
  }
  .plan .package-3 {
    color: #feba1d;
  }

  .select_interval li:first-child.active {
    border-color: rgba(var(--vs-dark), 1);
  }

  .select_interval li.active {
    border-color: rgba(var(--vs-primary), 1);
  }

  .add-card {
    vertical-align: top;
    text-align: center;
    border-style: dotted;
  }

  .text-uppercase {
    text-transform: uppercase;
  }

  .select_interval li {
    min-height: 80px;
  }

  .select_interval li:first-child p {
    position: relative;
    top: 7px;
  }

  .select_package li {
    min-width: 160px;
  }
  .payment_methods li {
    min-width: 260px;
  }

  .con-vs-radio {
    /*height: 90px;*/
    /*width: 110px;*/

    position: relative;
    display: inline-block;
  }

  li {
    display: inline-block;
    border: 2px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
  }

  li.active {
    border-color: rgba(var(--vs-success), 1);
  }

  /*li:hover {*/
  /*  border-color: rgba(var(--vs-success), 0.5);*/
  /*}*/


</style>
