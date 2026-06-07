import { useState } from 'react'
import { Plus, Pencil, Trash2, UserCheck } from 'lucide-react'
import { Button, Modal, Input, Select, Textarea, StatusBadge, SearchBar, PageHeader, EmptyState, ConfirmDialog } from '../components/ui'
import useStore from '../store/useStore'
import { useForm } from 'react-hook-form'

const sources = ['Cold Call', 'Reference', 'Exhibition', 'Website', 'Social Media', 'Other']
const industries = ['Food & Dairy', 'Food & Beverage', 'Pharma', 'FMCG', 'Chemical', 'Paint', 'Electrical', 'Textile', 'Other']
const statuses = ['New', 'Contacted', 'Qualified', 'Quote Sent', 'Negotiation', 'Won', 'Lost']
const priorities = ['Hot', 'Warm', 'Cold']

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const filtered = leads.filter(l => {
    const match = l.name?.toLowerCase().includes(search.toLowerCase()) || l.contact?.toLowerCase().includes(search.toLowerCase())
    const st = filter === 'All' || l.status === filter
    return match && st
  })

  function openAdd() { setEditing(null); reset({}); setOpen(true) }
  function openEdit(l) { setEditing(l); reset(l); setOpen(true) }
  function onSubmit(data) {
    editing ? updateLead(editing.id, data) : addLead(data)
    setOpen(false); reset()
  }

  return (
    <div>
      <PageHeader title="Leads" subtitle={`${leads.length} total leads`}
        actions={<Button onClick={openAdd}><Plus size={15} />Add Lead</Button>} />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search leads..." />
        <div className="flex gap-2">
          {['All', ...statuses.slice(0,5)].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === s ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Company</th><th>Contact</th><th>Industry</th><th>Source</th><th>Priority</th><th>Status</th><th>Assigned</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id}>
                  <td className="font-semibold text-gray-900">{l.name}</td>
                  <td><div>{l.contact}</div><div className="text-xs text-gray-400">{l.phone}</div></td>
                  <td>{l.industry}</td>
                  <td>{l.source}</td>
                  <td><StatusBadge status={l.priority} /></td>
                  <td><StatusBadge status={l.status} /></td>
                  <td>{l.assignedTo}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition"><Pencil size={13} /></button>
                      <button onClick={() => setDel(l)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-12 text-gray-400">No leads found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Lead' : 'Add New Lead'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Company Name *" {...register('name', { required: 'Required' })} error={errors.name?.message} />
            <Input label="Contact Person *" {...register('contact', { required: 'Required' })} error={errors.contact?.message} />
            <Input label="Phone *" {...register('phone', { required: 'Required' })} error={errors.phone?.message} />
            <Input label="Email" type="email" {...register('email')} />
            <Input label="City" {...register('city')} />
            <Select label="Industry" {...register('industry')}>
              {industries.map(i => <option key={i}>{i}</option>)}
            </Select>
            <Select label="Lead Source" {...register('source')}>
              {sources.map(s => <option key={s}>{s}</option>)}
            </Select>
            <Select label="Status" {...register('status')}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </Select>
            <Select label="Priority" {...register('priority')}>
              {priorities.map(p => <option key={p}>{p}</option>)}
            </Select>
            <Input label="Assigned To" {...register('assignedTo')} />
            <div className="col-span-2">
              <Textarea label="Notes" {...register('notes')} />
            </div>
          </div>
          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add Lead'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteLead(del.id); setDel(null) }}
        title="Delete Lead" message={`Delete lead "${del?.name}"? This cannot be undone.`} />
    </div>
  )
}
