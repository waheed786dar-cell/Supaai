// pages/upgrade.tsx
// Upgrade/pricing page - UI only, no real payment
// Shows Free vs Pro comparison with a clear CTA

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRequireAuth } from '../hooks/useAuth'

// ─── Feature List ─────────────────────────────────────────────────────────────
const FREE_FEATURES = [
  '20 messages per day',
  'Access to standard AI model',
  'Chat history (7 days)',
  'Mobile & web access',
]

const PRO_FEATURES = [
  'Unlimited messages',
  'Access to advanced AI model',
  'Full chat history forever',
  'Priority response speed',
  'File & image uploads (coming soon)',
  'Custom system prompts',
  'API access (coming soon)',
  'Priority support',
]

// ─── Checkmark Icon ────────────────────────────────────────────────────────────
function Check({ pro }: { pro?: boolean }) {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
      stroke={pro ? 'var(--accent)' : 'var(--sage-400, #7fb99a)'} strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  )
}

// ─── X Icon ───────────────────────────────────────────────────────────────────
function X() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"
      stroke="var(--text-muted)" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// ─── Testimonial ──────────────────────────────────────────────────────────────
function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="p-5 rounded-2xl"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
      <p className="text-sm leading-relaxed mb-4 font-display italic"
        style={{ color: 'var(--text-secondary)' }}>
        "{quote}"
      </p>
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
          {name[0]}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{name}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{role}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UpgradePage() {
  const { profile, loading } = useRequireAuth()
  const router = useRouter()
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const [upgradeClicked, setUpgradeClicked] = useState(false)

  const isPro = profile?.plan === 'pro'

  const monthlyPrice = billing === 'monthly' ? 12 : 8
  const annualTotal = 8 * 12

  const handleUpgrade = () => {
    // TODO: Integrate Stripe / LemonSqueezy / etc.
    // For now, show a coming soon message
    setUpgradeClicked(true)
  }

  if (loading) return null

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="px-6 py-5 flex items-center justify-between border-b"
        style={{ borderColor: 'var(--border)' }}>
        <Link href="/chat" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: 'var(--accent)', boxShadow: '0 0 20px var(--accent-glow)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L9 5.5H13.5L9.5 8.5L11 13L7 10L3 13L4.5 8.5L0.5 5.5H5L7 1Z" fill="white" />
            </svg>
          </div>
          <span className="font-display text-lg font-normal tracking-tight"
            style={{ color: 'var(--text-primary)' }}>
            Lumina
          </span>
        </Link>
        <Link href="/chat"
          className="text-sm flex items-center gap-1.5 transition-colors"
          style={{ color: 'var(--text-secondary)' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to chat
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-16">

        {/* ── Title ──────────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          {isPro ? (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L9 5.5H13.5L9.5 8.5L11 13L7 10L3 13L4.5 8.5L0.5 5.5H5L7 1Z"
                    fill="var(--accent)" />
                </svg>
                <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                  Pro Active
                </span>
              </div>
              <h1 className="font-display text-4xl mb-3" style={{ color: 'var(--text-primary)' }}>
                You're on Pro
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Enjoy unlimited conversations and all premium features.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
                <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                  ✦ Limited time · Save 33% annually
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl mb-3" style={{ color: 'var(--text-primary)' }}>
                Unlock the full experience
              </h1>
              <p className="text-lg max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Think without limits. Upgrade to Pro for unlimited conversations.
              </p>
            </>
          )}
        </div>

        {/* ── Billing toggle ─────────────────────────────────────────────────── */}
        {!isPro && (
          <div className="flex justify-center mb-10">
            <div className="flex rounded-xl p-1 gap-1"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              {(['monthly', 'annual'] as const).map(b => (
                <button key={b} onClick={() => setBilling(b)}
                  className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: billing === b ? 'var(--bg-surface)' : 'transparent',
                    color: billing === b ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: billing === b ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
                  }}>
                  {b === 'monthly' ? 'Monthly' : (
                    <span className="flex items-center gap-2">
                      Annual
                      <span className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{ background: 'var(--accent)', color: 'white' }}>
                        Save 33%
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Pricing cards ───────────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">

          {/* Free card */}
          <div className="p-6 rounded-2xl"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <div className="mb-5">
              <p className="text-xs uppercase tracking-widest font-medium mb-1"
                style={{ color: 'var(--text-muted)' }}>
                Free
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl" style={{ color: 'var(--text-primary)' }}>$0</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/month</span>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Perfect for trying Lumina
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Check />
                  {f}
                </div>
              ))}
            </div>

            <div className="px-4 py-2.5 rounded-xl text-sm text-center font-medium"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
              {isPro ? 'Previous plan' : 'Current plan'}
            </div>
          </div>

          {/* Pro card */}
          <div className="p-6 rounded-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-tertiary) 100%)',
              border: '1px solid var(--accent)',
              boxShadow: '0 0 40px var(--accent-glow)',
            }}>
            {/* Popular badge */}
            <div className="absolute top-4 right-4">
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'var(--accent)', color: 'white' }}>
                Most popular
              </span>
            </div>

            <div className="mb-5">
              <p className="text-xs uppercase tracking-widest font-medium mb-1"
                style={{ color: 'var(--accent)' }}>
                Pro
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-4xl" style={{ color: 'var(--text-primary)' }}>
                  ${monthlyPrice}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/month</span>
              </div>
              {billing === 'annual' && (
                <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>
                  Billed as ${annualTotal}/year
                </p>
              )}
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                For power users & professionals
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2.5 text-sm"
                  style={{ color: 'var(--text-primary)' }}>
                  <Check pro />
                  {f}
                </div>
              ))}
            </div>

            {isPro ? (
              <div className="px-4 py-2.5 rounded-xl text-sm text-center font-medium"
                style={{ background: 'var(--accent-glow)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>
                ✦ Active plan
              </div>
            ) : upgradeClicked ? (
              <div className="px-4 py-3 rounded-xl text-sm text-center"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                <p className="font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>
                  Coming soon!
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Payment integration in progress. We'll notify you when ready.
                </p>
              </div>
            ) : (
              <button onClick={handleUpgrade}
                className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98]"
                style={{
                  background: 'var(--accent)',
                  color: 'white',
                  boxShadow: '0 4px 20px var(--accent-glow)',
                }}>
                Upgrade to Pro →
              </button>
            )}
          </div>
        </div>

        {/* ── Comparison table ─────────────────────────────────────────────────── */}
        <div className="mb-16">
          <h2 className="font-display text-2xl text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            Compare plans
          </h2>
          <div className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid var(--border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--bg-secondary)' }}>
                  <th className="px-5 py-4 text-left" style={{ color: 'var(--text-secondary)' }}>Feature</th>
                  <th className="px-5 py-4 text-center" style={{ color: 'var(--text-secondary)' }}>Free</th>
                  <th className="px-5 py-4 text-center" style={{ color: 'var(--accent)' }}>Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Daily messages', '20', 'Unlimited'],
                  ['Chat history', '7 days', 'Forever'],
                  ['AI model', 'Standard', 'Advanced'],
                  ['Response speed', 'Normal', 'Priority'],
                  ['File uploads', false, true],
                  ['Custom prompts', false, true],
                  ['API access', false, true],
                  ['Priority support', false, true],
                ].map(([feature, freeVal, proVal], i) => (
                  <tr key={String(feature)}
                    style={{
                      background: i % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                      borderTop: '1px solid var(--border)',
                    }}>
                    <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>
                      {feature}
                    </td>
                    <td className="px-5 py-3.5 text-center" style={{ color: 'var(--text-primary)' }}>
                      {typeof freeVal === 'boolean'
                        ? (freeVal ? <Check /> : <X />)
                        : <span className="text-xs">{freeVal}</span>
                      }
                    </td>
                    <td className="px-5 py-3.5 text-center" style={{ color: 'var(--accent)' }}>
                      {typeof proVal === 'boolean'
                        ? (proVal ? <Check pro /> : <X />)
                        : <span className="text-xs font-medium">{proVal}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Testimonials ─────────────────────────────────────────────────────── */}
        <div className="mb-16">
          <h2 className="font-display text-2xl text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            What users say
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Testimonial
              quote="Lumina Pro saves me hours every week. The unlimited messages alone are worth it."
              name="Sarah K."
              role="Product Designer"
            />
            <Testimonial
              quote="The advanced model is noticeably smarter. I use it for complex research daily."
              name="Marcus T."
              role="Research Analyst"
            />
            <Testimonial
              quote="Switched to Pro after hitting the free limit twice in a row. Never looked back."
              name="Priya M."
              role="Software Engineer"
            />
          </div>
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-center mb-8" style={{ color: 'var(--text-primary)' }}>
            Frequently asked
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. Cancel anytime from your account settings. You keep Pro access until the end of your billing period.',
              },
              {
                q: 'Is my data safe?',
                a: 'Absolutely. Your conversations are encrypted and never used to train our models without your explicit consent.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, Apple Pay, and Google Pay via Stripe.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'Yes, we offer a 7-day money-back guarantee if you're not satisfied, no questions asked.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="p-5 rounded-xl"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
                <p className="font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>{q}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
