import { isPlainObject } from './util';

/**
 * @description 因为请求 header 属性是大小写不敏感的，
 *             所以我们先要把一些 header 属性名规范化
 * @author Lazy Duke
 * @date 2019-10-07
 * @param {*} headers 头部
 * @param {string} normalizeName 要规范的key
 */
function normalizeHeaderName(headers: any, normalizeName: string): void {
  // 如果 headers 为 falsy 值，不做处理
  if (!headers) return
  Object.keys(headers).forEach(name => {
    // 遍历 header 的 key
    if (name !== normalizeName && name.toLocaleUpperCase() === normalizeName.toLocaleUpperCase()) {
      // 如果 name 不规范
      // 将 name 对应的 value 赋给 headers 里 规范后 key
      headers[normalizeName] = headers[name]
      // 删除 不规范的属性
      delete headers[name]
    }
  })
}

/**
 * @description 处理 headers
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {*} headers
 * @param {*} data
 * @returns {*}
 */
export function processHeaders(headers: any, data: any): any {
  // 规范 headers 里的 'Content-Type'
  normalizeHeaderName(headers, 'Content-Type')

  if (isPlainObject(data)) {
    // 如果 data 是 PlainObject 类型
    if (headers && !headers['Content-Type']) {
      // 如果 headers 为 truthy 且 headers 里的 Content-Type 属性为 falsy
      headers['Content-Type'] = 'application/json;charset=utf-8'
    }
  }

  return headers
}
