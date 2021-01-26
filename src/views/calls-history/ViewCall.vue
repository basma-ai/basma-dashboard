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
                <td>
                  <vs-chip :color="getOrderStatusColor(call.status)" class="product-order-status">{{ call.status }}</vs-chip>
                </td>
              </tr>
              <tr>
                <td class="font-semibold">Creation Time</td>
                <td>{{ -(new Date().getTime() - call.creation_time) | duration('humanize', true) }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Answer Time</td>
                <td>{{ -(new Date().getTime() - call.answer_time) | duration('humanize', true) }}</td>
              </tr>
              <tr v-if="call.duration">
                <td class="font-semibold">Duration Time</td>
                <td>{{ call.duration / 1000 | moment("m") }} minutes</td>
              </tr>
              <tr>
                <td class="font-semibold">Agent Notes</td>
                <td>{{ call.agent_notes }}</td>
              </tr>
              <tr v-if="call.rating">
                <td class="font-semibold emojis_rating">Rating</td>
                <star-rating :rtl="$vs.rtl" :star-size="20" v-model="call.rating.rating" :show-rating="false" :read-only="true"></star-rating>
              </tr>
              <tr>
                <td class="font-semibold">Feedback</td>
                <td>{{ call.rating.feedback_text }}</td>
              </tr>
              <tr>
                <td class="font-semibold">Snapshots</td>
                <td>
                    <ImageView v-for="snapshot in snapshots" :file_id="snapshot.id" />
                </td>
              </tr>
            </table>
          </vx-card>
        </div>

        <div class="vx-col lg:w-1/2 w-full">
          <vx-card title="User Information" class="mb-base">
            <custom-fields :read_only="true" v-if="call.custom_fields_values" :custom_fields="call.custom_fields_values"></custom-fields>
          </vx-card>
          <vx-card v-if="call.is_recorded && canSeeRecording" title="Recording" class="overflow-hidden">
            <div v-if="call.recording_status != 'complete'">
              Basma is processing the video, check back after few minutes..
            </div>
            <div v-else>
              <vs-button @click="getRecording" color="primary">Watch Recording</vs-button>

              <vs-popup class="holamundo" title="Recording" :active.sync="popupActive">
                <div v-if="popupActive">
                  <template slot="no-body" style="display: block">
                    <video-player  ref="player" class="media-video-player card-video" :options="playerOptions" />
                  </template>
                </div>
              </vs-popup>
            </div>
          </vx-card>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import axios from '@/axios.js'
  import API from '@/api.js'
  import StarRating from 'vue-star-rating'
  import { videoPlayer }     from 'vue-video-player'
  import 'video.js/dist/video-js.css'
  import CustomFields from '@/components/CustomFields.vue';
  import ImageView from '@/components/ImageView.vue';

  export default {
    data() {
      return {
        call_id: this.$route.params.callId,
        call: null,
        snapshots: null,
        recording: null,
        playerOptions: {},
        popupActive: false,
      }
    },
    components: {
      StarRating,
      videoPlayer,
      CustomFields,
      ImageView
    },
    computed: {
      canSeeRecording() {
        let permissions = [];
        let roles = this.$store.state.AppActiveUser.info.roles

        for (const role of roles) {
          let role_permissions = role.permissions.map(permissions => permissions.name);

          for (const permission of role_permissions) {
            if (permissions.indexOf(permission) === -1) {
              permissions.push(permission);
            }
          }
        }

        return permissions.indexOf("recordings") > -1 || permissions.indexOf("superuser") > -1
      },
    },
    methods: {
      loadData() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "call_id": this.call_id
        };

        axios.post(API.CALLS_GET, params).then((res) => {

          this_app.call = res.data.data.call;
          this_app.snapshots = res.data.data.snapshots;
        }).catch((err) => {

        });
      },
      getOrderStatusColor(status) {
        if (status === 'ended') return 'success'
        if (status === 'started') return 'warning'
        if (status === 'missed') return 'danger'
        return 'primary'
      },
      getRecording(){
        this.$vs.loading()

        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "call_id": this.call_id
        };

        axios.post(API.CALLS_GET_RECORDING, params).then((res) => {

          this.$vs.loading.close()
          this_app.recording = res.data.data;

          this_app.playerOptions = {
            height: '460',
            fluid: true,
            autoplay: true,
            muted: false,
            language: 'en',
            playbackRates: [0.7, 1.0, 1.5, 2.0],
            sources: [
              {
                type: 'video/mp4',
                src: this_app.recording.video_url
              }
            ],
            poster: this_app.recording.thumb_url
          }

          this_app.popupActive = true;

        }).catch((err) => {

        });
      },

    },
    mounted(){

    },
    created() {
      this.loadData();
    }
  };
</script>

<style lang="scss">
  .card-video {
    .video-js {
      height: 370px;
    }
  }

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
