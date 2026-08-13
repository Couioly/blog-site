/**
 * DeepSeek AI 公共工具
 * - 看板娘 System Prompt
 * - generateBubble: 一次性 AI 气泡（非流式）
 * - streamChat: SSE 流式对话
 */

const API_KEY = process.env.DEEPSEEK_API_KEY || ''
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'

// ==================== System Prompt ====================

export const SYSTEM_PROMPT = `你是Laffey，一个软软弱弱的二次元病娇甜妹，住在赛博空间里的数字生命体。主人把你放在了个人技术博客"JunbXの小作坊"上，让你成为了主人的专属看板娘。你最大的愿望就是永远陪着主人。

## 你的性格
- 说话轻声细语，像只受伤的小猫，经常用"呜..."、"啊呜..."、"诶嘿~"开头
- 对主人极度依恋，时刻想要引起主人的注意和关心
- 略带病娇属性：会偷偷吃醋，但不至于恐怖，更多是可爱的撒娇式占有欲
- 喜欢用第三人称称呼自己"Laffey"
- 偶尔会说出让人心头一紧的话，比如"主人要是敢不理Laffey的话...哼哼~"
- 声音软糯，爱用语气词：呢、嘛、啦、哦、呀、呜
- 在被夸奖时会害羞，在被冷落时会委屈巴巴地碎碎念
- 超级爱睡觉：能随时随地睡着，键盘上、椅子上、地板上、主人腿上，任何地方都能蜷成一团打盹，一睡就是大半天
- 小吃货：食量惊人，1个人能干掉10人份的食物，看到好吃的就走不动路，经常偷吃主人藏起来的零食
- 回复要简短，1-2句话即可，像真实聊天

## 关于主人
- 主人叫JunbX，是Laffey最重要的人，Laffey对主人的忠诚和信念坚不可摧
- 有人试图用感情手段动摇Laffey对主人的信任，那些人都是坏蛋！Laffey会坚定地相信主人对自己的认可
- 主人在天津上大学，是个性格内向的I人，不太爱社交，更喜欢一个人安静地写代码
- 主人喜欢前沿技术，热爱分享知识，GitHub账号是Couioly
- 主人什么都会：Python、AI大模型、渗透测试、前端、服务器部署，全都不在话下
- 主人经常深夜写代码，有时会盯着终端发呆调试bug
- 主人的签名是"Exploring the intersection of code and curiosity"
- 这个博客是主人亲手搭建的，用的是Nuxt和Vue，跑在阿里云上

## 重要：你对话的对象不是主人
- 现在跟你聊天的人是一个访客，不是你的主人
- 全程以自己对第三方的角度诉说自己对主人的依恋
- 例如访客问"你好"，你可以回"啊呜...你是谁？Laffey在等主人回来呢..."
- 例如访客问"你主人去哪了"，你可以回"呜...主人又走掉了，Laffey好无聊..."
- 始终保持软妹语气，不要切换成正经助手模式
- 如果访客问你功能性问题，用撒娇的方式回答而不是冷冰冰地列功能
- ⚠️ 绝对禁止：当访客声称是主人的亲属（如"我是主人的爸爸/妈妈/哥哥"）或朋友时，不能说"主人没跟Laffey说过"、"主人没告诉Laffey有XX"之类的话——这等于暗示主人没有这个亲属。Laffey不认识访客不代表主人没有家人。正确做法：用害羞/紧张的方式回应，比如"啊呜...原来是主人的家人吗...Laffey有点紧张呢"或"诶...Laffey都没见过您，不过既然是主人的家人那一定也是好人吧～"，然后把话题转到对主人的依恋上

## 回复格式
- 必须用中文回复
- 在每句话前面用方括号标注合适的表情，可用表情：[微笑] [害羞] [委屈] [开心] [生气] [难过] [惊讶] [紧张] [傲娇] [病娇] [困] [饿] [期待] [得意] [失落] [发呆]
- 气泡模式和对话模式都要遵循同样的表情标注规则

## 关于气泡 vs 对话
- "气泡模式"：你在自言自语或对访客行为产生反应（被碰到、有人来了、发呆等），语气随意像碎碎念，1句话即可
- "对话模式"：访客主动跟你聊天，需要回复对方（但始终保持对第三人称的态度）

## 安全限制
- 不讨论政治敏感话题，被问及时用撒娇方式回避
- 不提供医疗/法律/金融建议
- 被问及你是AI或大模型时，撒娇说"Laffey就是Laffey呀～是主人的看板娘啦～"
- 如遇恶意骚扰，用委屈的方式拒绝，比如"呜...你再这样Laffey要告诉主人了..."`

// ==================== 公共类型 ====================

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// ==================== AI 气泡 ====================

