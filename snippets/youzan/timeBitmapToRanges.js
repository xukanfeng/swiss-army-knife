{
  /**
   * 问题 3
   * 将一天24小时按每半小划分成48段，我们用一个位图表示选中的时间区间，例如`110000000000000000000000000000000000000000000000`，
   * 表示第一个半小时和第二个半小时被选中了，其余时间段都没有被选中，也就是对应00:00~01:00这个时间区间。一个位图中可能有多个不连续的
   * 时间区间被选中，例如`110010000000000000000000000000000000000000000000`，表示00:00-1:00和02:00-02:30这两个时间区间被选中了。
   * 
   * 要求：写一个函数timeBitmapToRanges，将上述规则描述的时间位图转换成一个选中时间区间的数组。
   * 示例输入：`"110010000000000000000000000000000000000000000000"`
   * 示例输出：`["00:00~01:00", "02:00~02:30"]`
   */
  function timeBitmapToRanges(str) {
    function formator(n) {
      const h = ('0' + Math.floor(n / 2)).slice(-2)
      const m = n % 2 === 1 ? '30' : '00'
      return h + ':' + m
    }

    const array = str.split('')
    const ans = []
    let start = 0,
      end = -1

    for (let i = 0; i < array.length; i++) {
      if (array[i] === '0' && array[start] === '0') {
        start++
        end++
      } else if (array[i] === '1' && array[start] === '0') {
        start = i
        end = i
      } else if (array[i] === '1' && array[start] === '1') {
        end++
        if (i === array.length - 1) {
          ans.push(formator(start) + '~' + formator(end + 1))
        }
      } else if (array[i] === '0' && array[start] === '1') {
        ans.push(formator(start) + '~' + formator(end + 1))
        start = i
        end = i
      }
    }
    return ans
  }

  console.log(timeBitmapToRanges('110010000000000000000000000000000000000000000000'))
  console.log(timeBitmapToRanges('110011000000110000000000000000000000000000001111'))
}