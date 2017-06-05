/**
 * Created by matt on 2017/6/4.
 */
export function formatData (date, fmt) {
  // 正则表达式动态替换中的 yyyy MM dd hh mm ss
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1 ? str : padLeftZero(str)))
    }
  }
  return fmt
}
// 一位补0
function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
