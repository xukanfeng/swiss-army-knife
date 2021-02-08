<template>
  <div>
    <TodoList></TodoList>
    <a-divider></a-divider>
    <TsNotes></TsNotes>
    <a-divider></a-divider>
    <br />
    <div style="text-align: left">
      <p><strong>Vue</strong></p>
      <!--v-model.lazy .number .trim-->
      <input class="input-normal" :class="{ 'input-border': inputData === '' }" v-model="inputData" v-focus />
      <p :style="{ fontSize: formatedInputData * 10 + 'px' }">inputData:{{ inputData }}</p>
      <p :style="styleObject">inputData handled by method:{{ formateInputData() }}</p>
      <p :class="classObject">computed attribute:{{ formatedInputData }}</p>
      <p :class="['normal', formatedInputData > 2 ? 'p-border' : '']">watched data:{{ watchedData }}</p>
      <br />
      <p>input will NOT be reused if it has a KEY</p>
      <div v-if="parseFloat(inputData).toString() === 'NaN'">
        <p><strong>inputData is not a number</strong></p>
        <input placeholder='it will NOT be reused' key='input1'>
      </div>
      <div v-else>
        <p>inputData is a number</p>
        <input placeholder='it will NOT be reused' key='input2'>
      </div>
    </div>
    <br />
    <Uploader></Uploader>
  </div>
</template>

<script>
import Vue from 'vue'
import { Divider } from 'ant-design-vue'
import TodoList from '@/components/TodoList.vue'
import TsNotes from '@/components/TsNotes.vue'
import Uploader from '@/components/Uploader.vue'

Vue.use(Divider)

export default {
  directives: {
    focus: {
      // 可用钩子函数：
      // bind 只调用一次，第一次绑定到元素时调用
      // inserted 被绑定元素插入父节点时调用
      // update 所在组件的 VNode 更新时调用
      // componentUpdated 所在组件的 VNode 及其子 VNode 全部更新后调用
      // unbind 只调用一次，解绑时调用
      inserted (el) {
        el.focus()
      },
    },
  },
  components: {
    TodoList,
    TsNotes,
    Uploader,
  },
  data: () => ({
    inputData: '',
    watchedData: '',
    biBindingData: '',
  }),
  computed: {
    formatedInputData () {
      return Number(this.inputData)
    },
    styleObject () {
      return {
        fontSize: this.formateInputData() * 5 + 'px',
      }
    },
    classObject () {
      return {
        normal: true, // class name 为单个单词时可以不加 ''
        'p-border': this.formateInputData() > 2,
      }
    },
    // 双向绑定的计算属性，可以用来替代 v-model
    biBindingMsg: {
      get () {
        return this.biBindingData
      },
      set (value) {
        this.biBindingData = value
      }
    }
  },
  watch: {
    inputData () {
      this.watchedData = '*'.repeat(Number(this.inputData))
    }
  },
  methods: {
    formateInputData () {
      return Number(this.inputData)
    },
  }
}
</script>

<style scoped>
.input-normal {
  margin-bottom: 1em;
  background: #f8f8f8;
}
.input-border {
  border: 1px solid red;
}
.normal {
  background: #f8f8f8;
}
.p-border {
  border: 1px solid red;
}
</style>