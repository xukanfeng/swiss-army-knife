<template>
  <div>
    <transition name="slide-fade">
      <p v-if="show">This is Player #{{ id }}</p>
    </transition>
    <!--
      <text>{{ data }}</text>
      -->
    <br />
    <a-button type="primary" @click="goBack">Go Back</a-button>
    <a-button type="primary" @click="toggle" style="margin-left: 10px;"
      >Toggle</a-button
    >
  </div>
</template>

<script>
import Vue from 'vue'
import { Button } from 'ant-design-vue'

Vue.use(Button)

export default {
  data: () => ({
    show: true,
  }),
  // 使用 props 将组件和路由解耦，从 $router 中获取的参数将从 props 中获取
  // 布尔模式
  props: ['id'],
  // 对象模式 & 函数模式
  /*
  props: {
    data: String
  },
  */
  // 两种获取数据的方式
  beforeRouteEnter(to, from, next) {
    // 1.导航完成之前获取数据
    next()
  },
  created() {
    // 2.导航完成后获取数据
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    },
    // router.replace() <==> <router-link :to="..." replace></router-link>, 不会向 history 添加记录，而是替换
    toggle() {
      this.show = !this.show
    },
  },
}
</script>

<style lang="less" scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 2s;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
