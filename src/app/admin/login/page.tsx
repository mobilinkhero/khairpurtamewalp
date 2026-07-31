import type { Metadata } from 'next'
import LoginForm from '@/components/admin/LoginForm'

export const metadata: Metadata = { title: 'Sign In — Admin' }

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a2e0a] via-primary to-primary-light relative overflow-hidden flex-col justify-between p-12">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

        {/* Logo */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
              <span className="text-white font-black text-sm">KT</span>
            </div>
            <div>
              <p className="font-black text-white text-lg leading-tight">Khairpur Tamewali</p>
              <p className="text-green-200/70 text-xs">Admin Console</p>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Manage your<br />
            <span className="text-accent">city platform</span><br />
            with ease.
          </h1>
          <p className="text-green-100/70 text-base leading-relaxed max-w-sm">
            Full control over businesses, places, news, events and emergency contacts — all from one powerful dashboard.
          </p>
        </div>

        {/* Stats */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { value: '200+', label: 'Businesses' },
            { value: '50+',  label: 'Places' },
            { value: '24/7', label: 'Emergency' },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <p className="text-2xl font-black text-accent">{s.value}</p>
              <p className="text-xs text-green-200/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white font-black">KT</span>
            </div>
            <h1 className="text-xl font-black text-gray-900">Khairpur Tamewali</h1>
            <p className="text-gray-500 text-sm">Admin Console</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-900">Welcome back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to your admin account</p>
            </div>
            <LoginForm />
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            Independent community platform · Not affiliated with any government entity
          </p>
        </div>
      </div>
    </div>
  )
}
