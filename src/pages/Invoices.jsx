import { useState } from 'react'
import { Plus, Pencil, Trash2, Download, CheckCircle, X } from 'lucide-react'
import { Button, Modal, Input, Select, StatusBadge, SearchBar, PageHeader, ConfirmDialog } from '../components/ui'
import useStore from '../store/useStore'
import { useForm } from 'react-hook-form'
import { generateInvoicePDF } from '../utils/pdf'

const EMPTY_ITEM = { product: '', description: '', hsn: '4819', qty: 1, rate: '', amount: 0 }

export default function Invoices() {
  const { invoices, customers, orders, products, addInvoice, updateInvoice, deleteInvoice, company } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const [search, setSearch] = useState('')
  const [payOpen, setPayOpen] = useState(null)
  const [payAmt, setPayAmt] = useState('')
  const [items, setItems] = useState([{ ...EMPTY_ITEM }])
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()

  const filtered = invoices.filter(i =>
    i.invoiceNo?.toLowerCase().includes(search.toLowerCase()) ||
    i.customer?.toLowerCase().includes(search.toLowerCase())
  )

  const subtotal = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0)
  const gstRate = 18
  const gstAmt = Math.round(subtotal * gstRate / 100 * 100) / 100
  const total = subtotal + gstAmt

  function openAdd() {
    setEditing(null)
    setItems([{ ...EMPTY_ITEM }])
    reset({ date: new Date().toISOString().split('T')[0] })
    setOpen(true)
  }

  function openEdit(inv) {
    setEditing(inv)
    setItems(inv.items?.length ? inv.items.map(it => ({ ...it })) : [{ ...EMPTY_ITEM, description: inv.product || 'Packaging Material', amount: (inv.amount / 1.18) }])
    reset(inv)
    setOpen(true)
  }

  function updateItem(idx, field, value) {
    setItems(prev => prev.map((it, i) => {
      if (i !== idx) return it
      const updated = { ...it, [field]: value }
      if (field === 'qty' || field === 'rate') {
        updated.amount = Math.round((parseFloat(updated.qty) || 0) * (parseFloat(updated.rate) || 0) * 100) / 100
      }
      if (field === 'product') {
        const prod = products?.find(p => p.name === value)
        if (prod) {
          updated.description = prod.name
          updated.hsn = prod.hsn || '4819'
          updated.rate = prod.rate
          updated.amount = Math.round((parseFloat(updated.qty) || 0) * prod.rate * 100) / 100
        }
      }
      return updated
    }))
  }

  function addItem() { setItems(prev => [...prev, { ...EMPTY_ITEM }]) }
  function removeItem(idx) { setItems(prev => prev.filter((_, i) => i !== idx)) }

  function onSubmit(data) {
    const payload = {
      ...data,
      items,
      subtotal,
      gstAmt,
      amount: parseFloat(data.manualAmount) || total,
      paid: parseFloat(data.paid || 0),
      balance: (parseFloat(data.manualAmount) || total) - parseFloat(data.paid || 0),
      status: parseFloat(data.paid || 0) >= (parseFloat(data.manualAmount) || total) ? 'Paid'
        : parseFloat(data.paid || 0) > 0 ? 'Partial' : 'Unpaid',
    }
    delete payload.manualAmount
    editing ? updateInvoice(editing.id, payload) : addInvoice(payload)
    setOpen(false); reset(); setItems([{ ...EMPTY_ITEM }])
  }

  function recordPayment(inv) {
    const amt = parseFloat(payAmt || 0)
    if (amt <= 0) return
    const newPaid = (inv.paid || 0) + amt
    const balance = Math.max(0, (inv.amount || 0) - newPaid)
    updateInvoice(inv.id, { paid: newPaid, balance, status: balance <= 0 ? 'Paid' : 'Partial' })
    setPayOpen(null); setPayAmt('')
  }

  const totalOutstanding = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + (i.balance || 0), 0)

  return (
    <div>
      <PageHeader title="Invoices" subtitle={`Outstanding: ₹${totalOutstanding.toLocaleString('en-IN')}`}
        actions={<Button onClick={openAdd}><Plus size={15} />New Invoice</Button>} />

      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search invoices..." /></div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Invoice No.</th><th>Customer</th><th>Order Ref</th><th>Amount</th><th>Paid</th><th>Balance</th><th>Date</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td className="font-bold text-blue-600">{inv.invoiceNo}</td>
                  <td className="font-semibold">{inv.customer}</td>
                  <td className="text-xs text-gray-500">{inv.orderNo}</td>
                  <td className="font-semibold">₹{(inv.amount || 0).toLocaleString('en-IN')}</td>
                  <td className="text-green-600 font-semibold">₹{(inv.paid || 0).toLocaleString('en-IN')}</td>
                  <td className={`font-bold ${(inv.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{(inv.balance || 0).toLocaleString('en-IN')}</td>
                  <td>{inv.date}</td>
                  <td>{inv.dueDate}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button title="Download PDF" onClick={() => generateInvoicePDF(inv, company)} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500"><Download size={13} /></button>
                      {inv.status !== 'Paid' && (
                        <button title="Record Payment" onClick={() => { setPayOpen(inv); setPayAmt('') }} className="p-1.5 rounded-lg hover:bg-green-50 text-green-500"><CheckCircle size={13} /></button>
                      )}
                      <button onClick={() => openEdit(inv)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => setDel(inv)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={10} className="text-center py-12 text-gray-400">No invoices found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Invoice Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Invoice' : 'New Invoice'} size="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            {/* Header fields */}
            <div className="grid grid-cols-3 gap-x-4 gap-y-0 mb-2">
              <Select label="Customer *" {...register('customer', { required: 'Required' })} error={errors.customer?.message}>
                <option value="">Select customer...</option>
                {customers.map(c => <option key={c.id}>{c.company}</option>)}
              </Select>
              <Select label="Order Reference" {...register('orderNo')}>
                <option value="">None</option>
                {orders.map(o => <option key={o.id}>{o.orderNo}</option>)}
              </Select>
              <div className="grid grid-cols-2 gap-2 col-span-1">
                <Input label="Invoice Date" type="date" {...register('date')} />
                <Input label="Due Date" type="date" {...register('dueDate')} />
              </div>
            </div>

            {/* Line Items */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide">Line Items</h4>
                <button type="button" onClick={addItem} className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1">
                  <Plus size={12} /> Add Row
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs font-semibold w-40">Product</th>
                      <th className="px-2 py-2 text-left text-xs font-semibold">Description</th>
                      <th className="px-2 py-2 text-left text-xs font-semibold w-16">HSN</th>
                      <th className="px-2 py-2 text-right text-xs font-semibold w-16">Qty</th>
                      <th className="px-2 py-2 text-right text-xs font-semibold w-24">Rate (₹)</th>
                      <th className="px-2 py-2 text-right text-xs font-semibold w-24">Amount (₹)</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-2 py-1.5">
                          <select className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                            value={item.product}
                            onChange={e => updateItem(idx, 'product', e.target.value)}>
                            <option value="">Select / type below</option>
                            {(products || []).map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <input className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                            placeholder="Description" value={item.description}
                            onChange={e => updateItem(idx, 'description', e.target.value)} />
                        </td>
                        <td className="px-2 py-1.5">
                          <input className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-orange-400"
                            value={item.hsn} onChange={e => updateItem(idx, 'hsn', e.target.value)} />
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="number" min="1" className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 text-right focus:outline-none focus:ring-1 focus:ring-orange-400"
                            value={item.qty} onChange={e => updateItem(idx, 'qty', e.target.value)} />
                        </td>
                        <td className="px-2 py-1.5">
                          <input type="number" step="0.01" className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 text-right focus:outline-none focus:ring-1 focus:ring-orange-400"
                            value={item.rate} onChange={e => updateItem(idx, 'rate', e.target.value)} />
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          <span className="text-xs font-semibold text-gray-800">
                            ₹{(parseFloat(item.amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-1 py-1.5 text-center">
                          {items.length > 1 && (
                            <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600">
                              <X size={12} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-3">
              <div className="w-64 space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>GST (18%)</span>
                  <span>₹{gstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t border-gray-200 pt-1">
                  <span>Total</span>
                  <span className="text-orange-600">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-0 mt-3">
              <Input label="Amount Paid (₹)" type="number" step="0.01" defaultValue={0} {...register('paid')} />
              <Input label="Override Total (₹)" type="number" step="0.01" {...register('manualAmount')} placeholder={`Auto: ₹${total.toFixed(2)}`} />
            </div>
          </div>
          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update Invoice' : 'Create Invoice'}</Button>
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal open={!!payOpen} onClose={() => setPayOpen(null)} title="Record Payment">
        <div className="modal-body">
          <p className="text-sm text-gray-600 mb-4">
            Invoice: <strong>{payOpen?.invoiceNo}</strong> | Balance Due: <strong className="text-red-600">₹{(payOpen?.balance || 0).toLocaleString('en-IN')}</strong>
          </p>
          <Input label="Payment Amount (₹)" type="number" value={payAmt} onChange={e => setPayAmt(e.target.value)} placeholder="Enter amount received" />
        </div>
        <div className="modal-footer">
          <Button variant="ghost" onClick={() => setPayOpen(null)}>Cancel</Button>
          <Button onClick={() => recordPayment(payOpen)}><CheckCircle size={15} />Record Payment</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteInvoice(del.id); setDel(null) }}
        title="Delete Invoice" message={`Delete invoice "${del?.invoiceNo}"?`} />
    </div>
  )
}
