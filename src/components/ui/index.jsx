import { forwardRef } from 'react'
import { X, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

export function Button({ children, variant = 'primary', size = 'md', className, ...props }) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white',
    secondary: 'bg-blue-600 hover:bg-blue-700 text-white',
    outline: 'border border-orange-500 text-orange-600 hover:bg-orange-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-base' }
  return <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>{children}</button>
}

export const Input = forwardRef(function Input({ label, error, className, ...props }, ref) {
  return (
    <div className={label ? 'mb-4' : ''}>
      {label && <label className="label">{label}</label>}
      <input ref={ref} className={clsx('input', error && 'border-red-400 focus:border-red-400 focus:ring-red-100', className)} {...props} />
      {error && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
    </div>
  )
})

export const Select = forwardRef(function Select({ label, error, children, className, ...props }, ref) {
  return (
    <div className={label ? 'mb-4' : ''}>
      {label && <label className="label">{label}</label>}
      <select ref={ref} className={clsx('select', error && 'border-red-400', className)} {...props}>{children}</select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea({ label, error, className, ...props }, ref) {
  return (
    <div className={label ? 'mb-4' : ''}>
      {label && <label className="label">{label}</label>}
      <textarea ref={ref} className={clsx('textarea', error && 'border-red-400', className)} rows={3} {...props} />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
})

export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const maxW = { sm: 'sm:max-w-lg', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' }
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center p-0 sm:p-4" onClick={onClose}>
      <div
        className={`bg-white w-full ${maxW[size]} sm:mx-auto rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div className="modal-header">
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Badge({ children, color = 'gray' }) {
  const colors = {
    orange: 'badge-orange', blue: 'badge-blue', green: 'badge-green',
    red: 'badge-red', yellow: 'badge-yellow', gray: 'badge-gray',
  }
  return <span className={colors[color]}>{children}</span>
}

export function StatusBadge({ status }) {
  const map = {
    'Active': 'green', 'Inactive': 'gray',
    'New': 'gray', 'Contacted': 'blue', 'Qualified': 'orange', 'Quote Sent': 'orange', 'Negotiation': 'yellow', 'Won': 'green', 'Lost': 'red',
    'Draft': 'gray', 'Sent': 'blue', 'Approved': 'green', 'Rejected': 'red',
    'Confirmed': 'blue', 'In Production': 'orange', 'QC Passed': 'green', 'Dispatched': 'yellow', 'Delivered': 'green', 'Cancelled': 'red',
    'Paid': 'green', 'Unpaid': 'red', 'Partial': 'yellow', 'Overdue': 'red',
    'Open': 'red', 'In Progress': 'orange', 'Resolved': 'green', 'Closed': 'gray',
    'Pending': 'yellow', 'Running': 'green', 'Maintenance': 'orange', 'Breakdown': 'red',
    'Hot': 'red', 'Warm': 'orange', 'Cold': 'blue',
  }
  return <Badge color={map[status] || 'gray'}>{status}</Badge>
}

export function Card({ children, className }) {
  return <div className={clsx('card', className)}>{children}</div>
}

export function StatCard({ label, value, sub, color = 'orange', icon: Icon }) {
  const colors = {
    orange: 'from-orange-500 to-orange-600',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
  }
  const bgs = { orange: 'bg-orange-50', blue: 'bg-blue-50', green: 'bg-green-50', red: 'bg-red-50' }
  const texts = { orange: 'text-orange-600', blue: 'text-blue-600', green: 'text-green-600', red: 'text-red-600' }
  return (
    <div className={clsx('stat-card', bgs[color])}>
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors[color]} rounded-t-xl`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
          <p className={clsx('text-2xl font-extrabold mt-1', texts[color])}>{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
        </div>
        {Icon && <div className={clsx('p-2.5 rounded-xl', bgs[color])}><Icon size={20} className={texts[color]} /></div>}
      </div>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <div className="bg-orange-50 p-4 rounded-full mb-4"><Icon size={32} className="text-orange-400" /></div>}
      <h3 className="font-bold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  if (!open) return null
  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-red-100 p-2 rounded-full"><AlertCircle size={20} className="text-red-500" /></div>
          <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative w-full sm:w-auto">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="input pl-9 w-full sm:w-64 bg-gray-50" />
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
    </div>
  )
}
