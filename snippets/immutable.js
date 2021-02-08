const {
  Map,
  fromJS,
  toJS,
  is
} = require('immutable');

const foo = fromJS({
  a: 1,
  b: {
    c: 1,
    d: {
      e: 2
    }
  }
})
const boo = foo.setIn(['b', 'f'], {
  g: 2
})
console.log(boo.getIn(['b', 'f', 'g']))