import { createError } from './helpers/error';
import { parseHeaders } from './helpers/headers';
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types';

/**
 * @description 封装 XMLHttpRequest 对象
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {AxiosRequestConfig} config
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType
    }

    if (timeout) {
      request.timeout = timeout
    }

    request.open(method.toUpperCase(), url, true)

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      // 网络错误 网络超时
      if (request.status === 0) {
        return
      }

      // 将headers转换为object类型
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      // 根据传入的 responseType 来决定返回的数据
      const responseData = responseType === 'text' ? request.responseText : request.response

      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }

      handleResponse(response)
    }

    // 处理网络错误
    request.onerror = function handleErrorr() {
      reject(createError('Network Error', config, null, request))
    }
    // 处理超时错误
    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

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

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
