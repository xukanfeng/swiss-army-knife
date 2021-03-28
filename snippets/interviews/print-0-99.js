/**
 * 修改 print 函数，使之输出 0 到 99，或者 99 到 0
 */
function print(n) {
  setTimeout(
  /* 待修改
  () => {
    console.log(n)
  },
  */
  /* 方案一：自执行函数 
  */
  (() => {
    console.log(n)
    return () => {}
  })(),
  /* 方案二
  () => {
    setTimeout(() => {
      console.log(n)
    }, 1000 * n)
  },
  */
  Math.floor(Math.random() * 1000))
}
for (var i = 0; i < 100; i++) {
  print(i)
}