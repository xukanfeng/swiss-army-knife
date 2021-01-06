{
  const nums = [1, 2, 3, 4, 4, 4, 4, 5, 6, 7, 8, 9]
  console.log(nums)
  console.log([...nums.keys()])

  function binarySearch(nums, target) {
    let left = 0
    let right = nums.length - 1

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2)
      if (nums[mid] < target) {
        left = mid + 1
      } else if (nums[mid] > target) {
        right = mid - 1
      } else if (nums[mid] === target) {
        return mid
      }
    }
    return -1
  }
  console.log(binarySearch(nums, 4))

  function leftBound(nums, target) {
    let left = 0
    let right = nums.length - 1

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2)
      if (nums[mid] < target) {
        left = mid + 1
      } else if (nums[mid] > target) {
        right = mid - 1
      } else if (nums[mid] === target) {
        right = mid - 1
      }
    }
    if (left >= nums.length || nums[left] !== target)
      return -1
    return left
  }
  console.log(leftBound(nums, 4))

  function rightBound(nums, target) {
    let left = 0
    let right = nums.length - 1

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2)
      if (nums[mid] < target) {
        left = mid + 1
      } else if (nums[mid] > target) {
        right = mid - 1
      } else if (nums[mid] === target) {
        left = mid + 1
      }
    }
    if (right < 0 || nums[right] !== target)
      return -1
    return right
  }
  console.log(rightBound(nums, 4))
}