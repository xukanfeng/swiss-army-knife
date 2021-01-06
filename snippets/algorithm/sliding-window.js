{
  function MinimumWindowSubstring_76(s, t) {
    let start = 0
    let length = Infinity
    let left = 0
    let right = 0
    let valid = 0
    const window = new Map()
    const need = new Map()
    for (let c of t) need.set(c, need.get(c) ? need.get(c) + 1 : 1)

    while (right < s.length) {
      const c = s[right]
      right++
      if (need.has(c)) {
        window.set(c, window.get(c) ? window.get(c) + 1 : 1)
        if (window.get(c) === need.get(c))
          valid++
      }

      while (valid === need.size) {
        if (right - left < length) {
          start = left
          length = right - left
        }
        const c = s[left]
        left++
        if (need.has(c)) {
          if (window.get(c) === need.get(c))
            valid--
          window.set(c, window.get(c) - 1)
        }
      }
    }
    return s.slice(start, start + length)
  }
  // console.log(MinimumWindowSubstring_76("adobecodebanc", "abc"))

  function PermutationInString_567(s1, s2) {
    let left = 0
    let right = 0
    let valid = 0
    let window = new Map()
    let need = new Map()
    for (let c of s1) need.set(c, need.get(c) ? need.get(c) + 1 : 1)

    while (right < s2.length) {
      const c = s2[right]
      right++
      if (need.has(c)) {
        window.set(c, window.get(c) ? window.get(c) + 1 : 1)
        if (window.get(c) === need.get(c))
          valid++
      }
      while (right - left >= s1.length) {
        if (valid === need.size) return true

        const c = s2[left]
        left++
        if (need.has(c)) {
          if (window.get(c) === need.get(c))
            valid--
          window.set(c, window.get(c) - 1)
        }
      }
    }
    return false
  }
  // console.log(PermutationInString_567("abb", "eidbabooo"))

  function FindAllAnagramsInString_438(s, p) {
    const ans = []
    let left = 0
    let right = 0
    let valid = 0
    let window = new Map()
    let need = new Map()
    for (let c of p) need.set(c, need.get(c) ? need.get(c) + 1 : 1)

    while (right < s.length) {
      const c = s[right]
      right++
      if (need.has(c)) {
        window.set(c, window.get(c) ? window.get(c) + 1 : 1)
        if (window.get(c) === need.get(c))
          valid++
      }
      while (right - left >= p.length) {
        if (valid === need.size) ans.push(left)
        const c = s[left]
        left++
        if (need.has(c)) {
          if (window.get(c) === need.get(c))
            valid--
          window.set(c, window.get(c) - 1)
        }
      }
    }
    return ans
  }
  // console.log(FindAllAnagramsInString("cbaebabacd", "abc"))
}