<template>
    <div class="vx-row">
      <div class="vx-col w-full md-12 mb-base">
        <vx-card title="Payment Methods">
          <stripe-cards :payment-methods="paymentMethods" ref="stripe_cards" :stripe-key="strapiKey"></stripe-cards>
          <stripe-add-card @reloadCards="reloadCards()" :stripe-key="strapiKey"></stripe-add-card>
        </vx-card>
      </div>
    </div>
</template>

<script>
  import StripeCards from '@/components/StripeCards.vue'
  import StripeAddCard from '@/components/StripeAddCard.vue'
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: {
      paymentMethods: null
    },
    components: {
      StripeCards,
      StripeAddCard
    },
    data() {
      return {
        strapiKey: process.env.VUE_APP_STRIPE_KEY,
      }
    },
    computed: {
      activeUserInfo() {
        return this.$store.state.AppActiveUser
      }
    },
    created() {

    },
    methods: {
      reloadCards(){
        this.$refs.stripe_cards.loadPaymentMethods();
      }
    }
  }
</script>
