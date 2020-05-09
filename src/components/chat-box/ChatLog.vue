<template>
    <div id="component-chat-log" class="m-8">
        <div v-for="(msg, index) in chatData" class="msg-grp-container" :key="index">

<!--          call_id: 1552-->
<!--          message_type: "text"-->
<!--          time: 1588386907959-->
<!--          user_id: 12-->
<!--          user_type: "vu"-->
<!--          value: "sd"-->

            <div class="flex items-start" :class="[{'flex-row-reverse' : isMe(msg.user_type)}]">
                <div class="msg break-words relative shadow-md rounded py-3 px-4 mb-2 rounded-lg max-w-sm" :class="{'bg-primary-gradient text-white': isMe(msg.user_type), 'border border-solid border-transparent bg-white': !isMe(msg.user_type)}">
                    <span>{{ msg.value }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default{
  props: {
    chatData: {
      type: Array,
      required: true
    }
  },
  computed: {
  },
  methods: {
    isMe(user_type){
      return user_type == 'vu'
    },
    scrollToBottom () {
      this.$nextTick(() => {
        this.$parent.$el.scrollTop = this.$parent.$el.scrollHeight
      })
    }
  },
  updated () {
    this.scrollToBottom()
  },
  mounted () {
    this.scrollToBottom()
  }
}
</script>
