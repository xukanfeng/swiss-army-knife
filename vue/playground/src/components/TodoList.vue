<template>
  <div>
    <!--v-on监听器在DOM模版中会自动转换为全小写，应该始终使用kebab-case事件名-->
    <TodoItem v-for="todo of todos" :key="todo.id" :todo="todo" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TodoItem from '@/components/TodoItem.vue'
import {
  FETCH_TODOLIST,
} from '@/store/actions'

export default {
  name: 'TodoList',
  components: {
    TodoItem,
  },
  mounted() {
    this.$store.dispatch(FETCH_TODOLIST)
  },
  computed: {
    ...mapState({
      todos: state => {
        return state.todolist.todolist // state模块化时注意state所在模块
      }
    }) 
  },
  methods: {

  }
}
</script>

<style scoped>

</style>