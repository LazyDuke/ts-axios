import { flattenHeaders } from '../helpers/headers';
import { buildURL, combineURL, isAbsoluteURL } from '../helpers/url';
import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types';
import { transform } from './transform';
import xhr from './xhr';

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  precessConfig(config)
  return xhr(config).then(res => {
    return transformResponseData(res)
  })
}

// 处理 config
function precessConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
  config.data = transform(config.data, config.headers, config.transformRequest)

  // 这里 config.method 类型断言，可以保证运行时有值
  config.headers = flattenHeaders(config.headers, config.method!)
}
// 转换 URL
export function transformURL(config: AxiosRequestConfig): string {
  const { params, paramsSerializer, baseURL } = config
  let { url } = config
  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }
  // 这里可以保证运行时 url 是有值的
  return buildURL(url!, params, paramsSerializer)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

// 请求判断此请求是否已经被取消了，如果被取消了，再发送此请求是没有意义的
function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
