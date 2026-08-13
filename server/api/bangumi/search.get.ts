/**
 * Bangumi 番剧搜索 API（方案B：后端代理）
 *
 * GET /api/bangumi/search?keyword=xxx&type=2
 *
 * 通过 Nuxt 服务端代理搜索请求，解决前端跨域问题。
 * type 参数: 1=书籍, 2=动画, 3=音乐, 4=游戏, 6=三次元
 */

const BANGUMI_API = 'https://api.bgm.tv'
const UA = 'JunbX-Blog/1.0 (https://junbx.cn)'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const keyword = (query.keyword as string) || ''
  const type = parseInt((query.type as string) || '2')

  if (!keyword.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少 keyword 参数，示例: /api/bangumi/search?keyword=命运石之门&type=2',
    })
  }

  // 限制搜索关键词长度
  if (keyword.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: '搜索关键词过长',
    })
  }

  try {
    // 调用 Bangumi v0 搜索接口
    // 文档: https://bangumi.github.io/api/#/subject/search
    const data = await $fetch<any>(`${BANGUMI_API}/v0/search/subjects`, {
      headers: { 'User-Agent': UA },
      params: {
        keyword: keyword.trim(),
        type,
        limit: 20,
      },
    })

    // data.data 是搜索结果数组
    const items = (data.data || []).map((item: any) => ({
      id: item.id,
      name: item.name || '',
      name_cn: item.name_cn || item.name || '',
      images: {
        large: item.images?.large || '',
        common: item.images?.common || '',
        medium: item.images?.medium || '',
        small: item.images?.small || '',
        grid: item.images?.grid || '',
      },
      type: item.type || type,
      url: item.url || `https://bgm.tv/subject/${item.id}`,
    }))

    return {
      keyword: keyword.trim(),
      total: data.total || items.length,
      items,
    }
  } catch (err: any) {
    console.error('[Bangumi] 搜索失败:', err.message)
    throw createError({
      statusCode: 502,
      statusMessage: `Bangumi API 请求失败: ${err.message}`,
    })
  }
})
