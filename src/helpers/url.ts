import { isDate, isPlainObject, isURLSearchParams } from './util';

interface URLOrigin {
  protocol: string
  host: string
}
// 对于字符 @、:、$、,、、[、]，我们是允许出现在 url 中的，不希望被 encode。
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+') // 约定将 空格 号转为 +
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(
  url: string,
  params?: any,
  paramsSerializer?: (params: any) => string
): string {
  if (!params) {
    // 如果 参数 params 未被传入，则直接返回 url
    return url
  }

  let serializedParams

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if (isURLSearchParams(params)) {
    serializedParams = params.toString()
  } else {
    const parts: string[] = []
    // 遍历 params 的属性的 key
    Object.keys(params).forEach(key => {
      // 通过的 key 获取属性的 value
      const val = params[key]
      if (val === null || typeof val === 'undefined') {
        // 如果 value 等于 null 或者 undefined，
        // 则这个属性不作处理，跳过以忽略
        return
      }
      let values = []
      if (Array.isArray(val)) {
        // 如果 value 是数组，则将 value 赋给 values
        // 并将 key 值 拼接上 '[]'
        values = val
        key += '[]'
      } else {
        // 如果 value 不是数组，则将 value 包一层数组 赋给 values
        values = [val]
      }
      // 上一步将 所有的 values 都同步成了数组类型，
      // 所以此处遍历上一步的结果 对 Date 和 PlainObject 类型处理后，
      // 将 key 和 value 拼接成 字符串, 推入 数组 parts
      values.forEach(val => {
        if (isDate(val)) {
          val = val.toISOString()
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    })
    // 创建 序列化参数遍历 serializedParams，
    // 并将 数组parts 以 '&' 来拼接成字符串赋给 它
    serializedParams = parts.join('&')
  }

  if (serializedParams) {
    // 如果 序列化参数遍历 serializedParams 为 truthy 值
    // 查找 url 里 '#' 的下标
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      // 如果 下标存在，舍弃 # 以及 # 后面的字符串
      url = url.slice(0, markIndex)
    }
    // 判断 url 是否以及含有 '?' （即是否以及含有url参数），
    // 进行正确的拼接
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}

// 判断是否是绝对路径
export function isAbsoluteURL(url: string): boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}
// 将 baseUrl 和 relativeURL 拼接起来
export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
// 判断是否同源
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  )
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  // 通过创建一个 <a> 标签并设置 href 属性可以快捷的拿到 protocol 和 host
  urlParsingNode.setAttribute('href', url)
  const { protocol, host } = urlParsingNode

  return {
    protocol,
    host
  }
}
