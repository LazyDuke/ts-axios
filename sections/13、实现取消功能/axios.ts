import Cancel, { isCancel } from './cancel/Cancel';
import CancelToken from './cancel/CancelToken';
import Axios from './core/Axios';
import mergeConfig from './core/mergeConfig';
import defaults from './defaults';
import { extend } from './helpers/util';
import { AxiosRequestConfig, AxiosStatic } from './types';

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  // 根据 config 创建 Axios 的实例
  const context = new Axios(config)
  // 将 Axios 原型方法 request 绑定 context 的 this
  const instance = Axios.prototype.request.bind(context)
  // 注意：要编译的target为es5，class 的 方法才可以通过 for...in 去遍历
  extend(instance, context)

  return instance as AxiosStatic
}

const axios = createInstance(defaults)

// 扩展 create 方法
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

// Cancel相关
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

export default axios
