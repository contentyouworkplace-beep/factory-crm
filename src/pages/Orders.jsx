import { useState } from 'react'
import { Plus, Pencil, Trash2, Download, ArrowRight, FileText } from 'lucide-react'
import { Button, Modal, Input, Select, Textarea, StatusBadge, SearchBar, PageHeader, ConfirmDialog } from '../components/ui'
import useStore from '../store/useStore'
import { useForm } from 'react-hook-form'
import { generateChallanPDF } from '../utils/pdf'

const statuses = ['Confirmed', 'Artwork Approved', 'In Production', 'QC Passed', 'Dispatched', 'Delivered', 'Cancelled']

const nextStatus = {
  'Confirmed': 'Artwork Approved',
  'Artwork Approved': 'In Production',
  'In Production': 'QC Passed',
  'QC Passed': 'Dispatched',
  'Dispatched': 'Delivered',
}

export default function Orders() {
  const { orders, customers, addOrder, updateOrder, deleteOrder, addInvoice, company } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const filtered = orders.filter(o => {
    const m = o.orderNo?.toLowerCase().includes(search.toLowerCase()) || o.customer?.toLowerCase().includes(search.toLowerCase())
    const s = filter === 'All' || o.status === filter
    return m && s
  })

  function openAdd() { setEditing(null); reset({}); setOpen(true) }
  function openEdit(o) { setEditing(o); reset(o); setOpen(true) }
  function onSubmit(data) {
    editing ? updateOrder(editing.id, { ...data, value: parseFloat(data.value) }) : addOrder({ ...data, value: parseFloat(data.value) })
    setOpen(false); reset()
  }
  function advance(o) {
    const next = nextStatus[o.status]
    if (next) updateOrder(o.id, { status: next })
  }
  function createInvoice(o) {
    addInvoice({ customer: o.customer, orderNo: o.orderNo, amount: o.value, balance: o.value, product: o.product, dueDate: '' })
    alert(`Invoice created for ${o.orderNo}!`)
  }

  return (
    <div>
      <PageHeader title="Sales Orders" subtitle={`${orders.length} total orders`}
        actions={<Button onClick={openAdd}><Plus size={15} />New Order</Button>} />

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <SearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
        <div className="flex gap-2 flex-wrap">
          {['All', ...statuses.slice(0,5)].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === s ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Order No.</th><th>Customer</th><th>Product</th><th>Qty</th><th>Value</th><th>Order Date</th><th>Delivery Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td className="font-bold text-blue-600">{o.orderNo}</td>
                  <td className="font-semibold">{o.customer}</td>
                  <td>{o.product}</td>
                  <td>{o.qty?.toLocaleString('en-IN')}</td>
                  <td className="font-bold text-orange-600">₹{o.value?.toLocaleString('en-IN')}</td>
                  <td>{o.orderDate}</td>
                  <td>{o.deliveryDate}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    <div className="flex gap-1">
                      {nextStatus[o.status] && (
                        <button title={`→ ${nextStatus[o.status]}`} onClick={() => advance(o)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-500"><ArrowRight size={13} /></button>
                      )}
                      <button title="Create Invoice" onClick={() => createInvoice(o)} className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-500"><FileText size={13} /></button>
                      <button title="Delivery Challan" onClick={() => generateChallanPDF(o, company)} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500"><Download size={13} /></button>
                      <button onClick={() => openEdit(o)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => setDel(o)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="text-center py-12 text-gray-400">No orders found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Order' : 'New Order'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Select label="Customer *" {...register('customer', { required: 'Required' })} error={errors.customer?.message}>
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.id}>{c.company}</option>)}
            </Select>
            <Input label="Product" {...register('product')} />
            <Input label="Quantity" type="number" {...register('qty')} />
            <Input label="Order Value (₹)" type="number" {...register('value')} />
            <Input label="Order Date" type="date" {...register('orderDate')} />
            <Input label="Delivery Date" type="date" {...register('deliveryDate')} />
            <Select label="Status" {...register('status')}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </Select>
            <div />
            <div className="col-span-2"><Textarea label="Special Instructions" {...register('notes')} /></div>
          </div>
          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update Order' : 'Create Order'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteOrder(del.id); setDel(null) }}
        title="Delete Order" message={`Delete order "${del?.orderNo}"?`} />
    </div>
  )
}
