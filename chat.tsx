// pages/chat.tsx
// Main chat interface - ChatGPT-style, mobile-first
// Handles message sending, conversation history, free tier limits

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { useRequireAuth } from '../hooks/useAuth'

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

type Conversation = {
  id: string
  title: string
  lastMessage?: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const FREE_DAILY_LIMIT = 20

// ─── Helper: generate UUID ────────────────────────────────────────────────────
function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)
}

// ─── Sidebar Component ────────────────────────────────────────────────────────
function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onClose,
  profile,
  messagesUsed,
  onSignOut,
}: {
  conversations: Conversation[]
  activeId: string | null
  onSelect: (id: string) => void
  onNew: () => void
  onClose: () => void
  profile: any
  messagesUsed: number
  onSignOut: () => void
}) {
  const isPro = profile?.plan === 'pro'
  const usagePercent = Math.min((messagesUsed / FREE_DAILY_LIMIT) * 100, 100)

  return (
    <aside className="flex flex-col h-full"
      style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}>

      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b"
        style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center"
            style={{ background: 'var(--accent)' }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L9 5.5H13.5L9.5 8.5L11 13L7 10L3 13L4.5 8.5L0.5 5.5H5L7 1Z" fill="white" />
            </svg>
          </div>
          <span className="font-display text-base" style={{ color: 'var(--text-primary)' }}>Lumina</span>
        </div>
        {/* Close button - mobile only */}
        <button onClick={onClose} className="md:hidden p-1 rounded-lg"
          style={{ color: 'var(--text-muted)' }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* New Chat button */}
      <div className="px-3 pt-3 pb-2">
        <button onClick={onNew}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all group"
          style={{ border: '1px dashed var(--border-light)', color: 'var(--text-secondary)' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-light)'
            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
          }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New conversation
        </button>
      </div>

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
        <p className="px-2 py-1 text-xs font-medium uppercase tracking-wider mb-1"
          style={{ color: 'var(--text-muted)' }}>
          Recent
        </p>
        {conversations.length === 0 ? (
          <p className="px-2 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            No conversations yet
          </p>
        ) : (
          conversations.map(conv => (
            <button key={conv.id} onClick={() => onSelect(conv.id)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm truncate transition-all"
              style={{
                background: activeId === conv.id ? 'var(--bg-surface)' : 'transparent',
                color: activeId === conv.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: activeId === conv.id ? '1px solid var(--border)' : '1px solid transparent',
              }}>
              <span className="block truncate">{conv.title}</span>
              {conv.lastMessage && (
                <span className="block text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {conv.lastMessage}
                </span>
              )}
            </button>
          ))
        )}
      </div>

      {/* Usage meter (free plan only) */}
      {!isPro && (
        <div className="px-3 pb-3">
          <Link href="/upgrade">
            <div className="p-3 rounded-xl transition-all cursor-pointer"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Daily usage
                </span>
                <span className="text-xs" style={{ color: messagesUsed >= FREE_DAILY_LIMIT ? '#f87171' : 'var(--text-muted)' }}>
                  {messagesUsed}/{FREE_DAILY_LIMIT}
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden mb-2"
                style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: `${usagePercent}%`,
                    background: usagePercent >= 100 ? '#f87171' : usagePercent >= 75 ? 'var(--accent)' : 'var(--sage-400, #7fb99a)',
                  }} />
              </div>
              <p className="text-xs" style={{ color: 'var(--accent)' }}>
                ✦ Upgrade for unlimited →
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* User info & sign out */}
      <div className="px-3 pb-3 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
            style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
            {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>
              {profile?.full_name || profile?.email}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {isPro ? '✦ Pro plan' : 'Free plan'}
            </p>
          </div>
          <button onClick={onSignOut}
            className="p-1.5 rounded-lg transition-colors flex-shrink-0"
            style={{ color: 'var(--text-muted)' }}
            title="Sign out">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 message-appear">
      {/* AI avatar */}
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
        style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M7 1L9 5.5H13.5L9.5 8.5L11 13L7 10L3 13L4.5 8.5L0.5 5.5H5L7 1Z"
            fill="var(--accent)" />
        </svg>
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
        style={{ background: 'var(--ai-bubble)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-1.5">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  )
}

// ─── Message Component ────────────────────────────────────────────────────────
function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-start gap-3 message-appear ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${isUser ? 'text-xs font-medium' : ''}`}
        style={{
          background: isUser ? 'var(--accent-glow)' : 'var(--accent-glow)',
          border: `1px solid ${isUser ? 'var(--accent-light)' : 'var(--accent)'}`,
          color: 'var(--accent)',
        }}>
        {isUser ? (
          <span>U</span>
        ) : (
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L9 5.5H13.5L9.5 8.5L11 13L7 10L3 13L4.5 8.5L0.5 5.5H5L7 1Z"
              fill="var(--accent)" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div
        className="max-w-[75%] md:max-w-[65%] px-4 py-3 rounded-2xl text-sm leading-relaxed"
        style={{
          background: isUser ? 'var(--user-bubble)' : 'var(--ai-bubble)',
          border: '1px solid var(--border)',
          borderTopRightRadius: isUser ? '4px' : '16px',
          borderTopLeftRadius: isUser ? '16px' : '4px',
          color: 'var(--text-primary)',
        }}>
        <div className="message-content whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  )
}

// ─── Main Chat Page ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const { user, profile, loading, signOut } = useRequireAuth()
  const router = useRouter()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [messagesUsed, setMessagesUsed] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [limitReached, setLimitReached] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isPro = profile?.plan === 'pro'

  // ── Scroll to bottom when messages change ───────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // ── Fetch today's usage ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return

    const today = new Date().toISOString().split('T')[0]

    supabase
      .from('daily_usage')
      .select('message_count')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()
      .then(({ data }) => {
        if (data) {
          setMessagesUsed(data.message_count)
          if (!isPro && data.message_count >= FREE_DAILY_LIMIT) setLimitReached(true)
        }
      })
  }, [user, isPro])

  // ── Fetch conversation list ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return

    // Get distinct conversation IDs with first user message
    supabase
      .from('messages')
      .select('conversation_id, content, created_at')
      .eq('user_id', user.id)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (!data) return
        const seen = new Set<string>()
        const convs: Conversation[] = []

        data.forEach(msg => {
          if (!seen.has(msg.conversation_id)) {
            seen.add(msg.conversation_id)
            convs.push({
              id: msg.conversation_id,
              title: msg.content.slice(0, 40) + (msg.content.length > 40 ? '...' : ''),
            })
          }
        })
        setConversations(convs)
      })
  }, [user])

  // ── Load messages for a conversation ───────────────────────────────────────
  const loadConversation = useCallback(async (convId: string) => {
    if (!user) return
    setActiveConvId(convId)
    setSidebarOpen(false)

    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id)
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true })

    if (data) setMessages(data as Message[])
  }, [user])

  // ── New conversation ────────────────────────────────────────────────────────
  const startNewConversation = useCallback(() => {
    setActiveConvId(uuid())
    setMessages([])
    setSidebarOpen(false)
    textareaRef.current?.focus()
  }, [])

  // ── Initialize first conversation on load ──────────────────────────────────
  useEffect(() => {
    if (user && !activeConvId) {
      setActiveConvId(uuid())
    }
  }, [user, activeConvId])

  // ── Auto-resize textarea ────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    if (!input.trim() || !user || !activeConvId || isTyping) return

    // Check free limit
    if (!isPro && messagesUsed >= FREE_DAILY_LIMIT) {
      setLimitReached(true)
      return
    }

    const userMessage: Message = {
      id: uuid(),
      role: 'user',
      content: input.trim(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    setIsTyping(true)

    try {
      // Save user message to Supabase
      await supabase.from('messages').insert({
        user_id: user.id,
        role: 'user',
        content: userMessage.content,
        conversation_id: activeConvId,
      })

      // Increment daily usage (atomic DB function)
      const { data: newCount } = await supabase
        .rpc('increment_daily_usage', { p_user_id: user.id })

      if (newCount !== null) {
        setMessagesUsed(newCount)
        if (!isPro && newCount >= FREE_DAILY_LIMIT) setLimitReached(true)
      }

      // ───────────────────────────────────────────────────────────────────────
      // Call YOUR AI backend (Next.js API route /api/chat)
      // This route holds your AI API key - never in frontend!
      // See pages/api/chat.ts for the implementation stub.
      // ───────────────────────────────────────────────────────────────────────
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: userMessage.content },
          ],
          userId: user.id,
        }),
      })

      if (!response.ok) throw new Error('AI API failed')

      const aiData = await response.json()
      const aiContent = aiData.content || aiData.choices?.[0]?.message?.content || '...'

      const aiMessage: Message = {
        id: uuid(),
        role: 'assistant',
        content: aiContent,
      }

      // Save AI message to Supabase
      await supabase.from('messages').insert({
        user_id: user.id,
        role: 'assistant',
        content: aiContent,
        conversation_id: activeConvId,
      })

      setMessages(prev => [...prev, aiMessage])

      // Update sidebar conversation list
      setConversations(prev => {
        const exists = prev.find(c => c.id === activeConvId)
        if (!exists) {
          return [
            { id: activeConvId, title: userMessage.content.slice(0, 40) },
            ...prev,
          ]
        }
        return prev
      })

    } catch (err) {
      console.error('Send failed:', err)
      setMessages(prev => [...prev, {
        id: uuid(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      }])
    } finally {
      setIsTyping(false)
    }
  }, [input, user, activeConvId, isTyping, isPro, messagesUsed, messages])

  // ── Handle Enter to send (Shift+Enter for newline) ─────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-primary)' }}>
        <div className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Sidebar overlay (mobile) ─────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-30 w-72 flex flex-col transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar
          conversations={conversations}
          activeId={activeConvId}
          onSelect={loadConversation}
          onNew={startNewConversation}
          onClose={() => setSidebarOpen(false)}
          profile={profile}
          messagesUsed={messagesUsed}
          onSignOut={signOut}
        />
      </div>

      {/* ── Main chat area ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar (mobile) */}
        <header className="flex items-center gap-3 px-4 py-3 border-b md:hidden"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
          <button onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg -ml-1"
            style={{ color: 'var(--text-secondary)' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <span className="font-display text-base" style={{ color: 'var(--text-primary)' }}>Lumina</span>
          <div className="ml-auto">
            {!isPro && (
              <Link href="/upgrade"
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                Upgrade
              </Link>
            )}
          </div>
        </header>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

            {/* Empty state */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: 'var(--accent-glow)',
                    border: '1px solid var(--accent)',
                    boxShadow: '0 0 40px var(--accent-glow)',
                  }}>
                  <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1L9 5.5H13.5L9.5 8.5L11 13L7 10L3 13L4.5 8.5L0.5 5.5H5L7 1Z"
                      fill="var(--accent)" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
                  How can I help?
                </h2>
                <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                  Ask me anything — I can write, analyze, code, brainstorm, and much more.
                </p>
                {/* Suggestion chips */}
                <div className="flex flex-wrap gap-2 justify-center mt-6">
                  {[
                    'Explain quantum computing',
                    'Write a short poem',
                    'Debug my code',
                    'Summarize a topic',
                  ].map(suggestion => (
                    <button key={suggestion}
                      onClick={() => { setInput(suggestion); textareaRef.current?.focus() }}
                      className="px-3 py-1.5 rounded-full text-sm transition-all"
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {isTyping && <TypingIndicator />}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input area ─────────────────────────────────────────────────────── */}
        <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>

          {/* Limit reached banner */}
          {limitReached && !isPro && (
            <div className="max-w-2xl mx-auto mb-3 px-4 py-3 rounded-xl flex items-center gap-3"
              style={{ background: 'rgba(232,133,26,0.1)', border: '1px solid var(--accent)' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--accent)" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
                Daily limit reached ({FREE_DAILY_LIMIT} messages).{' '}
                <Link href="/upgrade" className="font-medium" style={{ color: 'var(--accent)' }}>
                  Upgrade to Pro
                </Link>
                {' '}for unlimited.
              </p>
            </div>
          )}

          {/* Input box */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 px-4 py-3 rounded-2xl"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-light)' }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={limitReached && !isPro ? 'Upgrade to continue chatting...' : 'Message Lumina...'}
                disabled={limitReached && !isPro}
                rows={1}
                className="flex-1 bg-transparent outline-none text-sm resize-none leading-relaxed"
                style={{
                  color: 'var(--text-primary)',
                  maxHeight: '160px',
                  minHeight: '24px',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping || (limitReached && !isPro)}
                className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-40"
                style={{
                  background: input.trim() && !isTyping ? 'var(--accent)' : 'var(--border)',
                }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
