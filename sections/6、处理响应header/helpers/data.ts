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
