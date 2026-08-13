/**
 * Bangumi 条目查询 API（方案B：后端代理）
 *
 * GET /api/bangumi/subject?ids=1,2,3
 *
 * 通过 Nuxt 服务端代理请求 Bangumi API，解决前端跨域问题。
 * 返回指定 subject_id 的番剧/书籍详细信息。
 */

const BANGUMI_API = 'https://api.bgm.tv'
const UA = 'JunbX-Blog/1.0 (https://junbx.cn)'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const idsParam = query.ids as string

  if (!idsParam) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少 ids 参数，示例: /api/bangumi/subject?ids=1,2,3',
    })
  }

  // 解析逗号分隔的 subject ID 列表
  const ids = idsParam
    .split(',')
    .map((s) => parseInt(s.trim()))
    .filter((n) => !isNaN(n))

  if (ids.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ids 参数格式错误，请使用逗号分隔的数字',
    })
  }

  // 限制单次请求数量
  if (ids.length > 50) {
    throw createError({
      statusCode: 400,
      statusMessage: '单次最多查询 50 个条目',
    })
  }

  // 并发请求所有 subject 信息
  const results = await Promise.all(
    ids.map(async (id) => {
      try {
        const data = await $fetch<any>(`${BANGUMI_API}/v0/subjects/${id}`, {
          headers: { 'User-Agent': UA },
        })

        return {
          id: data.id,
          name: data.name || '',
          name_cn: data.name_cn || data.name || '',
          name_jp: data.name || '',
          summary: data.summary || '',
          images: {
            large: data.images?.large || '',
            common: data.images?.common || '',
            medium: data.images?.medium || '',
            small: data.images?.small || '',
            grid: data.images?.grid || '',
          },
          rating: {
            score: data.rating?.score || 0,
            total: data.rating?.total || 0,
          },
          type: data.type || 0,
          typeName: getTypeName(data.type),
          url: `https://bgm.tv/subject/${data.id}`,
        }
      } catch (err: any) {
        console.error(`[Bangumi] 获取 subject/${id} 失败:`, err.message)
        return null // 单个条目失败不影响其他请求
      }
    })
  )

  // 过滤掉请求失败的条目
  const subjects = results.filter(Boolean)

  return { subjects }
})

/** 将 Bangumi type 数字转为中文名称 */
function getTypeName(type: number): string {
  switch (type) {
    case 1:
      return '书籍'
    case 2:
      return '动画'
    case 3:
      return '音乐'
    case 4:
      return '游戏'
    case 6:
      return '三次元'
    default:
      return '其他'
  }
}
