<template>
  <vx-card no-shadow>

  </vx-card>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: ["vendor"],
    components: {

    },
    data() {
      return {

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

    }
  }
</script>
