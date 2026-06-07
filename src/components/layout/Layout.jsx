import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Search } from 'lucide-react'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

const titles = {
  '/': 'Dashboard', '/leads': 'Leads', '/customers': 'Customers',
  '/contacts': 'Contacts', '/activities': 'Activities',
  '/products': 'Products & Services',
  '/quotations': 'Quotations', '/orders': 'Orders',
  '/production': 'Production', '/inventory': 'Inventory',
  '/procurement': 'Procurement', '/quality': 'Quality & Complaints',
  '/dispatch': 'Dispatch', '/invoices': 'Invoices',
  '/payments': 'Payments', '/expenses': 'Expenses',
  '/gst': 'GST & Taxation', '/employees': 'Employees',
  '/machines': 'Machines & Assets', '/artwork': 'Artwork Management',
  '/documents': 'Document Management', '/reports': 'Reports & Analytics',
  '/feedback': 'Customer Feedback', '/branches': 'Branches',
  '/settings': 'Settings',
}

export default function Layout({ children, syncError }) {
  const { pathname } = useLocation()
  const title = titles[pathname] || 'PackCRM'
  const now = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Offline / sync error banner */}
        {syncError && (
          <div className="bg-amber-500 text-white text-center text-xs py-1.5 px-4 font-medium">
            Offline mode — run SQL schema in Supabase to enable cloud sync
          </div>
        )}
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm gap-3">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 flex-shrink-0"
          >
            <Menu size={20} />
          </button>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">{title}</h2>
            <p className="text-xs text-gray-400 hidden sm:block">{now}</p>
          </div>

          {/* Search (hidden on mobile) */}
          <div className="relative hidden md:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search anything..." className="input py-1.5 text-xs w-52 bg-gray-50 pl-8" />
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer flex-shrink-0">R</div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6 overflow-auto pb-20 lg:pb-6">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileNav onMenuOpen={() => setSidebarOpen(true)} />
      </div>
    </div>
  )
}
