import { transformRequest, transformResponse } from './helpers/data';
import { processHeaders } from './helpers/headers';
import { buildURL } from './helpers/url';
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from './types';
import xhr from './xhr';

/**
 * @description axios 函数
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 */
function axios(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

/**
 * @description 处理 config
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.headers = tranformHeaders(config)
  config.data = tranformRequestData(config)
}

/**
 * @description 转换 URL
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 * @returns {string}
 */
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url, params)
}

/**
 * @description 转换请求data
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 * @returns {*}
 */
function tranformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

/**
 * @description 转换请求headers
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 * @returns {*}
 */
function tranformHeaders(config: AxiosRequestConfig): any {
  const { data, headers = {} } = config
  return processHeaders(headers, data)
}

/**
 * @description 转换响应data
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 * @returns {*}
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}

export default axios
