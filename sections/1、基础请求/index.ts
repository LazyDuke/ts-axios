import { AxiosRequestConfig } from './types';
import xhr from './xhr';

/**
 * @description axios 函数
 * @author Lazy Duke
 * @date 2019-10-13
 * @param {AxiosRequestConfig} config
 */
function axios(config: AxiosRequestConfig): void {
  xhr(config)
}
export default axios
