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
  false && console.log(nums)

  mergeSort(nums)
  false && console.log(nums)
}

function bubbleSort(arr) {
  const len = arr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) { // 相邻元素两两对比
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}

function selectionSort(arr) {
  const len = arr.length
  let minIndex
  for (let i = 0; i < len - 1; i++) {
    minIndex = i
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIndex]) { // 寻找最小的数
        minIndex = j
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
  }
  return arr;
}

function insertionSort(arr) {
  const len = arr.length
  let preIndex, current
  for (let i = 1; i < len; i++) {
    preIndex = i - 1
    current = arr[i]
    while (preIndex >= 0 && arr[preIndex] > current) {
      arr[preIndex + 1] = arr[preIndex]
      preIndex--
    }
    arr[preIndex + 1] = current
  }
  return arr
}

const nums = [6, 3, 5, 4, 7, 9, 5, 2, 5, 8]
console.log(bubbleSort(nums))
console.log(selectionSort(nums))
console.log(insertionSort(nums))