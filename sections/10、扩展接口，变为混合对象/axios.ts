import Axios from './core/Axios';
import { extend } from './helpers/util';
import { AxiosInstance } from './types';

function createInstance(): AxiosInstance {
  // 根据 config 创建 Axios 的实例
  const context = new Axios()
  // 将 Axios 原型方法 request 绑定 context 的 this
  const instance = Axios.prototype.request.bind(context)
  // 注意：要编译的target为es5，class 的 方法才可以通过 for...in 去遍历
  extend(instance, context)

  return instance as AxiosInstance
}

const axios = createInstance()

export default axios
