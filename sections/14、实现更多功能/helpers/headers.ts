import { Method } from '../types';
import { deepMerge, isPlainObject } from './util';

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

/**
 * @description 将 JSON字符串headers 转换为 object 类型
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {string} headers
 * @returns {*}
 */
export function parseHeaders(headers: string): any {
  let parsed = Object.create(null)
  if (!headers) {
    return parsed
  }

  headers.split('\r\n').forEach(line => {
    let [key, val] = line.split(':')
    key = key.trim().toLowerCase()
    if (!key) {
      return
    }
    if (val) {
      val = val.trim()
    }
    parsed[key] = val
  })

  return parsed
}

/**
 * @description 压平格式化headers
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {*} headers
 * @param {Method} method
 * @returns {*}
 */
export function flattenHeaders(headers: any, method: Method): any {
  // 如果 header 为空，直接返回结果
  if (!headers) return headers

  // 调用 deepMerge，将common和method进行和并，拷贝到 headers 这一级
  headers = deepMerge(headers.common, headers[method], headers)

  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common']

  // 删除method和common属性
  methodsToDelete.forEach(method => {
    delete headers[method]
  })

  return headers
}
