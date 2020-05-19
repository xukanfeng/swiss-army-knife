<template>
  <div class="container">
    <a-layout>
      <a-layout-header style="height: 30vh; background: #f2f2f2;">
        Header
      </a-layout-header>
      <a-layout-content style="height: 50vh">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer style="height: 20vh">
        Footer
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
import Vue from 'vue'
import { Layout } from 'ant-design-vue'

Vue.use(Layout)

export default {
  name: 'LoginLayout',
}
</script>

<style lang="less" scoped>

</style>