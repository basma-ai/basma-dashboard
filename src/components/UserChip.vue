<template>
  <div>

    <v-chip :to="'/users/edit/'+user.id" target="_blank" v-if="user != null">
      <v-icon left color="blue darken-4">mdi-account</v-icon>
      {{user.fullname}}
    </v-chip>

  </div>
</template>
<script>
  export default {
    props: ['user'],
  }
</script>
