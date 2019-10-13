/**
 * @description 带有message的取消对象
 * @author Lazy Duke
 * @date 2019-10-13
 * @export
 * @class Cancel
 */
export default class Cancel {
  message?: string

  constructor(message?: string) {
    this.message = message
  }
}

export function isCancel(value: any): boolean {
  return value instanceof Cancel
}
