import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { Button, Modal, Input, Select, StatusBadge, SearchBar, PageHeader, ConfirmDialog } from '../components/ui'
import useStore from '../store/useStore'
import { useForm } from 'react-hook-form'

const industries = ['Food & Dairy', 'Food & Beverage', 'Pharma', 'FMCG', 'Chemical', 'Paint', 'Electrical', 'Textile', 'Other']
const states = ['Gujarat', 'Maharashtra', 'Rajasthan', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Other']
const categories = ['A', 'B', 'C']
const terms = ['Advance', 'Net 15', 'Net 30', 'Net 45', 'Net 60']

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const [search, setSearch] = useState('')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const filtered = customers.filter(c =>
    c.company?.toLowerCase().includes(search.toLowerCase()) ||
    c.contact?.toLowerCase().includes(search.toLowerCase()) ||
    c.city?.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() { setEditing(null); reset({}); setOpen(true) }
  function openEdit(c) { setEditing(c); reset(c); setOpen(true) }
  function onSubmit(data) {
    editing ? updateCustomer(editing.id, data) : addCustomer(data)
    setOpen(false); reset()
  }

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers.length} active accounts`}
        actions={<Button onClick={openAdd}><Plus size={15} />Add Customer</Button>} />

      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search customers..." /></div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Company</th><th>Contact</th><th>City / State</th><th>Industry</th><th>GST No.</th><th>Category</th><th>Payment Terms</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td className="font-semibold text-gray-900">{c.company}</td>
                  <td><div>{c.contact}</div><div className="text-xs text-gray-400">{c.phone}</div></td>
                  <td>{c.city}, {c.state}</td>
                  <td>{c.industry}</td>
                  <td className="font-mono text-xs">{c.gst}</td>
                  <td><span className={`badge ${c.category === 'A' ? 'badge-green' : c.category === 'B' ? 'badge-blue' : 'badge-gray'}`}>{c.category}</span></td>
                  <td>{c.paymentTerms}</td>
                  <td><StatusBadge status={c.status || 'Active'} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => setDel(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="text-center py-12 text-gray-400">No customers found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Customer' : 'Add Customer'} size="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Company Name *" {...register('company', { required: 'Required' })} error={errors.company?.message} />
            <Input label="Contact Person *" {...register('contact', { required: 'Required' })} error={errors.contact?.message} />
            <Input label="Phone *" {...register('phone', { required: 'Required' })} error={errors.phone?.message} />
            <Input label="Email" type="email" {...register('email')} />
            <Input label="City" {...register('city')} />
            <Select label="State" {...register('state')}>
              {states.map(s => <option key={s}>{s}</option>)}
            </Select>
            <Input label="GST Number" {...register('gst')} />
            <Input label="PAN" {...register('pan')} />
            <Select label="Industry" {...register('industry')}>
              {industries.map(i => <option key={i}>{i}</option>)}
            </Select>
            <Select label="Category" {...register('category')}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </Select>
            <Select label="Payment Terms" {...register('paymentTerms')}>
              {terms.map(t => <option key={t}>{t}</option>)}
            </Select>
            <Input label="Credit Limit (₹)" type="number" {...register('creditLimit')} />
            <div className="col-span-2">
              <Input label="Billing Address" {...register('billingAddress')} />
            </div>
            <div className="col-span-2">
              <Input label="Shipping Address" {...register('shippingAddress')} />
            </div>
          </div>
          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add Customer'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteCustomer(del.id); setDel(null) }}
        title="Delete Customer" message={`Delete "${del?.company}"? All related data will be lost.`} />
    </div>
  )
}
