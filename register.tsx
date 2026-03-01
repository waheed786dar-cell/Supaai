// pages/register.tsx
// New user registration page

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/chat')
    })
  }, [router])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }, // Stored in raw_user_meta_data
        emailRedirectTo: `${window.location.origin}/chat`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <span className="text-2xl">✉️</span>
          </div>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
            Confirm your email
          </h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
            Click it to activate your account.
          </p>
          <Link href="/login"
            className="text-sm"
            style={{ color: 'var(--accent)' }}>
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between border-b"
        style={{ borderColor: 'var(--border)' }}>
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L9 5.5H13.5L9.5 8.5L11 13L7 10L3 13L4.5 8.5L0.5 5.5H5L7 1Z"
                fill="white" />
            </svg>
          </div>
          <span className="font-display text-lg font-normal tracking-tight"
            style={{ color: 'var(--text-primary)' }}>
            Lumina
          </span>
        </Link>
        <Link href="/login" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Have an account? <span style={{ color: 'var(--accent)' }}>Sign in</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="font-display text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>
              Start for free
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              20 messages/day on the free plan
            </p>
          </div>

          {/* Free plan badge */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--accent-glow)' }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                <path d="M8 1l1.8 4.1H14l-3.6 2.7 1.4 4.2L8 9.5 4.2 12l1.4-4.2L2 5.1h4.2L8 1z"
                  fill="var(--accent)" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Free Plan included</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>20 messages/day · Upgrade anytime</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs mb-1.5 font-medium uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}>
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Alex Johnson"
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

            {/* Password */}
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
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              {/* Password strength indicator */}
              <div className="flex gap-1 mt-2">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="h-0.5 flex-1 rounded-full transition-all"
                    style={{
                      background: password.length >= (i + 1) * 2
                        ? password.length >= 10 ? '#5a9e7f' : 'var(--accent)'
                        : 'var(--border)'
                    }} />
                ))}
              </div>
            </div>

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
              className="w-full py-3 rounded-lg font-medium text-sm transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
              style={{
                background: 'var(--accent)',
                color: 'white',
                boxShadow: '0 0 20px var(--accent-glow)',
              }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create free account'
              )}
            </button>

            <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              By signing up you agree to our{' '}
              <span className="underline" style={{ color: 'var(--text-secondary)' }}>Terms</span>
              {' '}and{' '}
              <span className="underline" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</span>
            </p>
          </form>

          <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
