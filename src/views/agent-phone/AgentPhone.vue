<template>
  <div>

    <!-- Loading -->
    <div v-show="screen_status == 'loading'">
      <div class="fill-row-loading">
        <div id="loading" class="vs-con-loading__container loading-example">
        </div>
      </div>
    </div>

    <!-- Video Connecting Screen -->
    <div v-if="screen_status == 'dashboard'" style="text-align:center">
      <vs-card style="padding: 20px">
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

        <div v-if="pending_calls_list.length > 0" style="font-size:20px">
          <h1 style="display: inline-block">{{pending_calls_list.length}}</h1> people waiting 😃
        </div>

        <br/>
        <br/>

        <vs-row class="agent_call_boxes_container">
          <vs-col vs-type="flex" id="the_col" vs-justify="center" vs-align="center" vs-sm="12" vs-md="12" vs-lg="12"
                  v-for="call in pending_calls_list">
            <div class="agent_call_box" @click="answer_call(call)">

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

              <div id="details">
                <table>
                  <tr v-for="field in call.custom_fields_values">
                    <td class="font-semibold" style="min-width:80px; text-transform: uppercase">{{ field.label }}:</td>
                    <td>{{ field.value }}</td>
                  </tr>
                </table>
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
      </vs-card>
    </div>

    <!-- In Call -->
    <vs-row v-if="screen_status == 'in_call'">

      <vs-col vs-justify="space-between" vs-sm="12" vs-md="8" vs-lg="8">
        <vs-card style="width:100%;">
          <CallBox ref="call_box" :connection_token="call.connection_agent_token" :room_name="'call-'+call.id" style="width:100%;"></CallBox>
        </vs-card>
      </vs-col>

      <vs-col id="right-sidebar" vs-justify="space-between" vs-sm="12" vs-md="4" vs-lg="4" class="pa-2">
        <vs-card>
          <vs-button style="width:100%; margin-bottom: 15px" type="border" color="danger" @click="end_call">End Call</vs-button>
          <div class="sidebar-details">
            <custom-fields v-if="call.custom_fields_values != null" :custom_fields="call.custom_fields_values"></custom-fields>
          </div>
          <vs-textarea placeholder="Your private notes goes here, as you type it gets saved automatically.." v-debounce:1s="updateNotes" v-model="agent_notes" type="textarea" rows="5"/>
<!--          <ChatBox :user_token="vu_token" :call_id="call_id" style="margin-bottom: 15px"></ChatBox>-->
        </vs-card>
      </vs-col>

    </vs-row>

  </div>
</template>

