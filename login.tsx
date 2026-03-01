// pages/login.tsx
// Login page with email/password and magic link options

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [magicSent, setMagicSent] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/chat')
    })
  }, [router])

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/chat')
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/chat` }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setMagicSent(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L9 5.5H13.5L9.5 8.5L11 13L7 10L3 13L4.5 8.5L0.5 5.5H5L7 1Z"
                fill="white" />
            </svg>
          </div>
          <span className="font-display text-lg font-normal tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Lumina
          </span>
        </Link>
        <Link href="/register"
          className="text-sm transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          No account? <span style={{ color: 'var(--accent)' }}>Sign up</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          {/* Title */}
          <div className="mb-10">
            <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Continue your conversations
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex rounded-lg p-0.5 mb-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            {(['password', 'magic'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setMagicSent(false) }}
                className="flex-1 py-2 text-sm rounded-md transition-all font-medium"
                style={{
                  background: mode === m ? 'var(--bg-surface)' : 'transparent',
                  color: mode === m ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                }}>
                {m === 'password' ? 'Password' : 'Magic link'}
              </button>
            ))}
          </div>

          {/* Magic link success */}
          {magicSent ? (
            <div className="rounded-xl p-6 text-center"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <div className="text-3xl mb-3">✉️</div>
              <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Check your inbox</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                We sent a magic link to <strong>{email}</strong>
              </p>
              <button onClick={() => setMagicSent(false)}
                className="mt-4 text-sm underline"
                style={{ color: 'var(--text-muted)' }}>
                Resend
              </button>
            </div>
          ) : (
            <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink}
              className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-xs mb-1.5 font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Password (only in password mode) */}
              {mode === 'password' && (
                <div>
                  <label className="block text-xs mb-1.5 font-medium uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="px-4 py-3 rounded-lg text-sm"
                  style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#f87171', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-medium text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  boxShadow: '0 0 20px var(--accent-glow)',
                }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {mode === 'password' ? 'Signing in...' : 'Sending link...'}
                  </span>
                ) : (
                  mode === 'password' ? 'Sign in' : 'Send magic link'
                )}
              </button>

              {mode === 'password' && (
                <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  <button type="button" onClick={() => setMode('magic')}
                    className="underline underline-offset-2 transition-colors"
                    style={{ color: 'var(--text-secondary)' }}>
                    Forgot password?
                  </button>
                </p>
              )}
            </form>
          )}

          {/* Register link */}
          <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
            New to Lumina?{' '}
            <Link href="/register"
              className="transition-colors"
              style={{ color: 'var(--accent)' }}>
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
