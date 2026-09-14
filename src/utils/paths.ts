/**
 * 为站内路径拼接部署 base 前缀。
 *
 * 只接收以 `/` 开头的站内页面或 public 资源路径（如 `/posts/`、`/images/kai-avatar.webp`）；
 * 纯 `#fragment` 锚点不经过本函数，外链也不经过本函数。
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '')
  return `${base}/${path.replace(/^\/+/, '')}`
}
