import { NavLink } from 'react-router-dom'
import { LayoutDashboard, UserCheck, ShoppingCart, Receipt, Menu } from 'lucide-react'

export default function MobileNav({ onMenuOpen }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-stretch z-40 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {[
        { to: '/', icon: LayoutDashboard, label: 'Home' },
        { to: '/leads', icon: UserCheck, label: 'Leads' },
        { to: '/orders', icon: ShoppingCart, label: 'Orders' },
        { to: '/invoices', icon: Receipt, label: 'Invoices' },
      ].map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 text-xs font-semibold gap-1 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`
          }>
          <Icon size={21} />
          <span>{label}</span>
        </NavLink>
      ))}
      <button onClick={onMenuOpen}
        className="flex-1 flex flex-col items-center justify-center py-2 text-xs font-semibold gap-1 text-gray-400 hover:text-gray-600 transition-colors">
        <Menu size={21} />
        <span>Menu</span>
      </button>
    </nav>
  )
}
