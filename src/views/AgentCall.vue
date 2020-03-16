<template>
  <div>

      <div style="text-align:center">
        <vs-card :loading="loading">
          <div class="text-center" style="padding: 20px">

            <!-- <img id="vendor-logo" :src="vendor.logo_url"/> -->
            <!-- <br/><br/> -->

            <!-- Video Connecting Screen -->
            <div v-if="screen_status == 'dashboard'">

              list of calls goes here:
              <br/>
              <div v-for="call in pending_calls_list" class="agent_call_box">

                <div id="text">
                  <div id="title">
                    <img src="@/assets/images/dancing_phone.gif" height="40px"/>
                    Call {{call.id}}
                  </div>
                  <div id="service">
                    <span>{{call.vendor_service.service_name}}</span>
                  </div>
                </div>
                <vs-button id="answer" color="green" @click="answer_call(call)">Answer</vs-button>

              </div>

              <div v-if="pending_calls_list.length < 1">
                No pending calls, this page will refresh automatically
              </div>

            </div>


            <!-- In Call -->
            <div v-if="screen_status == 'in_call'">

              <div styte="height:10px"></div>

              <div v-if="call.status == 'started' && call.connection_agent_token != null">
                <v-row>

                  <v-col cols="12" sm="7">
                    <CallBox ref="call_box" :connection_token="call.connection_agent_token" :room_name="'call-'+call.id" style="width:100%;"></CallBox>
                  </v-col>
                  <v-col>

                    <vs-button @click="end_call">End Call</vs-button>

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
  import axios from '../axios.js';
  import CallBox from '@/components/CallBox.vue';


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
      pending_calls_list: []
    }),
    components: {
      CallBox
    },
    methods: {
      list_pending_calls: function () {
        // this.loading = true;

        let thisApp = this;
        axios.post('/agent/list_pending_calls', {
          vu_token: this.$store.state.AppActiveUser.token
        })
          .then(function (response) {

            if (response.data.success) {

              thisApp.pending_calls_list = response.data.data.pending_calls_list;


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


      }

    },
    created() {

      this.vendor_id = this.$store.state.AppActiveUser.info.vendor.id

      this.request_agent_token();

    }
  }
</script>


<style>
.agent_call_box {
  border:1px solid silver;
  //padding:5px;
  margin-bottom:5px;
  border-radius:10px;
  height:80px;
  line-height:80px;
}
.agent_call_box:hover {
  background: #f3f5db;
}

.agent_call_box #text {
  float:left;
  margin-left:10px;
}
.agent_call_box #text #title {
  font-weight:bold;
}
.agent_call_box #service {
  margin-left:10px;
}
.agent_call_box #text div{
  display:inline-block;
}
.agent_call_box #answer {
  float:right;
  margin-top:20px;
  margin-right:10px;
}
.call_box {
  width:inherit;
  background:#DDD;
  border:1px solid #DDD;
  position:relative;
  height:inherit;
  background:#000;
  display:inline-block;
  min-height: 300px;
}
.call_box #controls {
  bottom:0;
  position:absolute;
  right:0;
  margin:10px;
}
#local-media {
  position:absolute;
  width:100%;
}
#local-media video {
  max-width:25%;
  max-height:25%;
  float:left;
  left:0;
  border-bottom:1px solid #DDD;
  border-right:1px solid #DDD;
}
#remote-media-div video {
  width:100%;
  max-height: 600px;
  margin:0;
  padding:0;
  height:100%;
  margin-bottom:-6px;
}
#vendor-logo {
  max-width: 160px;
  height: auto
}
</style>