<template>
  <div id="component-chat-log" class="m-8">
    <div v-for="(msg, index) in chatData" class="msg-grp-container" :key="index">
      <div class="flex items-start" :class="[{'flex-row-reverse' : isMe(msg.user_type)}]">
        <div class="msg break-words relative shadow-md rounded py-3 px-4 mb-2 rounded-lg max-w-sm"
             :class="{'bg-primary-gradient text-white': isMe(msg.user_type), 'border border-solid border-transparent bg-white': !isMe(msg.user_type)}">
          <span v-if="msg.message_type == 'text'">{{ msg.value }}</span>
          <span v-if="msg.message_type == 'image'"><ChatFile :file_id="msg.value"></ChatFile></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ChatFile from './ChatFile.vue'

  export default {
    props: {
      chatData: {
        type: Array,
        required: true
      }
    },
    components: {
      ChatFile
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
