<template>
  <a-result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
  >
    <template v-slot:extra>
      <a-button type="primary" @click="$router.push('/')">Back Home</a-button>
    </template>
  </a-result>
</template>

<script>
import Vue from 'vue'
import { Result, Button } from 'ant-design-vue'

Vue.use(Result)
Vue.use(Button)

export default {
  name: 'Error404',
}
</script>