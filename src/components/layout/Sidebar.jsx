import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserCheck, Phone, Activity,
  FileText, ShoppingCart, Factory, Package, Truck,
  ShieldCheck, Receipt, CreditCard, BarChart3, Settings,
  UserCog, Wrench, Palette, Calculator, Building2,
  Wallet, FolderOpen, Star, Box, PackageOpen, X
} from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { section: 'MAIN', items: [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { section: 'SALES & CRM', items: [
    { to: '/leads', icon: UserCheck, label: 'Leads' },
    { to: '/customers', icon: Users, label: 'Customers' },
    { to: '/contacts', icon: Phone, label: 'Contacts' },
    { to: '/activities', icon: Activity, label: 'Activities' },
    { to: '/products', icon: PackageOpen, label: 'Products & Services' },
    { to: '/quotations', icon: FileText, label: 'Quotations' },
    { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  ]},
  { section: 'OPERATIONS', items: [
    { to: '/production', icon: Factory, label: 'Production' },
    { to: '/inventory', icon: Package, label: 'Inventory' },
    { to: '/procurement', icon: Truck, label: 'Procurement' },
    { to: '/quality', icon: ShieldCheck, label: 'Quality & Complaints' },
    { to: '/dispatch', icon: Box, label: 'Dispatch' },
  ]},
  { section: 'FINANCE', items: [
    { to: '/invoices', icon: Receipt, label: 'Invoices' },
    { to: '/payments', icon: CreditCard, label: 'Payments' },
    { to: '/expenses', icon: Wallet, label: 'Expenses' },
    { to: '/gst', icon: Calculator, label: 'GST & Tax' },
  ]},
  { section: 'HR & STAFF', items: [
    { to: '/employees', icon: UserCog, label: 'Employees' },
  ]},
  { section: 'ASSETS', items: [
    { to: '/machines', icon: Wrench, label: 'Machines & Assets' },
    { to: '/artwork', icon: Palette, label: 'Artwork' },
    { to: '/documents', icon: FolderOpen, label: 'Documents' },
  ]},
  { section: 'INSIGHTS', items: [
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/feedback', icon: Star, label: 'Customer Feedback' },
    { to: '/branches', icon: Building2, label: 'Branches' },
  ]},
  { section: 'SYSTEM', items: [
    { to: '/settings', icon: Settings, label: 'Settings' },
  ]},
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-56',
        'bg-white border-r border-gray-100 flex flex-col h-screen flex-shrink-0 shadow-sm',
        'transition-transform duration-300 ease-in-out',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo + close button */}
        <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">P</span>
            </div>
            <div>
              <div className="font-extrabold text-gray-900 text-sm leading-tight">PackCRM</div>
              <div className="text-gray-400 text-xs">Packaging Suite</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          {nav.map((group) => (
            <div key={group.section}>
              <div className="nav-section">{group.section}</div>
              {group.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    clsx('nav-item', isActive && 'active')
                  }
                >
                  <Icon size={15} className="flex-shrink-0" />
                  <span className="truncate">{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">R</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-800 truncate">Rahul Medhe</div>
              <div className="text-xs text-gray-400">Admin</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
