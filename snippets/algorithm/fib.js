{
  // dp
  function fib(n) {
    if (n <= 1) return n

    const dp = Array(n).fill(0) // dp table
    dp[0] = 0
    dp[1] = 1
    for (let i = 2; i < n; i++) {
      dp[i] = dp[i - 2] + dp[i - 1]
    }
    return dp[n - 1]
  }
  console.log(fib(6))

  // 优化 dp table 结构（状态压缩）
  function fib1(n) {
    if (n <= 1) return n

    let a = 0
    let b = 1
    for (let i = 2; i < n; i++) {
      [a, b] = [b, a + b]
    }
    return b
  }
  console.log(fib1(6))

  // 尾递归
  function fib2(n) {
    if (n <= 1) return n

    function helper(a, b, n) {
      if (n === 0) return b;
      [a, b] = [b, a + b]
      return helper(a, b, n - 1)
    }
    return helper(0, 1, n - 2)
  }
  console.log(fib2(6))
}