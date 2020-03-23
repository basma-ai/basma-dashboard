<template>
  <div>

    <div style="text-align:center">
      <vs-card :loading="loading">
        <div style="padding: 20px">

          <div id="rigntone" v-if="screen_status == 'dashboard'">
            <div  style="float:right;">
              <label>Ringtone {{ ringtone_switch ? 'On' : 'Off' }}</label>
              <vs-switch name="ringtone_switch" v-model="ringtone_switch" vs-icon="ring_volume" color="success"/>
            </div>
<!--            <div class="mr-3" style="float:right;">-->
<!--              <label>Agent {{ online_switch ? 'Online' : 'Offline' }}</label>-->
<!--              <vs-switch vs-type="success" name="online_switch" v-model="online_switch" color="success" vs-icon="highlight"/>-->
<!--            </div>-->
          </div>

          <ul class="services mt-5 mb-10" v-if="screen_status == 'dashboard'">
            <!--            <p>{{selected_services}}</p>-->
            <li style="float: left" class="mr-2 mb-2">
              <vs-checkbox v-model="noFilter">All Services</vs-checkbox>
            </li>
            <li @change="checkFilter" style="float: left" class="mr-2 mb-2" v-for="(service, index) in services"
                :key="index">
              <vs-checkbox v-model="selected_services" :vs-value="service">{{ service.name }}</vs-checkbox>
            </li>
          </ul>


          <!-- Video Connecting Screen -->
          <div v-if="screen_status == 'dashboard'">

            <div v-if="pending_calls_list.length > 0" style="font-size:20px">
              <h1 style="display: inline-block">{{pending_calls_list.length}}</h1> people waiting 😃
            </div>

            <br/>
            <br/>

            <vs-row class="agent_call_boxes_container">
              <vs-col vs-type="flex" id="the_col" vs-justify="center" vs-align="center" vs-sm="12" vs-md="6" vs-lg="3"
                      v-for="call in pending_calls_list">
                <div class="agent_call_box">

                  <div id="icon">
                    <vs-icon size="40">videocam</vs-icon>
                  </div>

                  <div id="text">
                    <div id="title">#{{call.id}}</div>
                    <div id="service">{{call.vendor_service.name}}</div>
                    <div id="time">
                      <vs-icon>access_time</vs-icon>
                      {{ -(new Date().getTime() - call.creation_time) | duration('humanize', true) }}
                    </div>
                  </div>

                  <div id="action">
                    <vs-button @click="answer_call(call)" icon="videocam" color="green" size="large"></vs-button>
                  </div>

                </div>
              </vs-col>
            </vs-row>

            <div v-if="pending_calls_list.length < 1">
              <div style="text-align:center; font-size:30px">
                😞
                <br/>
                no pending calls
              </div>
            </div>

          </div>


          <!-- In Call -->
          <div v-if="screen_status == 'in_call'">

            <div styte="height:10px"></div>

            <div v-if="call.status == 'started' && call.connection_agent_token != null">
              <v-row>

                <v-col cols="12" sm="12" md="3">
                  <CallBox ref="call_box" :connection_token="call.connection_agent_token" :room_name="'call-'+call.id"
                           style="width:100%;"></CallBox>
                </v-col>

                <v-col>
                  <vs-textarea v-debounce:1s="updateNotes" v-model="agent_notes" type="textarea"/>
                  <vs-button @click="end_call">End Call</vs-button>
                  <vs-button style="margin-left: 5px" color="success" type="border">Save Notes</vs-button>
                  <vs-button style="margin-left: 5px" color="success">Request for Signature / Consent</vs-button>
                </v-col>

              </v-row>

            </div>

            <br/><br/>

          </div>

        </div>

      </vs-card>
    </div>


  </div>
</template>


