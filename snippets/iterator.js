{
  const obj = {
    "a": 1,
    "b": 2,
    "c": 3
  }

  function* objectEntries_v1(obj) {
    const keys = Reflect.ownKeys(obj)
    for (let key of keys) {
      yield [key, obj[key]]
    }
  }
  console.log("#1")
  for (let [key, value] of objectEntries_v1(obj)) {
    console.log(key, value)
  }

  function* objectEntries_v2() {
    const keys = Object.keys(this)
    for (let key of keys) {
      yield [key, obj[key]]
    }
  }
  obj[Symbol.iterator] = objectEntries_v2
  console.log("#2")
  for (let [key, value] of obj) {
    console.log(key, value)
  }

  const arrLike = {
    0: 1,
    1: 2,
    2: 3,
    length: 3
  }
  arrLike[Symbol.iterator] = Array.prototype[Symbol.iterator]
  console.log("#3")
  for (let item of arrLike) {
    console.log(item)
  }
}