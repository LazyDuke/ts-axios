import { AxiosRequestConfig } from './types';

/**
 * @description 封装 XMLHttpRequest 对象
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {AxiosRequestConfig} config
 */
export default function xhr(config: AxiosRequestConfig) {
  const { data = null, url, method = 'get', headers } = config

  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url, true)

  // 遍历 传入的 headers，
  // 将 属性 一一设置进 headers
  Object.keys(headers).forEach(name => {
    // 如果 data 为 null headers 的 content-type 属性没有意义
    if (data === null && name.toLowerCase() === 'content-type') {
      delete headers[name]
    } else {
      request.setRequestHeader(name, headers[name])
    }
  })

  request.send(data)
}
