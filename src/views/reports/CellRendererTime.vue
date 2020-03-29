<template>
    <vs-chip class="ag-grid-cell-chip">
      <span>{{ params.value | moment("YYYY-MM-DD h:mm:ss a") }}</span>
    </vs-chip>
</template>

<script>

import Vue from 'vue';

Vue.use(require('vue-moment'));

export default {
  name: 'CellRendererTime',
  methods: {

  }
}
</script>
