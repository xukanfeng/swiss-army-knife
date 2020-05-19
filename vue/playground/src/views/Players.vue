<template>
  <div>
    <span
      ><strong>Click the links to visit the profile of players</strong></span
    >
    <br />
    <router-link to="/playground/player/1">Player1</router-link>
    <span> | </span>
    <router-link to="/playground/player/2">Player2</router-link>
    <br />
    <a-divider />
    <span><strong>Experience the named views</strong></span>
    <br />
    <router-link to="/playground/players/player/3">Player3</router-link>
    <router-view name="welcome"></router-view>
    <router-view name="profile"></router-view>
    <a-divider />
    <div style="text-align: left;">
      <span><strong>导航解析流程</strong></span>
      <ul style="padding: 0 20px;">
        <li>1.导航被触发</li>
        <li>2.在失活的组件里调用调用 beforeRouteLeave</li>
        <li>3.调用全局 beforeRoute</li>
        <li>4.在重用的组件里调用 beforeRouteUpdate</li>
        <li>5.在路由配置里调用 beforeEnter</li>
        <li>6.解析异步路由组件</li>
        <li>7.在被激活的组件里调用 beforeRouteEnter</li>
        <li>8.调用全局 beforeResolve</li>
        <li>9.导航被确认</li>
        <li>10.调用全局 afterEach</li>
        <li>11.触发 DOM 更新</li>
        <li>12.创建好的实例调用 beforeRouteEnter 中传给 next 的回调函数</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Divider } from 'ant-design-vue'

Vue.use(Divider)

export default {
  data: () => ({
    boo: 'boo',
  }),
  // 当使用路由参数时，页面会被复用，因此跳转到 '/playground/players/player/3' 时生命周期函数不会被调用
  mounted() {
    console.log('[mounted]')
  },
  // 可以在导航守卫中监听路由变化
  beforeRouteUpdate(to, from, next) {
    console.log('[beforeRouteUpdate] 组件内的守卫')
    next()
  },
  beforeRouteEnter(to, from, next) {
    console.log('[beforeRouterEnter] 组件内的守卫')
    // 不能访问 this！因为组件还没有创建！
    // console.log(this.id)
    // 可以在导航被确认的时候执行回调来访问本实例
    next((vm) => {
      console.log(vm.boo)
    })
  },
  beforeRouteLeave(to, from, next) {
    console.log('[beforeRouterLeave] 组件内的守卫')
    // 离开守卫通常用于确认离开该页面
    next()
  },
}
</script>
