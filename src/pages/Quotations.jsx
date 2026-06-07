import { useState } from 'react'
import { Plus, Pencil, Trash2, Download, CheckCircle, ShoppingCart } from 'lucide-react'
import { Button, Modal, Input, Select, Textarea, StatusBadge, SearchBar, PageHeader, ConfirmDialog } from '../components/ui'
import useStore from '../store/useStore'
import { useForm } from 'react-hook-form'
import { generateQuotePDF } from '../utils/pdf'

const productTypes = ['Corrugated Box', 'Mono Carton', 'Flexible Pouch', 'Tin Can', 'Label', 'PET Bottle', 'Duplex Carton', 'LDPE Bag', 'Blister Pack', 'Other']
const printTypes = ['Offset', 'Flexo', 'Gravure', 'Digital', 'None']
const statuses = ['Draft', 'Sent', 'Approved', 'Rejected']

export default function Quotations() {
  const { quotations, customers, addQuotation, updateQuotation, deleteQuotation, addOrder, company } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const [search, setSearch] = useState('')
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()

  const qty = parseFloat(watch('qty') || 0)
  const unitPrice = parseFloat(watch('unitPrice') || 0)
  const subtotal = qty * unitPrice
  const gst = subtotal * 0.18
  const grandTotal = subtotal + gst

  const filtered = quotations.filter(q =>
    q.quoteNo?.toLowerCase().includes(search.toLowerCase()) ||
    q.customer?.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() { setEditing(null); reset({}); setOpen(true) }
  function openEdit(q) { setEditing(q); reset(q); setOpen(true) }
  function onSubmit(data) {
    const payload = { ...data, qty: parseFloat(data.qty), unitPrice: parseFloat(data.unitPrice), total: subtotal, gst, grandTotal }
    editing ? updateQuotation(editing.id, payload) : addQuotation(payload)
    setOpen(false); reset()
  }
  function convertToOrder(q) {
    addOrder({ customer: q.customer, product: q.product, qty: q.qty, value: q.grandTotal, quoteRef: q.quoteNo, deliveryDate: '' })
    updateQuotation(q.id, { status: 'Approved' })
    alert(`Order created from ${q.quoteNo}!`)
  }

  return (
    <div>
      <PageHeader title="Quotations" subtitle={`${quotations.length} total quotes`}
        actions={<Button onClick={openAdd}><Plus size={15} />New Quotation</Button>} />

      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search quotations..." /></div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Quote No.</th><th>Customer</th><th>Product</th><th>Qty</th><th>Grand Total</th><th>Date</th><th>Valid Until</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id}>
                  <td className="font-bold text-blue-600">{q.quoteNo}</td>
                  <td className="font-semibold">{q.customer}</td>
                  <td>{q.product}</td>
                  <td>{q.qty?.toLocaleString('en-IN')}</td>
                  <td className="font-bold text-orange-600">₹{q.grandTotal?.toLocaleString('en-IN')}</td>
                  <td>{q.date}</td>
                  <td>{q.validUntil}</td>
                  <td><StatusBadge status={q.status} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button title="Download PDF" onClick={() => generateQuotePDF(q, company)} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500"><Download size={13} /></button>
                      <button title="Convert to Order" onClick={() => convertToOrder(q)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-500"><ShoppingCart size={13} /></button>
                      <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => setDel(q)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="text-center py-12 text-gray-400">No quotations found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Quotation' : 'New Quotation'} size="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Select label="Customer *" {...register('customer', { required: 'Required' })} error={errors.customer?.message}>
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.id}>{c.company}</option>)}
            </Select>
            <Select label="Product Type *" {...register('product', { required: 'Required' })} error={errors.product?.message}>
              <option value="">Select type...</option>
              {productTypes.map(p => <option key={p}>{p}</option>)}
            </Select>
            <Input label="Size (L×W×H mm)" {...register('size')} />
            <Input label="Quantity (Pcs) *" type="number" {...register('qty', { required: 'Required', min: 1 })} error={errors.qty?.message} />
            <Input label="No. of Colors" type="number" {...register('colors')} />
            <Select label="Printing Type" {...register('printType')}>
              {printTypes.map(p => <option key={p}>{p}</option>)}
            </Select>
            <Input label="Material / Board GSM" {...register('material')} />
            <Input label="Lamination / Finish" {...register('lamination')} />
            <Input label="Unit Price (₹) *" type="number" step="0.01" {...register('unitPrice', { required: 'Required', min: 0.01 })} error={errors.unitPrice?.message} />
            <Input label="Valid Until" type="date" {...register('validUntil')} />
            <Select label="Status" {...register('status')}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </Select>
            <div />
            {/* Totals Preview */}
            <div className="col-span-2 bg-orange-50 rounded-xl p-4 border border-orange-100 mt-2">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><div className="text-xs text-gray-500 font-medium">Subtotal</div><div className="text-lg font-bold text-gray-800">₹{subtotal.toLocaleString('en-IN', {maximumFractionDigits:2})}</div></div>
                <div><div className="text-xs text-gray-500 font-medium">GST (18%)</div><div className="text-lg font-bold text-gray-800">₹{gst.toLocaleString('en-IN', {maximumFractionDigits:2})}</div></div>
                <div><div className="text-xs text-gray-500 font-medium">Grand Total</div><div className="text-xl font-extrabold text-orange-600">₹{grandTotal.toLocaleString('en-IN', {maximumFractionDigits:2})}</div></div>
              </div>
            </div>
            <div className="col-span-2"><Textarea label="Notes / Special Instructions" {...register('notes')} /></div>
          </div>
          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="secondary">{editing ? 'Update' : 'Save Quote'}</Button>
            <Button type="submit">{editing ? 'Update' : 'Save & Send'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteQuotation(del.id); setDel(null) }}
        title="Delete Quotation" message={`Delete quote "${del?.quoteNo}"?`} />
    </div>
  )
}
