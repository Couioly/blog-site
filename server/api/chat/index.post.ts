/**
 * 对话 API — SSE 流式代理
 * POST /api/chat
 * Body: { messages: [{ role: 'system' | 'user' | 'assistant', content: string }...] }
 * Response: SSE stream (text/event-stream)
 *
 * 客户端负责管理上下文（10轮上限），服务端仅转发 + 注入 system prompt
 */
import { streamChat, type ChatMessage } from '~~/server/utils/chat'

export default defineEventHandler(async (event) => {
  // Referer 校验：仅允许来自 junbx.cn 的请求
  const referer = getHeader(event, 'referer') || ''
  if (!referer.includes('junbx.cn') && !referer.includes('localhost')) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const body = await readBody(event).catch(() => null)

  if (!body || !Array.isArray(body.messages)) {
    throw createError({
      statusCode: 400,
      message: 'Request body must contain a "messages" array',
    })
  }

  const messages = body.messages as ChatMessage[]

  // 基本校验
  for (const m of messages) {
    if (!m.role || !m.content) {
      throw createError({
        statusCode: 400,
        message: 'Each message must have "role" and "content"',
      })
    }
    if (!['system', 'user', 'assistant'].includes(m.role)) {
      throw createError({
        statusCode: 400,
        message: `Invalid role: ${m.role}`,
      })
    }
  }

  // 设置 SSE 响应头
  setHeader(event, 'Content-Type', 'text/event-stream; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no')

  const stream = new ReadableStream({
    async start(controller) {
      await streamChat(messages, controller)
    },
  })

  return sendStream(event, stream)
})
