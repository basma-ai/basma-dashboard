<template>
  <div>
    <!-- read the fields from the db, and then show them according to their type -->
    <div v-for="(field, index) in custom_fields" v-bind:key="field.id">
      <vs-input
        v-if="field.type === 'text'"
        v-model="field.value"
        :label="field.label + (field.is_mandatory ? '*' : '')"
        :rules="field.is_mandatory ? requiredRules : []"
        class="w-full mb-6"/>

      <div v-if="field.type === 'mobile'">
        <label class="vs-input--label">Mobile Number</label>
        <VuePhoneNumberInput default-country-code="BH" v-model="field.value_description" class="w-full mb-6"
                             @update="field.value = $event.e164"/>
      </div>

      <div v-if="field.type === 'number'">
        <vs-input
          v-model="field.value"
          :label="field.label + (field.is_mandatory ? '*' : '')"
          :rules="field.is_mandatory ? requiredRules : []"
          class="w-full mb-6"/>
      </div>

      <vs-checkbox
        v-if="field.type === 'boolean'"
        v-model="field.value"
        :label="field.label + (field.is_mandatory ? '*' : '')"
        :rules="field.is_mandatory ? requiredRules : []"
        class="w-full mb-6"
        style="text-align: justify"/>

      <div v-if="field.type === 'checklist' && field.agent_only">
        <vs-select multiple v-validate="'required'" name="checklist" label="Checklist" v-model="field.value"
                   class="w-full mb-6">
          <vs-select-item :value="chip" :text="chip" v-for="chip in JSON.parse(field.value_description)"
                          v-bind:key="chip"/>
        </vs-select>
      </div>

    </div>
  </div>
</template>
<script>
  import {Validator} from 'vee-validate';
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import VuePhoneNumberInput from 'vue-phone-number-input';

  export default {
    props: {
      custom_fields: []
    },
    components: {
      flatPickr,
      VuePhoneNumberInput
    },
    data() {
      return {

      }
    },
    watch: {

    },
    computed: {

    },
    methods: {

    },
    created() {

    }
  }
</script>
<style>

</style>
