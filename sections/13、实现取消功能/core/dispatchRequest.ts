import { flattenHeaders } from '../helpers/headers';
import { buildURL } from '../helpers/url';
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types';
import transform from './transform';
import xhr from './xhr';

/**
 * @description dispatchRequest 函数
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 */
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
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
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
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
 * @description 转换响应data
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 * @returns {*}
 */
function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

/**
 * @description 检测 cancelToken 是否被使用过
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 */
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
