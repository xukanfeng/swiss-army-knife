/**
 * 从数组 nums 中找出和为 sum 的 n 个数
 */
// 二进制数中 1 的个数
function countOnes(i) {
  let count = 0
  while (i) {
    if (i & 1) {
      count++
    }
    i >>= 1
  }
  return count
}

function search(nums, n, sum) {
  const res = []
  let len = nums.length
  // 遍历长度为 len 的所有二进制数据
  for (let i = 0; i < Math.pow(2, len); i++) {
    // 找到 1 的个数为 n 的二进制数
    if (countOnes(i) === n) {
      let s = 0,
        temp = []
      // 遍历二进制数每一位，检查当前位有没有选中，即对应的数组元素有没有选中
      for (let j = 0; j < len; j++) {
        if (i & (1 << (len - 1 - j))) {
          s += nums[j]
          temp.push(nums[j])
        }
      }
      if (s === sum) {
        res.push(temp)
      }
    }
  }
  return res
}

console.log(search([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, 15))

function twoSum(nums, sum, start) {
  const res = []
  let map = new Map()
  for (let i = start; i < nums.length; i++) {
    if (map.has(sum - nums[i])) res.push([nums[i], sum - nums[i]])
    else map.set(nums[i], i)
  }
  return res
};

function nSum(nums, n, sum, start = 0) {
  let res = []
  let len = nums.length
  // 至少是 twoSum，且数组大小不应该小于 n
  if (n < 2 || len < n) return res
  if (n === 2) {
    return twoSum(nums, sum, start)
  } else {
    // n > 2 时，递归计算 (n-1)Sum 的结果
    for (let i = start; i < len; i++) {
      const subRes = nSum(nums, n - 1, sum - nums[i], i + 1)
      for (let item of subRes) {
        // (n-1)Sum 加上 nums[i] 就是 nSum
        res.push(item.concat(nums[i]))
      }
      // 跳过相同的数字（要先对数组排序）
      // while (i < len - 1 && nums[i] === nums[i + 1]) i++
    }
  }
  return res
}

console.log(nSum([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, 15))