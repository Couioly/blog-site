/**
 * AI 气泡 API — 一次性请求（无上下文）
 * POST /api/chat/ai-bubble
 * Body: { type: 'idle' | 'hover', pageTitle?: string }
 * Response: { text: string }
 */
import { generateBubble } from '~~/server/utils/chat'

export default defineEventHandler(async (event) => {
  // Referer 校验：仅允许来自 junbx.cn 的请求
  const referer = getHeader(event, 'referer') || ''
  if (!referer.includes('junbx.cn') && !referer.includes('localhost')) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody(event).catch(() => null)

  const type = body?.type

  if (type !== 'idle' && type !== 'hover') {
    throw createError({
      statusCode: 400,
      message: 'type must be "idle" or "hover"',
    })
  }

  const pageTitle = typeof body?.pageTitle === 'string' ? body.pageTitle : undefined

  const text = await generateBubble(type, pageTitle)

  return { text }
})
