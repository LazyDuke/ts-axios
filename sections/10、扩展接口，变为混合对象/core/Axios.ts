import { AxiosPromise, AxiosRequestConfig, Method } from '../types';
import dispatchRequest from './dispatchRequest';

/**
 * @description Axios类
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @class Axios
 */
export default class Axios {
  request(url: any, config?: any): AxiosPromise {
    // 函数重载实现
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      config = url
    }
    return dispatchRequest(config)
  }

  get(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWhithoutData('get', url, config)
  }

  delete(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWhithoutData('delete', url, config)
  }

  head(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWhithoutData('head', url, config)
  }

  options(url: string, config: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWhithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWhithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWhithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWhithData('patch', url, data, config)
  }

  /**
   * @description 无 data 的请求类型方法
   * @author Lazy Duke
   * @date 2019-10-13
   * @param {Method} method
   * @param {string} url
   * @param {AxiosRequestConfig} [config]
   * @returns
   */
  _requestMethodWhithoutData(method: Method, url: string, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  /**
   * @description 有 data 的请求类型方法
   * @author Lazy Duke
   * @date 2019-10-13
   * @param {Method} method
   * @param {string} url
   * @param {*} [data]
   * @param {AxiosRequestConfig} [config]
   * @returns
   */
  _requestMethodWhithData(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
