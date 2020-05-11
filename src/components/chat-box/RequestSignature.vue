<template>
    <vs-button color="success" icon-pack="feather" icon="icon-edit-1" type="border" class="request_box" @click="request"></vs-button>
</template>

<script>
  export default {
    props: [],
    data() {
      return {
      }
    },
    methods: {
      request: function () {
        let this_app = this;

        this_app.$vs.dialog({
          type: 'confirm',
          color: 'success',
          title: `Confirm`,
          text: 'Are you sure you want to request for signature?',
          accept: function () {
            this_app.$emit('requestSignature');
          }
        })

      },
    }
  }
</script>

<style lang="scss">
  .request_box {
    padding: 0.4rem 0.8rem !important;
    width: 45px !important;
    height: 39px !important;
    i {
      margin: 0 !important;
      font-size: 24px;
    }
  }
</style>