<script>
  import axios from '@/axios.js';
  import API from '@/api.js';
  import CallBox from '@/components/CallBox.vue';
  import Vue from "vue";

  Vue.use(require('vue-moment'));

  export default {
    data: () => ({
      loading: false,
      vendor: {},
      screen_status: 'login',
      guest_token: null,
      services_list: [],
      vendor_id: 0,
      selected_service: null,
      call_id: 0,
      call: null,
      vu_username: '',
      vu_password: '',
      vu_user: null,
      agent_token_loading: false,
      vu_token: null,
      pending_calls_list: [],
      ringtone_switch: true,
      ringtone_audio: null,
      noFilter: true,
      online_switch: true,
      selected_services: [],
      services: [],
      agent_notes: ''
    }),
    components: {
      CallBox
    },
    watch: {
      noFilter: function (val) {
        console.log("All Services is: ", val);
        if (val) {
          this.selected_services = this.services
        } else {
          this.selected_services = []
        }
      },
      ringtone_switch: function (val) {
        console.log("ringtone switch clicked!!");
        if (val) {

          this.ringtone_audio.volume = 1;

          // var audio = new Audio('https://basma-cdn.s3.me-south-1.amazonaws.com/assets/audio/button_click.wav');
          // audio.play();
        } else {
          this.ringtone_audio.volume = 0;
        }
      }
    },
    computed: {
      onlineColor() {
        return this.online_switch ? '#fff' : '#000'
      }
    },
    methods: {
      updateNotes() {
        let thisApp = this;

        axios.post('/agent/update_call', {
          vu_token: this.$store.state.AppActiveUser.token,
          call_id: this.call_id,
          agent_notes: this.agent_notes
        })
          .then(function (res) {
            console.log(res);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      checkFilter() {
        let isEqual = this.selected_services.length === this.services.length;

        if (isEqual) {
          console.log("equal")
          this.noFilter = true
        } else {
          console.log("not equal")
          this.noFilter = false
        }
      },
      list_pending_calls: function () {
        // this.loading = true;
        let thisApp = this;

        axios.post('/agent/list_pending_calls', {
          vu_token: this.$store.state.AppActiveUser.token,
          services_ids: this.selected_services.map(x => x.id)
        })
          .then(function (response) {

            if (response.data.success) {

              thisApp.pending_calls_list = response.data.data.pending_calls_list;
              if (thisApp.pending_calls_list.length > 0) {
                thisApp.ringtone_audio.play();
              } else {
                thisApp.ringtone_audio.pause();
              }

            } else {
              // console.log("it's a failure!");
            }

            setTimeout(function () {
              thisApp.list_pending_calls();
            }, 500);

            // thisApp.loading = false;

          })
          .catch(function (error) {
            console.log(error);
          });

      },

      end_call: function () {

        this.ringtone_audio.play();
        this.screen_status = 'loading';
        this.loading = true;

        this.$refs.call_box.end_call();

        let thisApp = this;
        axios.post('/agent/end_call', {
          vu_token: this.$store.state.AppActiveUser.token,
          call_id: this.call_id
        })
          .then(function (response) {

            if (response.data.success) {

              thisApp.screen_status = 'dashboard';

            } else {
              // console.log("it's a failure!");
            }

            thisApp.loading = false;

          })
          .catch(function (error) {
            console.log(error);
          });

      },


      request_agent_token: function () {
        this.loading = true;
        this.agent_token_loading = true;


        let thisApp = this;

        thisApp.screen_status = 'dashboard';
        thisApp.list_pending_calls();

        thisApp.loading = false;
        thisApp.agent_token_loading = false;

      },
      answer_call: function (selected_call) {

        this.loading = true;
        this.screen_status = 'loading';

        this.call_id = selected_call.id;
        this.ringtone_audio.pause();


        let thisApp = this;
        axios.post('/agent/answer_call', {
          vu_token: this.$store.state.AppActiveUser.token,
          call_id: selected_call.id
        })
          .then(function (response) {

            if (response.data.success) {

              thisApp.call = response.data.data.call;
              thisApp.screen_status = 'in_call';

            } else {
              // console.log("it's a failure!");
            }

            thisApp.loading = false;

          })
          .catch(function (error) {
            console.log(error);
          });


      },
      loadServices() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token
        };

        axios.post(API.SERVICES_LIST, params).then((res) => {
          console.log(res);
          this_app.services = res.data.data.list;
          this_app.selected_services = this_app.services;
          this_app.request_agent_token();
        }).catch((err) => {
          console.log(err);
        });
      }

    },
    created() {

      this.ringtone_audio = new Audio('https://basma-cdn.s3.me-south-1.amazonaws.com/assets/audio/agent_default_ringtone.mp3');
      this.vendor_id = this.$store.state.AppActiveUser.info.vendor.id;


      if (this.ringtone_audio != null) {
        this.ringtone_audio.pause();
      }

      this.ringtone_audio.loop = true;
      this.ringtone_audio.volume = 1;

      this.loadServices();
    },
    beforeDestroy() {
      this.ringtone_audio.pause();
      this.ringtone_audio = null;
      console.log("we are at onDestroy");
    }

  }
</script>


<style>

  ul.services {
    display: inline-block;
    position: relative;
    width: 100%;
    font-size: 14px;
  }

  .agent_call_box {
    border: 2px solid green;
    border-radius: 5px;
    width: 100%;
    padding: 10px;
    height: 140px;
    position: relative;
    text-align: left;
    background-color: white;
    cursor: default;
    transition: all 0.2s;
    margin: 5px;
    animation: shake 1s;
    animation-iteration-count: infinite;
  }

  /* .agent_call_boxes_container #the_col:first-child .agent_call_box {
    animation: shake 0.5s;
    animation-iteration-count: infinite;
  } */

  .agent_call_box:hover {
    box-shadow: 0px 0px 13px 0px rgba(0, 102, 20, 1);
  }

  .agent_call_box #icon * {
    float: left;
    margin-top: 30px;
    font-size: 50px !important;
    color: green;
  }

  .agent_call_box #text {
    margin-top: 10px;
    margin-left: 65px;
  }

  .agent_call_box #text #title {
    font-size: 30px;
    font-weght: bold;
  }

  .agent_call_box #text #time {
    margin-top: 5px;
    font-size: 15px;
    fint-weight: bold;
  }

  .agent_call_box #text #service {
    border: 1px solid #a27913;
    display: inline-block;
    padding: 4px 5px;
    border-radius: 5px;
    background-color: #ffb600;
    color: #000;
  }

  .agent_call_box #action {
    top: 50px;
    right: 10px;
    position: absolute;
  }


  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }

</style>
