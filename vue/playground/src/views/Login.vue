<template>
  <div style="width: 300px; margin: auto">
    <form>
      <fieldset>
        <a-input placeholder="User Name" v-model="userName">
          <a-icon slot="prefix" type="user" />
        </a-input>
        <br />
        <br />
        <a-input placeholder="Password" v-model="password">
          <a-icon slot="prefix" type="unlock" />
        </a-input>
        <br />
        <br />
        <a-button type="primary" style="width: 100%" @click.prevent="onSubmit(userName, password)">Sign in</a-button>
      </fieldset>
    </form>
  </div>
</template>

<script>
import Vue from 'vue'
import { Input, Icon, Button } from 'ant-design-vue'
import { SIGN_IN } from '@/store/actions'

Vue.use(Input)
Vue.use(Icon)
Vue.use(Button)

export default {
  name: 'Login',
  data: () => ({
    userName: 'a',
    password: 'test',
  }),
  methods: {
    onSubmit(userName, password) {
      this.$store
        .dispatch(SIGN_IN, { userName, password })
        .then(() => this.$router.push('/playground'))
    }
  },
}
</script>

<style lang="less" scoped>

</style>