<template>
  <div id="chat-app" class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden">
    <div class="chat__bg chat-content-area" >
      <template>
        <VuePerfectScrollbar class="chat-content-scroll-area" :settings="settings">
          <div class="chat__log" ref="chatLog">
            <chat-log :chatData="chatData"></chat-log>
          </div>
        </VuePerfectScrollbar>
        <div class="chat__input flex p-4 bg-white">
          <vs-input class="flex-1" placeholder="Type Your Message" v-model="typedMessage" @keyup.enter="sendMsg" />
          <vs-button class="ml-4" type="border" @click="sendMsg">Send</vs-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import ChatLog             from './ChatLog.vue'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

  import axios from '@/axios.js'
  import API from '@/api.js'

  export default {
    props: ['call_id'],
    data () {
      return {
        typedMessage         : '',
        settings             : {
          maxScrollbarLength : 60,
          wheelSpeed         : 0.70
        },
        chatData: []
      }
    },
    watch: {
    },
    computed: {
    },
    methods: {
      sendMsg() {
        if (!this.typedMessage) return

        const params = {
          "vu_token": this.$store.state.AppActiveUser.token,
          "call_id": this.call_id,
          "message_type": "text",
          "value": this.typedMessage
        };

        axios.post(API.SEND_MESSAGE, params).then(function (res) {
          this.typedMessage = '';
        }.bind(this));
      },
      addChat(chat){
        this.chatData.push(chat)
      },
    },
    components: {
      VuePerfectScrollbar,
      ChatLog
    },
    created () {
    },
  }
</script>

<style lang="scss">
  @import "@/assets/scss/vuexy/apps/chat.scss";
</style>
