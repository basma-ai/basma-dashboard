<template>
  <div id="component-chat-log" class="m-8">
    <div v-for="(msg, index) in chatData" class="msg-grp-container" :key="index">
      <div class="flex items-start" :class="[{'flex-row-reverse' : isMe(msg.user_type)}]">
        <div class="msg break-words relative shadow-md rounded py-3 px-4 mb-2 rounded-lg max-w-sm"
             :class="{'bg-primary-gradient text-black': (isMe(msg.user_type) && msg.message_type != 'signature_request'), 'border border-solid border-transparent bg-white': !isMe(msg.user_type), 'bg-success text-white' : msg.message_type == 'signature_request'}">
          <span v-if="msg.message_type == 'text'">{{ msg.value }}</span>
          <span v-if="msg.message_type == 'signature_request'">(signature requested)</span>
          <span v-else><ChatFile :file_type="msg.message_type" :file_id="msg.value"></ChatFile></span>
        </div>
      </div>
    </div>
    <div v-if="loadingMessage">
      <div class="flex items-start">
        <div class="msg break-words relative shadow-md rounded py-3 px-4 mb-2 rounded-lg max-w-sm" style="padding: 10px; margin-top: 20px">
          <loading></loading>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ChatFile from './ChatFile.vue'
  import Loading from '@/components/Loading.vue';

  export default {
    props: {
      chatData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        loadingMessage: false,
      }
    },
    components: {
      ChatFile,
      Loading
    },
    computed: {},
    methods: {
      isMe(user_type) {
        return user_type == 'vu'
      },
      scrollToBottom() {
        this.$nextTick(() => {
          this.$parent.$el.scrollTop = this.$parent.$el.scrollHeight
        })
      }
    },
    updated() {
      this.scrollToBottom()
    },
    mounted() {
      this.scrollToBottom()
    }
  }
</script>
