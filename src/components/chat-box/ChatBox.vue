<template>
  <div id="chat-app" class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden">
    <div class="chat__bg chat-content-area">
      <template>
        <VuePerfectScrollbar class="chat-content-scroll-area" :settings="settings">
          <div class="chat__log" ref="chatLog">
            <chat-log :chatData="chatData"></chat-log>
          </div>
        </VuePerfectScrollbar>
        <div class="chat__input flex p-4 bg-white">
          <vs-input class="flex-1" placeholder="Type Your Message" v-model="typedMessage" @keyup.enter="sendMsg"/>
          <vx-tooltip text="Request signature">
            <RequestSignature class="ml-2" @requestSignature="requestSignature"></RequestSignature>
          </vx-tooltip>
          <vx-tooltip text="Attach file">
            <FileUpload class="ml-2" belongs_to="calls" :belongs_to_id="call_id" @uploaded="fileUploaded"></FileUpload>
          </vx-tooltip>
          <vx-tooltip text="Send message">
            <vs-button color="dark" class="ml-2 send_button" icon-pack="feather" icon="icon-send" type="border" @click="sendMsg"></vs-button>
          </vx-tooltip>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import ChatLog from './ChatLog.vue'
  import FileUpload from './FileUpload.vue';
  import RequestSignature from './RequestSignature.vue';

  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: ['call_id'],
    data() {
      return {
        typedMessage: '',
        settings: {
          maxScrollbarLength: 60,
          wheelSpeed: 0.70
        },
        chatData: []
      }
    },
    watch: {},
    computed: {},
    methods: {
      fileUploaded(file) {
        this.postMessage(file.type, file.id);
      },
      requestSignature(){
        this.postMessage('signature_request', '')
      },
      sendMsg() {
        let this_app = this;

        if (!this.typedMessage) return

        this.postMessage('text', this.typedMessage, function() {
          this_app.typedMessage = '';
        })

      },
      postMessage(type, value, onDone = null) {
        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "call_id": this.call_id,
          "message_type": type,
          "value": value
        };

        axios.post(API.SEND_MESSAGE, params).then(function (res) {
          if(onDone != null) {
            onDone()
          }
        }.bind(this));
      },
      addChat(chat) {
        this.chatData.push(chat)
      },
    },
    components: {
      VuePerfectScrollbar,
      ChatLog,
      FileUpload,
      RequestSignature
    },
    created() {
    },
  }
</script>

<style lang="scss">
  @import "@/assets/scss/vuexy/apps/chat.scss";

  .send_button {
    padding: 0.4rem 0.8rem 0.4rem 0.7rem !important;
    width: 44px !important;
    height: 39px !important;
    i {
      font-size: 20px;
    }
  }
</style>
