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

export function parseHeaders(headers: string): any {
  // 创建一个纯净的空对象
  let parsed = Object.create(null)
  if (!headers) {
    // 如果 headers 未传入，直接返回空对象
    return parsed
  }

  // request.getAllResponseHeaders() 返回的 是以 \r\n 为结尾的 一段字符串，
  // 因此 通过 \r\n 来拆分
  headers.split('\r\n').forEach(line => {
    // 字符串可能存在多个 ":" 的情况
    let [key, ...vals] = line.split(':')
    // 消除空格，并规范为小写
    key = key.trim().toLocaleLowerCase()
    // 如果 key 为 ‘’，
    // 则直接返回
    if (!key) return
    // 将 val 通过 ':' 在连接成字符串并去除两端空格
    const val = vals.join(':').trim()
    // 将 val 赋值给 空对象 parsed 对应的 key 上
    parsed[key] = val
  })
  return parsed
}

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
