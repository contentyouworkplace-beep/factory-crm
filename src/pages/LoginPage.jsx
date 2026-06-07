import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'

const DEMO_EMAIL = 'demo@myfactorycontrol.com'
const DEMO_PASS  = 'Automate@5678'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASS) {
        localStorage.setItem('packcrm_user', JSON.stringify({ email: DEMO_EMAIL, name: 'Demo User' }))
        navigate('/', { replace: true })
      } else {
        setError('Invalid email or password. Use the demo credentials below.')
        setLoading(false)
      }
    }, 600)
  }

  function fillDemo() {
    setEmail(DEMO_EMAIL)
    setPassword(DEMO_PASS)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4 shadow-lg">
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Pack<span className="text-orange-400">CRM</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Packaging Factory Management Suite</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in to your account to continue</p>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} />Sign In</>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 bg-orange-50 border border-orange-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-2">Demo Credentials</p>
            <div className="space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-mono font-medium">{DEMO_EMAIL}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Password</span>
                <span className="font-mono font-medium">Automate@5678</span>
              </div>
            </div>
            <button
              onClick={fillDemo}
              className="mt-3 w-full text-xs font-semibold text-orange-600 hover:text-orange-700 bg-white border border-orange-200 rounded-lg py-2 transition-colors"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          © 2026 PackCRM · Built for Indian Packaging Industry
        </p>
      </div>
    </div>
  )
}
