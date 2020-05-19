<template>
  <div class="cards">
    <a-card style="margin-top: 10px" v-for="puzzle of puzzles" :key="puzzle.id">
      <div>Q: {{ puzzle.setup }}</div>
      <div>
        <strong>A: {{ puzzle.punchline }}</strong>
      </div>
    </a-card>
    <a-button type="primary" style="margin-top: 10px" @click="addCard">Add Card</a-button>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Card, Button } from 'ant-design-vue'
import {
  FETCH_PUZZLES,
  ADD_PUZZLE,
} from '@/store/actions'

Vue.use(Card)
Vue.use(Button)

export default {
  name: 'PuzzleCards',
  data: () => ({
    counter: 1,
  }),
  mounted() {
    this.$store.dispatch(FETCH_PUZZLES, { currentUser: this.currentUser })
  },
  computed: {
    ...mapGetters(['puzzles', 'currentUser']),
  },
  methods: {
    addCard() {
      const puzzle = {
        setup: 'What\'s the id of this card?',
        punchline: `This is #${this.counter} card`
      }
      this.counter++
      this.$store
        .dispatch(ADD_PUZZLE, { puzzle, currentUser: this.currentUser })
        .then(() => this.$store.dispatch(FETCH_PUZZLES, { currentUser: this.currentUser }))
    }
  },
}
</script>