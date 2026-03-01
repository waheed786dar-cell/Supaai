// pages/api/chat.ts
// ⚠️ SERVER-SIDE ONLY - This is where your AI API key lives
// Never put API keys in frontend code

import type { NextApiRequest, NextApiResponse } from 'next'

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = {
  role: 'user' | 'assistant'
  content: string
}

type RequestBody = {
  messages: Message[]
  userId: string
}

type ResponseBody = {
  content?: string
  error?: string
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages, userId } = req.body as RequestBody

  // Basic validation
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages' })
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // ─────────────────────────────────────────────────────────────────────────
    // Option A: OpenAI
    // ─────────────────────────────────────────────────────────────────────────
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // 🔑 API key is safe here - server-side only, never sent to browser
    //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4o-mini',
    //     messages: [
    //       { role: 'system', content: 'You are a helpful assistant.' },
    //       ...messages,
    //     ],
    //     max_tokens: 1000,
    //   }),
    // })
    // const data = await response.json()
    // const content = data.choices[0].message.content
    // return res.status(200).json({ content })

    // ─────────────────────────────────────────────────────────────────────────
    // Option B: Anthropic Claude
    // ─────────────────────────────────────────────────────────────────────────
    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': process.env.ANTHROPIC_API_KEY!,
    //     'anthropic-version': '2023-06-01',
    //   },
    //   body: JSON.stringify({
    //     model: 'claude-3-haiku-20240307',
    //     max_tokens: 1024,
    //     system: 'You are a helpful AI assistant.',
    //     messages,
    //   }),
    // })
    // const data = await response.json()
    // const content = data.content[0].text
    // return res.status(200).json({ content })

    // ─────────────────────────────────────────────────────────────────────────
    // DEMO: Stub response (remove when you connect a real AI API)
    // ─────────────────────────────────────────────────────────────────────────
    const lastMessage = messages[messages.length - 1]?.content || ''

    // Simulate a small delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600))

    const demoReplies = [
      `I received your message: "${lastMessage.slice(0, 50)}${lastMessage.length > 50 ? '...' : ''}".\n\nThis is a demo response. Connect your AI API key in pages/api/chat.ts to enable real responses.`,
      `Great question! This is a placeholder response while the AI backend is being configured. Once you add your OpenAI or Anthropic API key to the server-side API route, I'll respond intelligently.`,
      `Thanks for trying Lumina! To activate real AI responses, add your API key to \`.env.local\` and uncomment the relevant section in \`pages/api/chat.ts\`.`,
    ]

    const content = demoReplies[Math.floor(Math.random() * demoReplies.length)]
    return res.status(200).json({ content })

  } catch (error) {
    console.error('AI API error:', error)
    return res.status(500).json({ error: 'AI service unavailable' })
  }
}
