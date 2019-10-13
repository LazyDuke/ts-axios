import cookie from '../helpers/cookie';
import { createError } from '../helpers/error';
import { parseHeaders } from '../helpers/headers';
import { isURLSameOrigin } from '../helpers/url';
import { isFormData } from '../helpers/util';
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types';

/**
 * @description 封装 XMLHttpRequest 对象
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {AxiosRequestConfig} config
 */
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'get',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredential,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    configureRequest()
    addEvents()
    processHeaders()
    processCancel()

    request.send(data)

    /**
     * @description 配置 xhr 对象
     * @author Lazy Duke
     * @date 2019-10-13
     */
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      if (withCredential) {
        request.withCredentials = withCredential
      }
    }

    /**
     * @description 监听 xhr 相关事件
     * @author Lazy Duke
     * @date 2019-10-13
     */
    function addEvents(): void {
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

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress
      }

      if (onUploadProgress) {
        request.upload.onprogress = onUploadProgress
      }
    }

    /**
     * @description 处理 headers
     * @author Lazy Duke
     * @date 2019-10-13
     */
    function processHeaders(): void {
      /**
       * 如果请求是个 FormData 类型，则删除 headers['Content-Type']
       * 让浏览器自动为请求带上合适的 Content-Type
       */
      if (isFormData(data)) {
        delete headers['Content-Type']
      }
      /**
       * 跨站请求伪造 xsrf 防御
       * 当请求开启了 withCredentials 或者是同源请求时
       * 如果存在 xsrfCookieName 则为请求 headers 带上它的值
       */
      if ((withCredential || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)

        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        headers['Authorization'] = 'Basic' + btoa(auth.username + auth.password)
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
    }

    /**
     * @description 处理 取消请求 相关
     * @author Lazy Duke
     * @date 2019-10-13
     */
    function processCancel(): void {
      // 取消请求
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    /**
     * @description 根据 response.status 来处理 response
     * @author Lazy Duke
     * @date 2019-10-13
     * @param {AxiosResponse} response
     */
    function handleResponse(response: AxiosResponse): void {
      if (!validStatus || validStatus(response.status)) {
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
