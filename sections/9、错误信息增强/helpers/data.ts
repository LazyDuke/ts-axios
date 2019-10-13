import { isPlainObject } from './util';

/**
 * @description 转换 data 为 JSON字符串
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {*} data
 * @returns {*}
 */
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

/**
 * @description 转换 data 为 object 类型
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {*} data
 * @returns {*}
 */
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // do nothing
    }

    return data
  }
}
