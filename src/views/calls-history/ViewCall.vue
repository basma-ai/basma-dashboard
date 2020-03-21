<template>
  <div id="page-user-view">

    <div id="user-data" v-if="call">

      <div class="vx-row">
        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="Call Information" class="mb-base">
            <table>
              <tr v-if="call.vu">
                <td class="font-semibold">Agent Name</td>
                <td>
                  <vs-avatar style="float: left" size="30px"
                             :src="`https://ui-avatars.com/api/?name=${call.vu.name}.jpg`"/>
                  <span style="position: relative;top: 10px;margin-left: 5px;">
                    {{ call.vu.name }}
                  </span>
                </td>
              </tr>
              <tr>
                <td class="font-semibold">Status</td>
                <td>{{ call.status }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Creation Time</td>
                <td>{{ -(new Date().getTime() - call.creation_time) | duration('humanize', true) }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Last Refresh Time</td>
                <td>{{ -(new Date().getTime() - call.last_refresh_time) | duration('humanize', true) }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Answer Time</td>
                <td>{{ -(new Date().getTime() - call.answer_time) | duration('humanize', true) }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Agent Notes</td>
                <td>{{ call.agent_notes }}</td>
              </tr>
              <tr v-if="call.rating">
                <td class="font-semibold emojis_rating">Rating</td>
                <div class="emoji" v-if="call.rating.rating === 1">
                  😞
                </div>
                <div class="emoji" v-if="call.rating.rating === 2">
                  😟
                </div>
                <div class="emoji" v-if="call.rating.rating === 3">
                  😕
                </div>
                <div class="emoji" v-if="call.rating.rating === 4">
                  🙂
                </div>
                <div class="emoji" v-if="call.rating.rating === 5">
                  😁
                </div>
              </tr>
              <tr>
                <td class="font-semibold">Feedback</td>
                <td>{{ call.feedback }}</td>
              </tr>
            </table>
          </vx-card>
        </div>

        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="User Information" class="mb-base">
            <table>
              <tr v-for="field in call.custom_fields_values">
                <td class="font-semibold" style="text-transform: capitalize">{{ field.label }}</td>
                <td>{{ field.value }}</td>
              </tr>

            </table>
          </vx-card>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'
  import Vue from 'vue';

  Vue.use(require('vue-moment'));

  export default {
    data() {
      return {
        call_id: this.$route.params.callId,
        call: null
      }
    },
    methods: {
      loadData() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "call_id": this.call_id
        };

        axios.post(API.CALLS_GET, params).then((res) => {
          console.log(res);
          this_app.call = res.data.data.call;
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    created() {
      this.loadData();
    }
  };
</script>

<style lang="scss">
  .emojis_rating .emoji {
    display: inline-block;
    font-size: 40px;
    transition: all 0.2s;
    cursor: pointer;
    padding: 5px;
    line-height: 60px;
    opacity: 0.5;
    user-select: none;
  }

  .emojis_rating .emoji:hover {
    font-size: 60px;
    padding: 0;
    opacity: 1;
  }

  .emojis_rating .emoji:active {
    font-size: 50px;
    padding: 5;
    opacity: 0.8;
  }

  #avatar-col {
    width: 10rem;
  }

  #page-user-view {
    table {
      td {
        vertical-align: top;
        min-width: 140px;
        padding-bottom: .8rem;
        word-break: break-all;
      }

      &:not(.permissions-table) {
        td {
          @media screen and (max-width: 370px) {
            display: block;
          }
        }
      }
    }
  }

  // #account-info-col-1 {
  //   // flex-grow: 1;
  //   width: 30rem !important;
  //   @media screen and (min-width:1200px) {
  //     & {
  //       flex-grow: unset !important;
  //     }
  //   }
  // }


  @media screen and (min-width: 1201px) and (max-width: 1211px),
  only screen and (min-width: 636px) and (max-width: 991px) {
    #account-info-col-1 {
      width: calc(100% - 12rem) !important;
    }

    // #account-manage-buttons {
    //   width: 12rem !important;
    //   flex-direction: column;

    //   > button {
    //     margin-right: 0 !important;
    //     margin-bottom: 1rem;
    //   }
    // }

  }

</style>
