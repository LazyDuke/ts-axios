const toString = Object.prototype.toString

// 判断是否是 Date 类型
export function isDate(val: any): val is Date {
  return Object.prototype.toString.call(val) === '[object Date]'
}
// 判断是否是 Object 类型
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}
// 判断是否是 PlainObjec 类型
export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}
// 判断是否是 FormData 类型
export function isFormData(val: any): val is FormData {
  return typeof val !== undefined && val instanceof FormData
}
// 将 from 的属性 扩展到 to 去
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}

export function deepMerge(...objs: any[]): any {
  // 创建一个 纯净的 结果空对象 result
  const result = Object.create(null)
  // 遍历要合并的对象数组
  objs.forEach(obj => {
    // 如果对象存在
    if (obj) {
      // 遍历 对象 的 key
      Object.keys(obj).forEach(key => {
        // 获取对应的 key 的属性值
        const val = obj[key]
        // 如果 该值是个 对象
        if (isPlainObject(val)) {
          // 且如果 结果空对象 对应的 key 的属性上有值
          if (isPlainObject(result[key])) {
            // 将 两个值 继续 合并，并把结果赋给 结果空对象 对应的 key
            result[key] = deepMerge(result[key], val)
          } else {
            // 如果 结果空对象 对应的 key 的属性上无值，
            // 拷贝自己到纯净的结果空对象，并将 拷贝后的结果空对象 赋给 结果空对象 对应的 key
            result[key] = deepMerge(val)
          }
        } else {
          // 且如果 该值不是个 对象
          // 直接将 该值 赋给 结果空对象 对应的 key
          result[key] = val
        }
      })
    }
  })

  return result
}

// 判断是否是 URLSearchParams 类型
export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== undefined && val instanceof URLSearchParams
}