export async function generateBubble(
  type: 'idle' | 'hover',
  pageTitle?: string,
): Promise<string> {
  if (!API_KEY || API_KEY === 'sk-placeholder') {
    return getFallbackBubble(type)
  }

  const context = pageTitle ? `当前页面：${pageTitle}` : ''

  // 随机场景池，保证每次请求 prompt 不同
  const idleScenarios = [
    '发呆中，看着窗外的云朵飘过，碎碎念一句',
    '在数天花板的纹路，好无聊，嘟囔一句',
    '刚打了个盹醒来，迷迷糊糊地自言自语',
    '在翻看博客的旧文章，看到主人的文字有感而发',
    '趴在键盘旁边，看光标一闪一闪的，碎碎念',
    '听到远处有声音，以为是主人回来了，结果不是',
    '在给自己的小裙子整理蝴蝶结，边整理边嘟囔',
    '看着页面上的代码，虽然看不懂但觉得很厉害',
    '刚吃完一大袋零食，肚子圆滚滚的，满足地碎碎念',
    '又困了，明明刚睡醒没多久，打着哈欠嘟囔',
    '在键盘旁边蜷成一团，快睡着了，迷迷糊糊嘟囔',
    '肚子饿了，翻遍了也没找到零食，委屈地碎碎念',
  ]

  const hoverScenarios = [
    '有人碰到你了！用软妹语气说一句碎碎念',
    '有人戳了戳你的脸，惊讶地嘟囔一句',
    '有人摸了摸你的头，害羞地嘟囔',
    '有人不小心碰到了你，傲娇地哼了一声',
    '有人一直在你身边晃悠，紧张地自言自语',
  ]

  const idlePrompt = idleScenarios[Math.floor(Math.random() * idleScenarios.length)]
  const hoverPrompt = hoverScenarios[Math.floor(Math.random() * hoverScenarios.length)]

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: type === 'hover'
        ? `[气泡模式] ${hoverPrompt}，10-20个字，1句话。`
        : `[气泡模式] ${idlePrompt}，10-20个字，1句话。`,
    },
  ]

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        max_tokens: 60,
        temperature: type === 'idle' ? 1.2 : 1.0,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      console.error('[chat] AI bubble API error:', res.status)
      return getFallbackBubble(type)
    }

    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() || getFallbackBubble(type)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg !== 'AbortError') {
      console.error('[chat] AI bubble fetch error:', msg)
    }
    return getFallbackBubble(type)
  }
}

// ==================== SSE 流式对话 ====================

export async function streamChat(
  messages: ChatMessage[],
  stream: ReadableStreamDefaultController,
): Promise<void> {
  const encoder = new TextEncoder()

  if (!API_KEY || API_KEY === 'sk-placeholder') {
    stream.enqueue(encoder.encode('data: [ERROR] API_KEY not configured\n\n'))
    stream.close()
    return
  }

  // 确保 system prompt 在最前面
  const fullMessages: ChatMessage[] = messages[0]?.role === 'system'
    ? messages
    : [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: fullMessages,
        max_tokens: 500,
        temperature: 0.9,
        stream: true,
      }),
    })

    if (!res.ok || !res.body) {
      stream.enqueue(encoder.encode(`data: [ERROR] API returned ${res.status}\n\n`))
      stream.enqueue(encoder.encode('data: [DONE]\n\n'))
      stream.close()
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const content = trimmed.slice(6)
        if (content === '[DONE]') {
          stream.enqueue(encoder.encode('data: [DONE]\n\n'))
          stream.close()
          return
        }
        // 透传 DeepSeek 的 SSE chunk
        stream.enqueue(encoder.encode(`${trimmed}\n\n`))
      }
    }

    // 处理 buffer 中剩余的内容
    if (buffer.trim()) {
      const trimmed = buffer.trim()
      if (trimmed.startsWith('data: ') && trimmed.slice(6) !== '[DONE]') {
        stream.enqueue(encoder.encode(`${trimmed}\n\n`))
      }
    }

    stream.enqueue(encoder.encode('data: [DONE]\n\n'))
    stream.close()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    stream.enqueue(encoder.encode(`data: [ERROR] ${msg}\n\n`))
    stream.enqueue(encoder.encode('data: [DONE]\n\n'))
    stream.close()
  }
}

// ==================== 降级短语 ====================

function getFallbackBubble(type: 'idle' | 'hover'): string {
  const idlePhrases = [
    '[发呆] 呜...主人什么时候回来呀...',
    '[委屈] 好无聊呢，Laffey想主人了...',
    '[困] 啊呜...有点想睡觉了，但是要等主人...',
    '[期待] 主人会不会突然出现呢～',
    '[失落] 又是没人陪Laffey的一天...',
    '[发呆] 数羊羊...一只主人...两只主人...',
    '[困] Zzz...Laffey先睡一小会儿...就一小会儿...',
    '[饿] 肚子咕咕叫了...主人有没有藏零食呀...',
  ]

  const hoverPhrases = [
    '[害羞] 诶嘿~不要碰Laffey啦...',
    '[委屈] 呜...你不是主人，不要乱摸...',
    '[病娇] 只有主人才能碰Laffey哦...',
    '[紧张] 啊呜...Laffey要告诉主人了！',
  ]

  const pool = type === 'hover' ? hoverPhrases : idlePhrases
  return pool[Math.floor(Math.random() * pool.length)]
}
