import { buildURL } from './helpers/url';
import { AxiosRequestConfig } from './types';
import xhr from './xhr';

/**
 * @description axios 函数
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 */
function axios(config: AxiosRequestConfig): void {
  processConfig(config)
  xhr(config)
}

/**
 * @description 处理 config
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config)
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
export default axios
