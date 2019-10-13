import { isPlainObject } from './util';

export function transformRequest(data: any): any {
  // 将 data 转为 string
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

// 在不去设置 responseType 的情况下
// 常识将 字符串 转为 object
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (err) {
      // do nothing
    }
  }
  return data
}
