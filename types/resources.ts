export interface ResourceLink {
  name: string        // 显示名称，如 "live2d模型"
  repo: string        // GitHub 仓库全名，如 "imuncle/live2d"
  url: string         // 完整 GitHub URL
  description: string // 中文简介
}

export interface NavDropdownItem {
  to: string
  label: string
}

// ===== Bangumi 番剧相关类型 =====

/** Bangumi 条目完整信息（subject API 返回） */
export interface BangumiSubject {
  id: number
  name: string           // 中文名
  name_cn: string        // 中文名
  name_jp: string        // 日文名（原名）
  summary: string        // 简介
  images: {
    large: string        // 封面大图
    common: string
    medium: string
    small: string
    grid: string
  }
  rating: {
    score: number        // 评分
    total: number        // 评分人数
  }
  type: number           // 2=动画, 1=书籍/轻小说
  typeName: string       // 类型中文名，如"动画""书籍"
  url: string            // bgm.tv 条目链接
}

/** Bangumi 搜索结果项 */
export interface BangumiSearchItem {
  id: number
  name: string
  name_cn: string
  images: {
    large: string
    common: string
    medium: string
    small: string
    grid: string
  }
  type: number
  url: string
}

/** 静态 JSON 文件结构（方案A 使用） */
export interface BangumiShelfData {
  updatedAt: string      // 数据抓取时间
  subjects: BangumiSubject[]
}
