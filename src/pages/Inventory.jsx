import { useState } from 'react'
import { Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { Button, Modal, Input, Select, SearchBar, PageHeader, ConfirmDialog, StatCard } from '../components/ui'
import useStore from '../store/useStore'
import { useForm } from 'react-hook-form'
import { Package, AlertCircle } from 'lucide-react'

const categories = ['Paper', 'Board', 'Film', 'Ink', 'Adhesive', 'Plate', 'Core', 'Packing', 'Other']
const units = ['KG', 'Roll', 'Sheet', 'Litre', 'Piece', 'Box', 'Bundle']

export default function Inventory() {
  const { inventory, addInventory, updateInventory, deleteInventory } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const [search, setSearch] = useState('')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const filtered = inventory.filter(i =>
    i.name?.toLowerCase().includes(search.toLowerCase()) ||
    i.itemCode?.toLowerCase().includes(search.toLowerCase())
  )
  const lowStock = inventory.filter(i => i.stock <= i.minStock)

  function openAdd() { setEditing(null); reset({}); setOpen(true) }
  function openEdit(i) { setEditing(i); reset(i); setOpen(true) }
  function onSubmit(data) {
    const payload = { ...data, stock: parseFloat(data.stock), minStock: parseFloat(data.minStock), rate: parseFloat(data.rate) }
    editing ? updateInventory(editing.id, payload) : addInventory(payload)
    setOpen(false); reset()
  }

  return (
    <div>
      <PageHeader title="Inventory" subtitle="Raw materials & finished goods"
        actions={<Button onClick={openAdd}><Plus size={15} />Add Item</Button>} />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Items" value={inventory.length} color="blue" icon={Package} />
        <StatCard label="Low Stock Alerts" value={lowStock.length} sub="Below minimum" color="red" icon={AlertCircle} />
        <StatCard label="Stock Value" value={`₹${(inventory.reduce((s,i)=>(s+(i.stock||0)*(i.rate||0)),0)/1000).toFixed(0)}K`} color="orange" icon={Package} />
        <StatCard label="Categories" value={new Set(inventory.map(i=>i.category)).size} color="green" icon={Package} />
      </div>

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">Low Stock Alert!</p>
            <p className="text-sm text-red-600">{lowStock.map(i => i.name).join(', ')} — below minimum stock level</p>
          </div>
        </div>
      )}

      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search items..." /></div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Item Code</th><th>Name</th><th>Category</th><th>Stock</th><th>Min. Stock</th><th>Unit</th><th>Rate (₹)</th><th>Stock Value</th><th>Supplier</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item.id}>
                  <td className="font-mono text-xs font-bold">{item.itemCode}</td>
                  <td className="font-semibold">{item.name}</td>
                  <td>{item.category}</td>
                  <td className={`font-bold ${item.stock <= item.minStock ? 'text-red-600' : 'text-green-600'}`}>
                    {item.stock?.toLocaleString('en-IN')}
                    {item.stock <= item.minStock && <AlertTriangle size={12} className="inline ml-1 text-red-500" />}
                  </td>
                  <td>{item.minStock?.toLocaleString('en-IN')}</td>
                  <td>{item.unit}</td>
                  <td>₹{item.rate}</td>
                  <td className="font-semibold text-orange-600">₹{((item.stock||0)*(item.rate||0)).toLocaleString('en-IN')}</td>
                  <td className="text-xs text-gray-500">{item.supplier}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => setDel(item)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={10} className="text-center py-12 text-gray-400">No items found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Item' : 'Add Inventory Item'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Item Code" {...register('itemCode')} />
            <Input label="Item Name *" {...register('name', { required: 'Required' })} error={errors.name?.message} />
            <Select label="Category" {...register('category')}>{categories.map(c => <option key={c}>{c}</option>)}</Select>
            <Select label="Unit" {...register('unit')}>{units.map(u => <option key={u}>{u}</option>)}</Select>
            <Input label="Current Stock *" type="number" {...register('stock', { required: 'Required' })} error={errors.stock?.message} />
            <Input label="Minimum Stock" type="number" {...register('minStock')} />
            <Input label="Rate per Unit (₹)" type="number" step="0.01" {...register('rate')} />
            <Input label="Supplier" {...register('supplier')} />
          </div>
          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add Item'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteInventory(del.id); setDel(null) }}
        title="Delete Item" message={`Delete "${del?.name}" from inventory?`} />
    </div>
  )
}
