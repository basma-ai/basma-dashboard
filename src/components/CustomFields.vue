<template>
  <div>
    <div v-if="!read_only" v-for="field in custom_fields" v-bind:key="field.id">
      <vs-input
        v-if="field.type === 'text' && isShow(field)"
        v-model="field.value"
        :label="field.label + (field.is_mandatory ? '*' : '')"
        class="w-full mb-6"/>

      <div v-if="field.type === 'mobile' && isShow(field)">
        <label class="vs-input--label">Mobile Number</label>
        <VuePhoneNumberInput default-country-code="BH" :ignored-countries="['IL']" v-model="field.value_description" class="w-full mb-6"
                             @update="field.value = $event.e164"/>
      </div>

      <div v-if="field.type === 'number' && isShow(field)">
        <vs-input
          v-model="field.value"
          :label="field.label + (field.is_mandatory ? '*' : '')"
          class="w-full mb-6"/>
      </div>

      <vs-checkbox
        v-if="field.type === 'boolean' && isShow(field)"
        v-model="field.value"
        :label="field.label + (field.is_mandatory ? '*' : '')"
        class="w-full mb-6"
        style="text-align: justify"/>

      <div v-if="field.type === 'checklist' && isShow(field)">
        <multiselect class="w-full mb-6" v-model="field.value" :options="JSON.parse(field.value_description)" :multiple="true" :searchable="true" :allow-empty="true" :show-labels="false">
          <template slot="singleLabel" slot-scope="{ option }">{{ option }}</template>
        </multiselect>

<!--        <vs-select multiple v-validate="'required'" name="checklist" :label="field.label" v-model="field.value"-->
<!--                   class="w-full mb-6">-->
<!--          <vs-select-item :value="chip" :text="chip" v-for="chip in JSON.parse(field.value_description)"-->
<!--                          v-bind:key="chip"/>-->
<!--        </vs-select>-->
      </div>

    </div>

    <table v-if="read_only">
      <tr v-for="field in custom_fields" v-bind:key="field.id">
        <td class="font-semibold" style="text-transform: capitalize">{{ field.label }}</td>
        <td v-if="field.type != 'checklist'">{{ field.value }}</td>
        <td v-else>
          <vs-chip color="primary" v-for="chip in field.value" >{{ chip }}</vs-chip>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
  import {Validator} from 'vee-validate';
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  import VuePhoneNumberInput from 'vue-phone-number-input';

  export default {
    props: {
      is_agent_view: false,
      custom_fields: null,
      values: null,
      read_only: false
    },
    components: {
      flatPickr,
      VuePhoneNumberInput
    },
    data() {
      return {}
    },
    watch: {},
    computed: {},
    methods: {
      isShow(field) {
        return (!field.agent_only || (field.agent_only && this.is_agent_view))
      },
      feedValues(){
        if (this.values != null) {
          let i = 0

          for (let field of this.custom_fields){
            let matching_val = this.values.filter((a) => {
              return a.id == field.id;
            });

            if(matching_val[0] != null) {
              // console.log(matching_val[0])
              if (this.custom_fields[i].type == 'mobile') {
                // console.log(matching_val[0].value_description)
                this.custom_fields[i].value_description = matching_val[0].value_description;
              }else if (this.custom_fields[i].type == 'text'){
                // console.log(this.custom_fields[i])
                this.custom_fields[i].value = matching_val[0].value;
              }
            }

            i++
          }
        }
      }
    },
    created() {
      this.feedValues()
    }
  }
</script>
<style>

</style>
