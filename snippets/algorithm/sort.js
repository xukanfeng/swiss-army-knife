{
  function quickSort(nums) {
    function _sort(nums, start, end) {
      if (start >= end) return

      const pivot = _partition(nums, start, end)
      _sort(nums, start, pivot - 1)
      _sort(nums, pivot + 1, end)
    }

    function _partition(nums, start, end) {
      let pivotVal = nums[start]
      let i = start,
        j = end

      while (i < j) {
        while (i < j && nums[j] >= pivotVal) {
          j--
        }
        nums[i] = nums[j]
        while (i < j && nums[i] <= pivotVal) {
          i++
        }
        nums[j] = nums[i]
      }
      nums[i] = pivotVal

      return i
    }

    _sort(nums, 0, nums.length - 1)
  }

  function mergeSort(nums) {
    function _sort(nums, start, end) {
      if (start >= end) return

      let mid = Math.floor((start + end) / 2)
      _sort(nums, start, mid)
      _sort(nums, mid + 1, end)
      _merge(nums, start, mid, end)
    }

    function _merge(nums, start, mid, end) {
      let i = start,
        j = mid

      while (i < mid && j < end) {
        let k = 0
        while (i < mid && nums[i] <= nums[j]) {
          i++
        }
        while (j < end && nums[i] >= nums[j]) {
          j++
          k++
        }
        let part = nums.splice(j - k, k)
        nums.splice(i, 0, ...part)

        i += k
        mid += k
      }
    }

    _sort(nums, 0, nums.length - 1)
  }

  const nums = [6, 3, 5, 4, 7, 9, 5, 2, 5, 8]
  quickSort(nums)
  console.log(nums)

  mergeSort(nums)
  console.log(nums)
}