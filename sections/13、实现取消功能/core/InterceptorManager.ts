import { RejectedFn, ResolvedFn } from '../types';

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

/**
 * @description 拦截器（请求、响应）管理类
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @class InterceptorManager
 * @template T
 */
export default class InterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  /**
   * @description 添加拦截器的方法
   * @author Lazy Duke
   * @date 2019-10-13
   * @param {ResolvedFn<T>} resolved
   * @param {RejectedFn} rejected
   * @returns {number}
   */
  use(resolved: ResolvedFn<T>, rejected: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    })
    return this.interceptors.length - 1
  }

  /**
   * @description 遍历拦截器
   * @author Lazy Duke
   * @date 2019-10-13
   * @param {(interceptor: Interceptor<T>) => void} fn
   */
  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor)
      }
    })
  }

  /**
   * @description 删除拦截器的方法
   * @author Lazy Duke
   * @date 2019-10-13
   * @param {number} id
   */
  eject(id: number) {
    if (this.interceptors[id]) {
      this.interceptors[id] = null
    }
  }
}
