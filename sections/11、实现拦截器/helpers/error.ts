import { AxiosRequestConfig, AxiosResponse } from '../types';

/**
 * @description 增强错误信息类
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @class AxiosError
 * @extends {Error}
 */
export class AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse

  constructor(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
  ) {
    super(message)

    this.config = config
    this.code = code
    this.request = request
    this.response = response
    this.isAxiosError = true

    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, AxiosError.prototype)
  }
}

/**
 * @description 创建error的工厂函数
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {string} message
 * @param {AxiosRequestConfig} config
 * @param {(string | null)} [code]
 * @param {*} [request]
 * @param {AxiosResponse} [response]
 * @returns
 */
export function createError(
  message: string,
  config: AxiosRequestConfig,
  code?: string | null,
  request?: any,
  response?: AxiosResponse
) {
  const error = new AxiosError(message, config, code, request, response)
  return error
}
