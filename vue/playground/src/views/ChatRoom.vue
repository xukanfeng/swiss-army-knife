<template>
  <div>
    <a-row>
      <a-col :span="18">
        <div class="list-container">
          <div class="list-desc">Room</div>
          <div class="list">
            <!--
            <RecycleScroller
              style="height: 100%"
              :items="msgList"
              :item-size="24"
              key-field="id"
              v-slot="{ item }"
              ref="msg_scroller"
              v-infinite-scroll="handleInfiniteOnload"
              :infinite-scroll-distance="10"
            >
              <div>{{ formateMsg(item) }}</div>
            </RecycleScroller>
            -->
            <span v-for="msg in msgList" :key="msg" class="msg">{{ formateMsg(msg) }}</span>
          </div>
        </div>
        <div class="msg-editor">
          <a-input v-model="message" @keyup.enter="onSend(message)"></a-input>
          <a-button type="primary" style="width: 100px; margin-left: 10px" @click.prevent="onSend(message)">Send</a-button>
        </div>
      </a-col>
      <a-col :span="6">
        <div class="user-list-container list-container">
          <div class="list-desc">Users</div>
          <div class="list">
            <RecycleScroller
              style="height: 100%"
              :items="userList"
              :item-size="20"
              key-field="name"
              v-slot="{ item }"
              ref="user_scroller"
              v-infinite-scroll="handleInfiniteOnload"
              :infinite-scroll-distance="10"
            >
              <div>{{ item.name }}</div>
            </RecycleScroller>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import infiniteScroll from 'vue-infinite-scroll'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { Row, Col, Input, Button } from 'ant-design-vue'
import {
  INIT_USER_LIST,
  UPDATE_USER_LIST,
  UPDATE_MSG_LIST,
} from '@/store/mutations'
import { websocket } from '../utils/websocket'
import { config } from '../../public/config'

Vue.use(Row)
Vue.use(Col)
Vue.use(Input)
Vue.use(Button)

/*
// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  inserted: function(el) {
    el.focus()
  },
  bind: function() {},
  update: function() {},
  componentUpdated: function() {},
  unbind: function() {}
})
*/
export default {
  name: 'ChatRoom', // 组件名应该始终时多个单词的，可以避免和 html 元素冲突
  // 注册局部指令
  directives: {
    infiniteScroll,
  },
  components: {
    RecycleScroller,
  },
  mixins: [],
  props: {}, // 声明时始终使用 camelCase，在模版中使用时始终使用 kebab-case
  data: () => ({ // data 的值必须时返回一个对象的函数，这样才能保证每个组件实例的数据独立
    ws: {},
    message: '',
  }),
  computed: {
    ...mapGetters(['userList', 'msgList', 'currentUser']),
  },
  watch: {},
  created: function() {
    this.ws = websocket[config.CHAT_WS_URL + `?name=${this.currentUser.name}`]
    this.ws.onmessage = this.onMessage
  },
  mounted() {},
  beforeDestroy: function() {
    this.ws = {}
  },
  methods: {
    onMessage(event) {
      console.log('ws:' + event.data)
      const data = event.data
      const msg = JSON.parse(data)
      if (msg.type === 'list') {
        this.$store.commit(INIT_USER_LIST, msg.data)
        this.$refs.user_scroller.scrollToItem(this.userList.length)
      } else if (msg.type === 'join') {
        this.$store.commit(UPDATE_USER_LIST, { user: msg.user, status: 'join' })
        this.$store.commit(UPDATE_MSG_LIST, msg)
        this.$refs.user_scroller.scrollToItem(this.userList.length)
        // this.$refs.msg_scroller.scrollToItem(this.msgList.length)
      } else if (msg.type === 'left') {
        this.$store.commit(UPDATE_USER_LIST, { user: msg.user, status: 'left' })
        this.$store.commit(UPDATE_MSG_LIST, msg)
        this.$refs.user_scroller.scrollToItem(this.userList.length)
        // this.$refs.msg_scroller.scrollToItem(this.msgList.length)
      } else if (msg.type === 'chat') {
        this.$store.commit(UPDATE_MSG_LIST, msg)
        // this.$refs.msg_scroller.scrollToItem(this.msgList.length)
      }
    },
    onSend(message) {
      this.ws.send(message)
      this.message = ''
    },
    formateMsg(msg) {
      if (msg.type === 'chat')
        return `${msg.user.name}: ${msg.data}`
      else
        return msg.data
    },
    handleInfiniteOnload() {

    },
  },
}
</script>

<style lang="less" scoped>
.list-container{
  background: #fbfbfb;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  text-align: left;
}
.list-desc{
  height: 20px;
  padding-left: 10px;
  background: #f2f2f2;
}
.list{
  height: 50vh;
  padding-left: 10px;
  overflow: scroll;
}
.msg-editor{
  display: flex;
  margin-top: 10px;
}
.user-list-container{
  margin-left: 20px;
}
.msg{
  color: black;
}
</style>