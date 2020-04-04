<template>
  <div id="chat-app" class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden">
    <div class="chat__bg chat-content-area" :class="{'flex items-center justify-center': activeChatUser === null}">
      <template v-if="activeChatUser">
        <component :is="scrollbarTag" class="chat-content-scroll-area" :settings="settings" ref="chatLogPS" :key="$vs.rtl">
          <div class="chat__log" ref="chatLog">
            <chat-log :userId="activeChatUser" v-if="activeChatUser"></chat-log>
          </div>
        </component>
        <div class="chat__input flex p-4 bg-white">
          <vs-input class="flex-1" placeholder="Type Your Message" v-model="typedMessage" @keyup.enter="sendMsg" />
          <vs-button class="ml-4" type="border" @click="sendMsg">Send</vs-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import ChatContact         from './ChatContact.vue'
  import ChatLog             from './ChatLog.vue'
  import ChatNavbar          from './ChatNavbar.vue'
  import UserProfile         from './UserProfile.vue'
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  import moduleChat          from '@/store/chat/moduleChat.js'

  export default {
    props: ['user_token', 'call_id'],
    data () {
      return {
        active               : true,
        isHidden             : false,
        searchContact        : '',
        activeProfileSidebar : false,
        activeChatUser       : null,
        userProfileId        : -1,
        typedMessage         : '',
        isChatPinned         : false,
        settings             : {
          maxScrollbarLength : 60,
          wheelSpeed         : 0.70
        },
        clickNotClose        : true,
        isChatSidebarActive  : true,
        isLoggedInUserProfileView: false
      }
    },
    watch: {
      windowWidth () {
        this.setSidebarWidth()
      }
    },
    computed: {
      chatLastMessaged () {
        return (userId) => this.$store.getters['chat/chatLastMessaged'](userId)
      },
      chatUnseenMessages () {
        return (userId) => {
          const unseenMsg = this.$store.getters['chat/chatUnseenMessages'](userId)
          if (unseenMsg) return unseenMsg
        }
      },
      activeUser () {
        return this.$store.state.AppActiveUser
      },
      getStatusColor () {
        return (isActiveUser) => {
          const userStatus = this.getUserStatus(isActiveUser)

          if (userStatus === 'online') {
            return 'success'
          } else if (userStatus === 'do not disturb') {
            return 'danger'
          } else if (userStatus === 'away') {
            return 'warning'
          } else {
            return 'grey'
          }
        }
      },
      chatContacts () {
        return this.$store.getters['chat/chatContacts']
      },
      contacts () {
        return this.$store.getters['chat/contacts']
      },
      searchQuery: {
        get () {
          return this.$store.state.chat.chatSearchQuery
        },
        set (val) {
          this.$store.dispatch('chat/setChatSearchQuery', val)
        }
      },
      scrollbarTag () {
        return this.$store.getters.scrollbarTag
      },
      isActiveChatUser () {
        return (userId) => userId === this.activeChatUser
      },
      windowWidth () {
        return this.$store.state.windowWidth
      }
    },
    methods: {
      getUserStatus (isActiveUser) {
        // return "active"
        return isActiveUser ? this.$store.state.AppActiveUser.status : this.contacts[this.activeChatUser].status
      },
      closeProfileSidebar (value) {
        this.activeProfileSidebar = value
      },
      updateActiveChatUser (contactId) {
        // console.log(contactId);
        this.activeChatUser = 1
        // if (this.$store.getters['chat/chatDataOfUser'](this.activeChatUser)) {
        //   this.$store.dispatch('chat/markSeenAllMessages', contactId)
        // }
        // const chatData = this.$store.getters['chat/chatDataOfUser'](this.activeChatUser)
        // if (chatData) this.isChatPinned = chatData.isPinned
        // else this.isChatPinned = false
        this.toggleChatSidebar()
        this.typedMessage = ''
      },
      showProfileSidebar (userId, openOnLeft = false) {
        this.userProfileId = userId
        this.isLoggedInUserProfileView = openOnLeft
        this.activeProfileSidebar = !this.activeProfileSidebar
      },
      sendMsg () {
        if (!this.typedMessage) return
        const payload = {
          'isPinned': this.isChatPinned,
          'msg': {
            'textContent' : this.typedMessage,
            'time'        : String(new Date()),
            'isSent'      : true,
            'isSeen'      : false
          },
          'id': this.activeChatUser
        }
        this.$store.dispatch('chat/sendChatMessage', payload)
        this.typedMessage = ''

        const scroll_el = this.$refs.chatLogPS.$el || this.$refs.chatLogPS
        scroll_el.scrollTop = this.$refs.chatLog.scrollHeight
      },
      toggleIsChatPinned (value) {
        this.isChatPinned = value
      },
      setSidebarWidth () {
        if (this.windowWidth < 1200) {
          this.isChatSidebarActive = this.clickNotClose = false
        } else {
          this.isChatSidebarActive = this.clickNotClose = true
        }
      },
      toggleChatSidebar (value = false) {
        if (!value && this.clickNotClose) return
        this.isChatSidebarActive = value
      }
    },
    components: {
      VuePerfectScrollbar,
      ChatContact,
      UserProfile,
      ChatNavbar,
      ChatLog
    },
    created () {
      this.$store.registerModule('chat', moduleChat)
      this.$store.dispatch('chat/fetchContacts')
      this.$store.dispatch('chat/fetchChatContacts')
      this.$store.dispatch('chat/fetchChats')
      this.setSidebarWidth()
      this.updateActiveChatUser(1);

      // call the socket
      const params = {
        user_type: "vu",
        user_token: this.vu_token,
        call_id: this.call_id,
      };

      this.$socket.emit("start_socket", params);
    },
    beforeDestroy () {
      this.$store.unregisterModule('chat')
    },
    mounted () {
      // this.$store.dispatch('chat/setChatSearchQuery', '')

      this.sockets.subscribe("on_update", (data) => {
        let thisApp = this;

        console.log("on_update", data);
      });
    },
    sockets: {
      connect: function () {
        console.log('connected!')
      },
    },
  }

</script>


<style lang="scss">
  @import "@/assets/scss/vuexy/apps/chat.scss";
</style>
