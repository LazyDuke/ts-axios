import { AxiosRequestConfig } from './types';

/**
 * @description 封装 XMLHttpRequest 对象
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {AxiosRequestConfig} config
 */
export default function xhr(config: AxiosRequestConfig) {
  const { data = null, url, method = 'get' } = config

  const request = new XMLHttpRequest()

  request.open(method.toUpperCase(), url, true)

  request.send(data)
}
