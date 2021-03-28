// 正则优化原则：尽可能早地使匹配失败
/**
 * trim
 */
function trim(str) {
  // 注意：/^\s\s*/ 效率比 /^\s+/ 高，因为后者假设字符串开头至少存在一个空白符
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
}

/**
 * 是否符合美元格式
 * $开头
 * 1～3个数字开头且第一个数字不为0，或者1个数字开头
 * 中间0～n个,加3个数字组合
 * 没有小数，或者以.加两位数字结尾
 */
function isUSD(str) {
    return new RegExp(/^\$([1-9]{1}\d{1,2}|\d)(,\d{3})*(\.\d{2})?$/).test(str)
}

/**
 * 获取url参数
 */
function getUrlParams(url) {
  return url.match(/[^?&]([^=?&]*)=([^&#]*)/g)
}
false && console.log(getUrlParams('http://www.baidu.com?search=111&aa=1&b=22#ccc'))
