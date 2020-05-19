<template>
  <div class="item">
    <button :class="['checkbox', {'checkbox-checked': todo.done }]" @click="completeTodo()" />
    <input class="desc" :value="todo.desc" @input="modifyDesc($event.target.value)" />
    <button class="star" @click="toggleStared()">
      <div v-if="todo.stared">
        <svg t="1586736510735" class="icon" viewBox="0 0 1228 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7975" width="20" height="20"><path d="M1131.2128 391.168a48.4352 48.4352 0 0 0-39.1168-33.0752l-300.032-43.6224L657.7152 42.496a48.4352 48.4352 0 0 0-86.6304 0L436.736 314.4704l-300.032 43.6224a48.2304 48.2304 0 0 0-26.8288 82.6368l217.088 211.5584-50.9952 299.008a48.4352 48.4352 0 0 0 70.144 50.8928l268.3904-141.1072 268.4928 141.1072a48.7424 48.7424 0 0 0 50.8928-3.6864 48.4352 48.4352 0 0 0 19.2512-47.2064l-51.2-299.008 217.088-211.5584a48.7424 48.7424 0 0 0 12.288-49.664z" fill="#F5A623" p-id="7976"></path></svg>
      </div>
      <div v-else>
        <svg t="1586736510735" class="icon" viewBox="0 0 1228 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7975" width="20" height="20"><path d="M1131.2128 391.168a48.4352 48.4352 0 0 0-39.1168-33.0752l-300.032-43.6224L657.7152 42.496a48.4352 48.4352 0 0 0-86.6304 0L436.736 314.4704l-300.032 43.6224a48.2304 48.2304 0 0 0-26.8288 82.6368l217.088 211.5584-50.9952 299.008a48.4352 48.4352 0 0 0 70.144 50.8928l268.3904-141.1072 268.4928 141.1072a48.7424 48.7424 0 0 0 50.8928-3.6864 48.4352 48.4352 0 0 0 19.2512-47.2064l-51.2-299.008 217.088-211.5584a48.7424 48.7424 0 0 0 12.288-49.664z" fill="#F2F2F2" p-id="7976" data-spm-anchor-id="a313x.7781069.0.i34" class=""></path></svg>
      </div>
    </button>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  UPDATE_TODO,
} from '@/store/actions'
import {
  MODIFY_DESC,
  TOGGLE_STARED,
  COMPLETE_TODO,
} from '@/store/mutations'

export default {
  name: 'TodoItem',
  props: {
    // 对 props 的改动会影响到父组件状态，同理，如果将 props对象 浅拷贝给 data， 对 data对象 的改动也会影响父组件状态
    todo: Object, // 对prop进行验证
  },
  created: function() {
    // _.debounce 返回的是一个函数
    // 如果不通过函数指针的方式，直接在 modifyTodo 中调用 debounce，每次调用 debounce 都会生成一个新的实例，导致 debounce 失效
    this.debounceUpdateTodo = _.debounce(this.updateTodo, 2000)
  },
  methods: {
    updateTodo(todo) {
      this.$store.dispatch(UPDATE_TODO, todo)
    },
    modifyDesc(desc) {
      this.$store.commit(MODIFY_DESC, { id: this.todo.id, desc: desc })
      // commit 之后，this.todo 的数据已经被更新
      this.debounceUpdateTodo(this.todo)
    },
    toggleStared() {
      this.$store.commit(TOGGLE_STARED, this.todo.id)
      this.debounceUpdateTodo(this.todo)
    },
    completeTodo() {
      this.$store.commit(COMPLETE_TODO, this.todo.id)
      this.updateTodo(this.todo)
    },
  }
}
</script>

<style lang="less" scoped>
@item-height: 20px;
@item-width: 20px;

button{
  outline: none; /* 去除选中时的边框 */
}
input{
  outline: none;
}
.item {
  display: flex;
  width: 100%;
  height: @item-height;
  margin: 10px 0;
}
.checkbox {
  width: @item-width;
  height: @item-height;
  margin: 0 10px;
  border: 1px solid grey;
  border-radius: 2px;
}
.checkbox-checked {
  background: grey;
}
.desc {
  flex-grow: 1;
  height: @item-height;
  line-height: @item-height;
  font-size: 20px;
  font-weight: 400;
  text-align: left;
  border: none;
  border-bottom: 1px solid grey;
}
.star {
  width: @item-width;
  height: @item-height;
  border: none;
  padding: 0;
}
.star__image {
  width: @item-width;
  height: @item-height;
}
</style>