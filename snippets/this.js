const a1 = {
  b1: {
    c1: 'c1',
    c2() {
      const d1 = {
        e1: function () {
          console.log('e1:', this)
        },
        e2: () => {
          console.log('e2:', this)
        }
      }
      const d2 = function () {
        console.log('d2:', this)
      }
      const d3 = () => {
        console.log('d3:', this)
      }

      console.log('c2:', this)
      d1.e1()
      d1.e2()
      d2()
      d3()
    },
    c3: () => {
      const d1 = {
        e1: function () {
          console.log('e1:', this)
        },
        e2: () => {
          console.log('e2:', this)
        }
      }
      const d2 = function () {
        console.log('d2:', this)
      }
      const d3 = () => {
        console.log('d3:', this)
      }

      console.log('c3:', this) // window: 可以理解为对象内是没有this的，对象内的箭头函数this指向window。function内的箭头函数this指向和function的this相同。这是由于箭头函数还不能够直接作为对象的方法使用造成的。
      d1.e1()
      d1.e2() // window
      d2()
      d3()
    }
  },
  b2: function () {
    const d1 = {
      e1: function () {
        console.log('e1:', this)
      },
      e2: () => {
        console.log('e2:', this)
      }
    }
    const d2 = function () {
      console.log('d2:', this)
    }
    const d3 = () => {
      console.log('d3:', this)
    }

    console.log('b2:', this)
    d1.e1()
    d1.e2()
    d2()
    d3()
  },
  b3: () => {
    const d1 = {
      e1: function () {
        console.log('e1:', this)
      },
      e2: () => {
        console.log('e2:', this)
      }
    }
    const d2 = function () {
      console.log('d2:', this)
    }
    const d3 = () => {
      console.log('d3:', this)
    }

    console.log('b3:', this)
    d1.e1()
    d1.e2()
    d2()
    d3()
  }
}

console.log('a1.b1.c2:')
a1.b1.c2()
console.log('a1.b1.c3:')
a1.b1.c3()
console.log('a1.b2:')
a1.b2()
console.log('a1.b3:')
a1.b3()