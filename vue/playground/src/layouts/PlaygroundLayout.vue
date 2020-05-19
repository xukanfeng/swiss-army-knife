<template>
  <a-layout>
    <a-layout-sider style="height: 100vh" :trigger="null" collapsible v-model="collapsed">
      <div class="logo" />
      <a-menu style="text-align: left" theme="dark" mode="inline" :defaultSelectKeys="['1']">
        <a-menu-item key="1">
          <router-link to="/playground/puzzlecards">
            <a-icon type="credit-card" />
            <span>PuzzleCards</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link :to="{ name: 'players'}">
            <a-icon type="user" />
            <span>Players</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/playground/miscellanies">
            <a-icon type="medium" />
            <span>Miscellanies</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="4">
          <router-link to="/playground/chatroom">
            <a-icon type="wechat" />
            <span>ChatRoom</span>
          </router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => collapsed = !collapsed"
        />
        <strong>Enjoy Vue!</strong>
      </a-layout-header>
      <a-layout-content
        :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
      >
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer>
        Footer
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import Vue from 'vue'
import { Layout, Menu, Icon } from 'ant-design-vue'

Vue.use(Layout)
Vue.use(Menu)
Vue.use(Icon)

export default {
  name: 'PlaygroundLayout',
  data: () => ({
    collapsed: false,
  }),
}
</script>

<style scoped>
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
  float: left;
}
.trigger:hover {
  color: #1890ff;
}
.logo {
  height: 32px;
  background: rgba(255, 255, 255, .2);
  margin: 16px;
}
</style>