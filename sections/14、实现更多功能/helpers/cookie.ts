const cookie = {
  // 根据 name 获取响应的 cookie 值
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
