/**
 * 不用加减乘除运算符，求整数的 7 倍
 * 
 * 实现 10 进制整数转 N 进制通用函数
 */
const multi1 = (num, N = 7) => ''.padEnd(num).repeat(N).length
const multi2 = (num, N) => [].concat(...([...new Array(num)]).map(_ => [...new Array(N)])).length
const multi3 = (num, N) => ([...new Array(num)]).map(_ => [...new Array(N)]).flat().length
const multi4 = (num, N) => parseInt((num).toString(N) + '0', N)
