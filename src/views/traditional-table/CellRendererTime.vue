<template>
    <vs-chip class="ag-grid-cell-chip">
      <span>{{ -(new Date().getTime() - params.value) | duration('humanize', true) }}</span>
    </vs-chip>
</template>

<script>

export default {
  name: 'CellRendererTime',
  methods: {

  }
}
</script>
