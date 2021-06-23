
export function time (date) {
  const dt = new Date(date)// 实例化时间对象
  const y = dt.getFullYear()
  const m = dt.getMonth() + 1
  const d = dt.getDate()
  const hh = dt.getHours()
  const mm = dt.getMinutes()
  const ss = dt.getSeconds()
  // 笨方法  return y + '-' + m + '-' + d
  // 官方方法  注意引号，是tab键上面的符号（ES6的语法）
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}
