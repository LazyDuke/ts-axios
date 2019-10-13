const toString = Object.prototype.toString

/**
 * @description 判断是否是 Date 类型
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {*} val
 * @returns {val is Date}
 */
export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

/**
 * @description 判断是否是 Object 类型
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {*} val
 * @returns {val is Object}
 */
export function isObject(val: any): val is Object {
  return val !== null && typeof val === 'object'
}
