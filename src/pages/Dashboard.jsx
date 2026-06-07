import { Users, FileText, ShoppingCart, CreditCard, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { StatCard, Card } from '../components/ui'
import useStore from '../store/useStore'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useNavigate } from 'react-router-dom'

const monthlyData = [
  { month: 'Jan', revenue: 8.2, orders: 12 }, { month: 'Feb', revenue: 11.4, orders: 18 },
  { month: 'Mar', revenue: 9.8, orders: 15 }, { month: 'Apr', revenue: 14.2, orders: 22 },
  { month: 'May', revenue: 16.1, orders: 26 }, { month: 'Jun', revenue: 18.4, orders: 31 },
]

export default function Dashboard() {
  const { leads, customers, orders, invoices, complaints, quotations } = useStore()
  const nav = useNavigate()

  const totalRevenue = invoices.reduce((s, i) => s + (i.amount || 0), 0)
  const outstanding = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + (i.balance || 0), 0)
  const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length
  const openLeads = leads.filter(l => !['Won', 'Lost'].includes(l.status)).length

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div onClick={() => nav('/leads')} className="cursor-pointer"><StatCard label="Active Leads" value={openLeads} sub="Click to view" color="orange" icon={Users} /></div>
        <div onClick={() => nav('/quotations')} className="cursor-pointer"><StatCard label="Open Quotes" value={quotations.filter(q => q.status !== 'Rejected').length} sub={`₹${(quotations.reduce((s,q)=>s+(q.grandTotal||0),0)/100000).toFixed(1)}L total`} color="blue" icon={FileText} /></div>
        <div onClick={() => nav('/orders')} className="cursor-pointer"><StatCard label="Active Orders" value={activeOrders} sub="In progress" color="green" icon={ShoppingCart} /></div>
        <div onClick={() => nav('/payments')} className="cursor-pointer"><StatCard label="Outstanding" value={`₹${(outstanding/100000).toFixed(1)}L`} sub={`${invoices.filter(i=>i.status!=='Paid').length} unpaid invoices`} color="red" icon={CreditCard} /></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <div className="card-header"><h3 className="card-title">Revenue Trend (2026)</h3><span className="text-xs text-orange-600 font-semibold">₹{(totalRevenue/100000).toFixed(1)}L YTD</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`₹${v}L`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#f97316" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="card-header"><h3 className="card-title">Quick Actions</h3></div>
          <div className="card-body space-y-2">
            {[
              { label: 'New Lead', path: '/leads', color: 'bg-orange-500' },
              { label: 'New Quotation', path: '/quotations', color: 'bg-blue-600' },
              { label: 'New Order', path: '/orders', color: 'bg-green-500' },
              { label: 'New Invoice', path: '/invoices', color: 'bg-purple-500' },
              { label: 'Add Customer', path: '/customers', color: 'bg-orange-400' },
              { label: 'Add Employee', path: '/employees', color: 'bg-blue-500' },
            ].map(({ label, path, color }) => (
              <button key={label} onClick={() => nav(path)}
                className={`w-full ${color} text-white text-sm font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition text-left`}>
                + {label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Orders */}
        <Card>
          <div className="card-header"><h3 className="card-title">Recent Orders</h3><button onClick={() => nav('/orders')} className="text-xs text-orange-600 font-semibold hover:underline">View All →</button></div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>Order</th><th>Customer</th><th>Value</th><th>Status</th></tr></thead>
              <tbody>
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id}>
                    <td className="font-semibold text-blue-600">{o.orderNo}</td>
                    <td>{o.customer}</td>
                    <td className="font-semibold">₹{o.value?.toLocaleString('en-IN')}</td>
                    <td><span className={`badge ${
                      o.status === 'Delivered' ? 'badge-green' :
                      o.status === 'Dispatched' ? 'badge-yellow' :
                      o.status === 'In Production' ? 'badge-orange' : 'badge-blue'
                    }`}>{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pipeline + Alerts */}
        <div className="space-y-4">
          <Card>
            <div className="card-header"><h3 className="card-title">Sales Pipeline</h3></div>
            <div className="card-body">
              {['New','Contacted','Qualified','Quote Sent','Negotiation'].map(stage => {
                const count = leads.filter(l => l.status === stage).length
                const pct = leads.length ? (count / leads.length) * 100 : 0
                return (
                  <div key={stage} className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 font-medium">{stage}</span>
                      <span className="font-bold text-orange-600">{count}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <div className="card-header"><h3 className="card-title">Alerts</h3></div>
            <div className="card-body space-y-2">
              {invoices.filter(i => i.status === 'Unpaid').slice(0, 2).map(i => (
                <div key={i.id} className="flex items-center gap-2 text-xs p-2 bg-red-50 rounded-lg">
                  <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                  <span className="text-red-700">Payment due: <strong>{i.customer}</strong> — ₹{i.balance?.toLocaleString('en-IN')}</span>
                </div>
              ))}
              {complaints.filter(c => c.status === 'Open').slice(0, 2).map(c => (
                <div key={c.id} className="flex items-center gap-2 text-xs p-2 bg-orange-50 rounded-lg">
                  <AlertCircle size={13} className="text-orange-500 flex-shrink-0" />
                  <span className="text-orange-700">Open complaint: <strong>{c.customer}</strong></span>
                </div>
              ))}
              {complaints.filter(c => c.status === 'Open').length === 0 && invoices.filter(i => i.status === 'Unpaid').length === 0 && (
                <div className="flex items-center gap-2 text-xs p-2 bg-green-50 rounded-lg">
                  <CheckCircle size={13} className="text-green-500" />
                  <span className="text-green-700">All clear! No pending alerts.</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
