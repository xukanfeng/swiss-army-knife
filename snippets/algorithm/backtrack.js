{
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
}