<script>
  import axios from '@/axios.js';
  import API from '@/api.js';
  import CallBox from '@/components/CallBox.vue';
  import ChatBox from '@/components/chat-box/ChatBox.vue'
  import CustomFields from '@/components/CustomFields.vue';

  export default {
    props: ['token'],
    data: () => ({
      loading: false,
      vendor: {},
      screen_status: 'loading',
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
      agent_notes: '',
      wasSidebarOpen: null
    }),
    components: {
      CallBox,
      ChatBox,
      CustomFields
    },
    watch: {
      screen_status: function(status){
        if (status == 'in_call'){
          this.wasSidebarOpen = this.$store.state.reduceButton
          this.$store.commit('TOGGLE_REDUCE_BUTTON', true)
        }else{
          if (!this.wasSidebarOpen) this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
        }
      },
      loading: function(loading) {
        if (loading) {
          this.screen_status = 'loading';
        }
      },
      noFilter: function (val) {
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
      request_agent_token: function () {
        let thisApp = this;
        this.loading = true;

        thisApp.screen_status = 'dashboard';
        thisApp.list_pending_calls();

        thisApp.loading = false;
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
      },
      updateNotes() {
        axios.post('/agent/update_call', {
          vu_token: this.$store.state.AppActiveUser.token,
          call_id: this.call_id,
          agent_notes: this.agent_notes,
          custom_fields_values: this.call.custom_fields_values,
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
          this.noFilter = true
        } else {
          this.noFilter = false
        }
      },
      list_pending_calls: function () {
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

          })
          .catch(function (error) {
            console.log(error);
          });

      },
      end_call: function () {
        this.updateNotes();

        let thisApp = this;

        this.loading = true;
        this.ringtone_switch = true

        this.$refs.call_box.end_call();

        axios.post('/agent/end_call', {
          vu_token: this.$store.state.AppActiveUser.token,
          call_id: this.call_id
        })
          .then(function (response) {
            thisApp.loading = false;

            if (response.data.success) {
              thisApp.screen_status = 'dashboard';
            } else {
              // console.log("it's a failure!");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      answer_call: function (selected_call) {
        let thisApp = this;

        thisApp.loading = true;

        thisApp.call_id = selected_call.id;
        thisApp.ringtone_switch = false

        axios.post('/agent/answer_call', {
          vu_token: this.$store.state.AppActiveUser.token,
          call_id: selected_call.id
        })
          .then(function (response) {
            thisApp.loading = false;

            if (response.data.success) {

              thisApp.call = response.data.data.call;
              thisApp.screen_status = 'in_call';

            } else {
              // console.log("it's a failure!");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      join_call_by_token() {
        const this_app = this;

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "call_request_id": this.token,
        };

        axios.post(API.CALL_REQUESTS_JOIN, params).then((res) => {
          console.log(res);
          this_app.answer_call({ id : res.data.data.call_id });
        }).catch((err) => {
          console.log(err);
        }).finally(()=>{
          this_app.token = null;
        });
      }
    },
    mounted() {
      this.$vs.loading({
        container: "#loading",
        background: 'transparent',
        scale: 1.5
      })
    },
    created() {
      if (this.token != null) {
        console.log('this.token', this.token);
        this.join_call_by_token();
      }

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
      if (this.screen_status == 'in_call') {
        this.end_call();
      }
      this.ringtone_audio.pause();
      this.ringtone_audio = null;
      if (!this.wasSidebarOpen) this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
      console.log("we are at onDestroy");
    }
  }
</script>

<style lang="scss">

  ul.services {
    display: inline-block;
    position: relative;
    width: 100%;
    font-size: 14px;
  }

  .agent_call_box {
    border: 2px solid #e4e4e4;
    border-radius: 5px;
    width: 100%;
    padding: 10px;
    /*height: 140px;*/
    position: relative;
    text-align: left;
    background-color: white;
    cursor: default;
    transition: all 0.2s;
    margin: 5px;
    animation: shake 1.5s;
    animation-iteration-count: infinite;
    cursor: pointer;
  }

  /* .agent_call_boxes_container #the_col:first-child .agent_call_box {
    animation: shake 0.5s;
    animation-iteration-count: infinite;
  } */

  .agent_call_box:hover {
    box-shadow: 0px 0px 13px 0px #e4e4e4;
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
    margin-bottom: 20px;
  }

  .agent_call_box #details {
    padding: 8px;
    border-top: 2px solid #e4e4e4;
    font-size: 14px;
  }

  .agent_call_box #text #title {
    font-size: 30px;
    font-weght: bold;
  }

  .agent_call_box #text #time {
    font-size: 10px;
    top: 8px;
    position: relative;
  }

  .agent_call_box #text #time .vs-icon {
    top: 3px;
    position: relative;
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

  #right-sidebar {
    padding-left: 15px;
  }

  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    #right-sidebar {
      padding-left: 0px;
    }
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

  .fill-row-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    .loading-example {
      width: 120px;
      float: left;
      height: 120px;
      margin: 8px;
      transition: all 0.3s ease;
      h4 {
        z-index: 40000;
        position: relative;
        text-align: center;
        padding: 10px;
      }

    }
  }
  .sidebar-details {
    /*border: 1px solid #eee;*/
    /*border-radius: 5px;*/
    /*margin-bottom: 15px;*/
    /*font-size: 12px;*/
    /*padding: 7px;*/
  }
  /*.vs-textarea-primary {*/
  /*  border-color: #eee !important;*/
  /*}*/
</style>
