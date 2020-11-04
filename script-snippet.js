this.log = undefined
this.log = (func, params) => {
    console.log("result of [", func.name, "] is: ", func(params))
}

{
    const arr = [1, [2, [3, [4, 5]]], 6]

    const flatten1 = arr => {
        return arr.reduce((prev, cur) => {
            return prev.concat(Array.isArray(cur) ? flatten1(cur) : cur)
        }, [])
    }
    this.log(flatten1, arr)
}

{
    const arr = [1, 1, '1', 17, true, true, false, false, 'true', 'a', {}, {}]
    // console.log(Array.from(new Set(arr)))
    const unique1 = (arr, res = []) => {
        arr.forEach((item, index) => arr.indexOf(item) === index && res.push(item))
        return res
    }
    this.log(unique1, arr)

    const unique2 = (arr, res = []) => {
        arr.forEach(item => !res.includes(item) && res.push(item))
        return res
    }
    this.log(unique2, arr)

    const unique3 = (arr, res = []) => {
        return arr.filter((item, index) => {
            return arr.indexOf(item) === index
        })
    }
    this.log(unique3, arr)
}

{
    // Array.from
    // Array.prototype.slice.call()
    // Array.prototype.concat.call([], )
    // ...
}