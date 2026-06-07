import { useState } from 'react'
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
import { Button, Modal, Input, Select, Textarea, StatusBadge, SearchBar, PageHeader, ConfirmDialog } from '../components/ui'
import useStore from '../store/useStore'
import { useForm } from 'react-hook-form'

const CATEGORIES = ['Corrugated', 'Mono Carton', 'Flexible', 'Pharma', 'Labels', 'Service', 'Other']
const UNITS = ['Pcs', 'KG', 'Meter', 'Roll', 'Box', 'Job', 'Sheet']

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.code?.toLowerCase().includes(search.toLowerCase()) ||
      p.hsn?.includes(search)
    const matchCat = catFilter === 'All' || p.category === catFilter
    return matchSearch && matchCat
  })

  function openAdd() { setEditing(null); reset({}); setOpen(true) }
  function openEdit(p) { setEditing(p); reset(p); setOpen(true) }
  function onSubmit(data) {
    const payload = { ...data, rate: parseFloat(data.rate || 0), gstRate: parseFloat(data.gstRate || 18) }
    editing ? updateProduct(editing.id, payload) : addProduct(payload)
    setOpen(false); reset()
  }

  const cats = ['All', ...CATEGORIES]

  return (
    <div>
      <PageHeader
        title="Products & Services"
        subtitle={`${products.length} items in catalog`}
        actions={<Button onClick={openAdd}><Plus size={15} />Add Product</Button>}
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${catFilter === c ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search by name, code, or HSN..." /></div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>HSN</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>GST %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className="font-mono text-xs font-bold text-blue-600">{p.code}</td>
                  <td>
                    <div className="font-semibold text-gray-900">{p.name}</div>
                    {p.description && <div className="text-xs text-gray-400 mt-0.5">{p.description}</div>}
                  </td>
                  <td>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.category === 'Service' ? 'bg-purple-100 text-purple-700' :
                      p.category === 'Corrugated' ? 'bg-orange-100 text-orange-700' :
                      p.category === 'Pharma' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{p.category}</span>
                  </td>
                  <td className="font-mono text-xs">{p.hsn}</td>
                  <td>{p.unit}</td>
                  <td className="font-semibold text-orange-600">₹{parseFloat(p.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td className="text-blue-600 font-semibold">{p.gstRate}%</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => setDel(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  No products found
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Product' : 'Add Product / Service'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Product Name *" {...register('name', { required: 'Required' })} error={errors.name?.message} />
            <Input label="Product Code" {...register('code')} placeholder="Auto-generated if blank" />
            <Select label="Category *" {...register('category', { required: true })}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </Select>
            <Select label="Unit" {...register('unit')}>
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </Select>
            <Input label="HSN Code" {...register('hsn')} placeholder="e.g. 4819" />
            <Input label="Rate (₹) *" type="number" step="0.01" {...register('rate', { required: 'Required' })} error={errors.rate?.message} />
            <Select label="GST Rate (%)" {...register('gstRate')}>
              {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
            </Select>
            <div />
            <div className="col-span-2">
              <Textarea label="Description" {...register('description')} placeholder="Brief product description" />
            </div>
          </div>
          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add Product'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteProduct(del.id); setDel(null) }}
        title="Delete Product" message={`Delete "${del?.name}" from catalog?`} />
    </div>
  )
}
