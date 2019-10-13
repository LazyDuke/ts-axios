import { deepMerge, isPlainObject } from '../helpers/util';
import { AxiosRequestConfig } from '../types';

/**
 * @description 默认合并策略函数
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function defaultStrat(val1: any, val2: any): any {
  // 如果 val2 有值，采用 val2
  // 否则 采用 val1
  return typeof val2 !== 'undefined' ? val2 : val1
}

/**
 * @description 采用val2值合并策略函数
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function fromVal2Strat(val1: any, val2: any): any {
  // 覆盖策略，只采用 val2 的值
  if (typeof val2 !== 'undefined') return val2
}

/**
 * @description 深度合并策略函数
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function deepMergeStrat(val1: any, val2: any): any {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 !== 'undefined') {
    return val1
  }
}

/**
 * 根据不同的头部，有不同的合并策略
 */
const strats = Object.create(null)
const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

const stratKeysFromDeepMerge = ['headers', 'auth']
stratKeysFromDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

/**
 * @description 合并配置函数
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @param {AxiosRequestConfig} config1
 * @param {AxiosRequestConfig} [config2]
 * @returns {AxiosRequestConfig}
 */
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for (const key in config2) {
    mergeField(key)
  }

  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  return config
}
