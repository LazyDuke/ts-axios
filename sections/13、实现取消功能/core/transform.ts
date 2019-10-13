import { AxiosTransformer } from '../types';

/**
 * @description 封装 转换 函数
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {*} data
 * @param {*} headers
 * @param {(AxiosTransformer | AxiosTransformer[])} [fns]
 * @returns {*}
 */
export default function transform(
  data: any,
  headers: any,
  fns?: AxiosTransformer | AxiosTransformer[]
): any {
  if (!fns) return data

  if (!Array.isArray(fns)) {
    fns = [fns]
  }

  // 遍历数组 依次执行转换函数
  fns.forEach(fn => {
    data = fn(data, headers)
  })

  return data
}
