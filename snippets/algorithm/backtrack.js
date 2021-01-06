{
  function generateParenthesis(n) {
    const ans = []

    function backtrack(left, right, track) {
      if (left === n && right === n) {
        ans.push([...track])
        return
      }
      if (left > n || right > n || left < right) return

      track.push("(")
      backtrack(left + 1, right, track)
      track.pop()

      track.push(")")
      backtrack(left, right + 1, track)
      track.pop()
    }
    backtrack(0, 0, [])

    return ans
  }
  // console.log("generateParenthesis", generateParenthesis(3))

  function subset(arr) {
    const ans = []

    function backtrack(arr, track, start) {
      ans.push([...track])

      for (let i = start; i < arr.length; i++) {
        track.push(arr[i])
        backtrack(arr, track, i + 1)
        track.pop()
      }
    }
    backtrack(arr, [], 0)

    return ans
  }
  // console.log("subset", subset([1,2,3]))

  function combination(arr, k) {
    const ans = []

    function backtrack(arr, track, start) {
      if (track.length === k) {
        ans.push([...track])
        return
      }
      for (let i = start; i < arr.length; i++) {
        track.push(arr[i])
        backtrack(arr, track, i + 1)
        track.pop()
      }
    }
    backtrack(arr, [], 0)

    return ans
  }
  // console.log("combination", combination([1,2,3,4], 2))

  function permutation(arr) {
    const ans = []

    function backtrack(arr, track) {
      if (track.length === arr.length) {
        ans.push([...track])
        return
      }
      for (let i = 0; i < arr.length; i++) {
        if (track.indexOf(arr[i]) !== -1) continue

        track.push(arr[i])
        backtrack(arr, track)
        track.pop()
      }
    }
    backtrack(arr, [])

    return ans
  }
  // console.log("permutation", permutation([1,2,3]))
}