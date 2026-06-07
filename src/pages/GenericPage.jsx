import { useState, useRef } from 'react'
import { Plus, Pencil, Trash2, Download, Paperclip, FileDown, FileText } from 'lucide-react'
import { Button, Modal, Input, Select, Textarea, StatusBadge, SearchBar, PageHeader, ConfirmDialog } from '../components/ui'
import useStore from '../store/useStore'
import { useForm } from 'react-hook-form'
import { generatePOPDF, generateJobCardPDF, generateChallanPDF } from '../utils/pdf'

// ─── CONTACTS ─────────────────────────────────────────────────────
export function Contacts() {
  const { customers } = useStore()
  const [search, setSearch] = useState('')
  const allContacts = customers.map(c => ({ ...c, id: c.id, name: c.contact, company: c.company, phone: c.phone, email: c.email }))
  const filtered = allContacts.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <PageHeader title="Contacts" subtitle="All contact persons" />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search contacts..." /></div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Company</th><th>Phone</th><th>Email</th><th>Industry</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}><td className="font-semibold">{c.name}</td><td>{c.company}</td><td>{c.phone}</td><td>{c.email}</td><td>{c.industry}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── ACTIVITIES ───────────────────────────────────────────────────
export function Activities() {
  const { activities, addActivity, deleteActivity, customers } = useStore()
  const [open, setOpen] = useState(false)
  const [del, setDel] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = (data) => { addActivity(data); setOpen(false); reset() }
  return (
    <div>
      <PageHeader title="Activities & Follow-ups" subtitle={`${activities.length} logged`}
        actions={<Button onClick={() => setOpen(true)}><Plus size={15} />Log Activity</Button>} />
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Date</th><th>Type</th><th>Customer / Lead</th><th>Notes</th><th>Outcome</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {activities.map(a => (
                <tr key={a.id}>
                  <td>{a.date}</td><td>{a.type}</td><td>{a.customer}</td><td className="max-w-xs truncate">{a.notes}</td><td className="max-w-xs truncate">{a.outcome}</td>
                  <td><StatusBadge status={a.status || 'Pending'} /></td>
                  <td><button onClick={() => setDel(a)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button></td>
                </tr>
              ))}
              {activities.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-gray-400">No activities logged yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteActivity(del.id); setDel(null) }}
        title="Delete Activity" message={`Delete this ${del?.type} activity?`} />
      <Modal open={open} onClose={() => setOpen(false)} title="Log Activity">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Select label="Activity Type" {...register('type')}><option>Call</option><option>Meeting</option><option>Visit</option><option>WhatsApp</option><option>Demo</option></Select>
            <Input label="Date" type="date" {...register('date')} defaultValue={new Date().toISOString().split('T')[0]} />
            <Select label="Customer / Lead" {...register('customer')}>
              <option value="">Select...</option>
              {customers.map(c => <option key={c.id}>{c.company}</option>)}
            </Select>
            <Input label="Assigned To" {...register('assignedTo')} />
            <div className="col-span-2"><Textarea label="Notes" {...register('notes')} /></div>
            <div className="col-span-2"><Textarea label="Outcome" {...register('outcome')} /></div>
          </div>
          <div className="modal-footer"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Save Activity</Button></div>
        </form>
      </Modal>
    </div>
  )
}

// ─── PRODUCTION ───────────────────────────────────────────────────
export function Production() {
  const { jobCards, orders, addJobCard, updateJobCard, deleteJobCard, company } = useStore()
  const [open, setOpen] = useState(false)
  const [del, setDel] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = (data) => { addJobCard(data); setOpen(false); reset() }
  const stages = ['Pending', 'Pre-Press', 'Printing', 'Lamination', 'Die-Cutting', 'Finishing', 'Packing', 'Completed']
  return (
    <div>
      <PageHeader title="Production" subtitle="Job cards & production tracking"
        actions={<Button onClick={() => setOpen(true)}><Plus size={15} />New Job Card</Button>} />
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Job No.</th><th>Customer</th><th>Product</th><th>Qty</th><th>Machine</th><th>Deadline</th><th>Stage</th><th>Actions</th></tr></thead>
            <tbody>
              {jobCards.map(j => (
                <tr key={j.id}>
                  <td className="font-bold text-blue-600">{j.jobNo}</td>
                  <td>{j.customer}</td><td>{j.product}</td>
                  <td>{j.qty?.toLocaleString('en-IN')}</td>
                  <td>{j.machine}</td><td>{j.deadline}</td>
                  <td><StatusBadge status={j.status} /></td>
                  <td>
                    <div className="flex gap-1 items-center">
                      <button onClick={() => generateJobCardPDF(j, company)} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500"><Download size={13} /></button>
                      <Select className="text-xs py-1 px-2 h-7" value={j.status} onChange={e => updateJobCard(j.id, { status: e.target.value })}>
                        {stages.map(s => <option key={s}>{s}</option>)}
                      </Select>
                      <button onClick={() => setDel(j)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {jobCards.length === 0 && <tr><td colSpan={8} className="text-center py-12 text-gray-400">No job cards yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteJobCard(del.id); setDel(null) }}
        title="Delete Job Card" message={`Delete job card "${del?.jobNo}"?`} />
      <Modal open={open} onClose={() => setOpen(false)} title="New Job Card" size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Customer" {...register('customer')} />
            <Select label="Order Ref" {...register('orderNo')}><option value="">None</option>{orders.map(o => <option key={o.id}>{o.orderNo}</option>)}</Select>
            <Input label="Product" {...register('product')} />
            <Input label="Quantity" type="number" {...register('qty')} />
            <Input label="Size" {...register('size')} />
            <Input label="No. of Colors" {...register('colors')} />
            <Input label="Material" {...register('material')} />
            <Input label="Printing Type" {...register('printType')} />
            <Input label="Lamination" {...register('lamination')} />
            <Input label="Machine" {...register('machine')} />
            <Input label="Deadline" type="date" {...register('deadline')} />
            <Input label="Assigned To" {...register('assignedTo')} />
          </div>
          <div className="modal-footer"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Create Job Card</Button></div>
        </form>
      </Modal>
    </div>
  )
}

// ─── PROCUREMENT ──────────────────────────────────────────────────
export function Procurement() {
  const { purchaseOrders, vendors, inventory, addPO, updatePO, deletePO, company } = useStore()
  const [open, setOpen] = useState(false)
  const [del, setDel] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = (data) => { addPO({ ...data, amount: parseFloat(data.amount) }); setOpen(false); reset() }
  return (
    <div>
      <PageHeader title="Procurement & Purchase" subtitle={`${purchaseOrders.length} purchase orders`}
        actions={<Button onClick={() => setOpen(true)}><Plus size={15} />New PO</Button>} />
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>PO No.</th><th>Vendor</th><th>Item</th><th>Qty</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {purchaseOrders.map(po => (
                <tr key={po.id}>
                  <td className="font-bold text-blue-600">{po.poNo}</td>
                  <td>{po.vendor}</td><td>{po.item}</td>
                  <td>{po.qty} {po.unit}</td>
                  <td className="font-semibold text-orange-600">₹{po.amount?.toLocaleString('en-IN')}</td>
                  <td>{po.date}</td>
                  <td><StatusBadge status={po.status} /></td>
                  <td>
                    <div className="flex gap-1 items-center">
                      <button onClick={() => generatePOPDF(po, company)} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500"><Download size={13} /></button>
                      <Select className="text-xs py-1 px-2 h-7" value={po.status} onChange={e => updatePO(po.id, { status: e.target.value })}>
                        {['Draft','Sent','Confirmed','Received','Cancelled'].map(s => <option key={s}>{s}</option>)}
                      </Select>
                      <button onClick={() => setDel(po)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {purchaseOrders.length === 0 && <tr><td colSpan={8} className="text-center py-12 text-gray-400">No purchase orders yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deletePO(del.id); setDel(null) }}
        title="Delete Purchase Order" message={`Delete PO "${del?.poNo}"?`} />
      <Modal open={open} onClose={() => setOpen(false)} title="New Purchase Order" size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Select label="Vendor" {...register('vendor')}><option value="">Select vendor...</option>{vendors.map(v => <option key={v.id}>{v.name}</option>)}</Select>
            <Input label="Vendor Contact" {...register('vendorContact')} />
            <Select label="Item" {...register('item')}><option value="">Select item...</option>{inventory.map(i => <option key={i.id}>{i.name}</option>)}</Select>
            <Input label="Quantity" type="number" {...register('qty')} />
            <Select label="Unit" {...register('unit')}><option>KG</option><option>Roll</option><option>Sheet</option><option>Piece</option></Select>
            <Input label="Rate (₹)" type="number" step="0.01" {...register('rate')} />
            <Input label="Total Amount (₹)" type="number" {...register('amount')} />
            <Input label="Delivery Date" type="date" {...register('deliveryDate')} />
          </div>
          <div className="modal-footer"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Create PO</Button></div>
        </form>
      </Modal>
    </div>
  )
}

// ─── QUALITY & COMPLAINTS ─────────────────────────────────────────
export function Quality() {
  const { complaints, addComplaint, updateComplaint, deleteComplaint, customers, orders } = useStore()
  const [open, setOpen] = useState(false)
  const [del, setDel] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = (data) => { addComplaint(data); setOpen(false); reset() }
  return (
    <div>
      <PageHeader title="Quality & Complaints" subtitle={`${complaints.filter(c=>c.status==='Open').length} open complaints`}
        actions={<Button onClick={() => setOpen(true)}><Plus size={15} />New Complaint</Button>} />
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Date</th><th>Customer</th><th>Order Ref</th><th>Category</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {complaints.map(c => (
                <tr key={c.id}>
                  <td>{c.date}</td><td className="font-semibold">{c.customer}</td>
                  <td>{c.orderRef}</td><td>{c.category}</td>
                  <td className="max-w-xs truncate">{c.description}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <div className="flex gap-1 items-center">
                      <Select className="text-xs py-1 px-2 h-7" value={c.status} onChange={e => updateComplaint(c.id, { status: e.target.value })}>
                        {['Open','In Progress','Resolved','Closed'].map(s => <option key={s}>{s}</option>)}
                      </Select>
                      <button onClick={() => setDel(c)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {complaints.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-gray-400">No complaints logged</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteComplaint(del.id); setDel(null) }}
        title="Delete Complaint" message={`Delete complaint from "${del?.customer}"?`} />
      <Modal open={open} onClose={() => setOpen(false)} title="Log Complaint" size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Select label="Customer" {...register('customer')}><option value="">Select...</option>{customers.map(c => <option key={c.id}>{c.company}</option>)}</Select>
            <Select label="Order Ref" {...register('orderRef')}><option value="">None</option>{orders.map(o => <option key={o.id}>{o.orderNo}</option>)}</Select>
            <Select label="Category" {...register('category')}><option>Print Defect</option><option>Size Issue</option><option>Short Quantity</option><option>Delivery Delay</option><option>Damage</option><option>Other</option></Select>
            <Input label="Reported By" {...register('reportedBy')} />
            <div className="col-span-2"><Textarea label="Description" {...register('description')} /></div>
            <div className="col-span-2"><Textarea label="Root Cause (if known)" {...register('rootCause')} /></div>
            <div className="col-span-2"><Textarea label="Action Taken" {...register('action')} /></div>
          </div>
          <div className="modal-footer"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Log Complaint</Button></div>
        </form>
      </Modal>
    </div>
  )
}

// ─── DISPATCH ─────────────────────────────────────────────────────
export function Dispatch() {
  const { orders, updateOrder, company } = useStore()
  const readyOrders = orders.filter(o => ['QC Passed', 'Dispatched'].includes(o.status))
  return (
    <div>
      <PageHeader title="Dispatch & Logistics" subtitle={`${readyOrders.length} orders ready/dispatched`} />
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Order No.</th><th>Customer</th><th>Product</th><th>Qty</th><th>Value</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {readyOrders.map(o => (
                <tr key={o.id}>
                  <td className="font-bold text-blue-600">{o.orderNo}</td>
                  <td>{o.customer}</td><td>{o.product}</td>
                  <td>{o.qty?.toLocaleString('en-IN')}</td>
                  <td>₹{o.value?.toLocaleString('en-IN')}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => generateChallanPDF(o, company)} variant="outline"><Download size={12} />Challan</Button>
                      {o.status === 'QC Passed' && <Button size="sm" onClick={() => updateOrder(o.id, { status: 'Dispatched' })}>Mark Dispatched</Button>}
                      {o.status === 'Dispatched' && <Button size="sm" variant="success" onClick={() => updateOrder(o.id, { status: 'Delivered' })}>Mark Delivered</Button>}
                    </div>
                  </td>
                </tr>
              ))}
              {readyOrders.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-gray-400">No orders ready for dispatch</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── PAYMENTS ─────────────────────────────────────────────────────
export function Payments() {
  const { invoices } = useStore()
  const unpaid = invoices.filter(i => i.status !== 'Paid')
  const totalOut = unpaid.reduce((s, i) => s + (i.balance || 0), 0)
  return (
    <div>
      <PageHeader title="Payments & Collections" subtitle={`₹${totalOut.toLocaleString('en-IN')} outstanding`} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[{label:'Total Billed',val:invoices.reduce((s,i)=>s+(i.amount||0),0),c:'orange'},
          {label:'Amount Collected',val:invoices.reduce((s,i)=>s+(i.paid||0),0),c:'green'},
          {label:'Outstanding',val:totalOut,c:'red'}
        ].map(({label,val,c}) => (
          <div key={label} className={`card p-5 border-l-4 ${c==='orange'?'border-orange-500':c==='green'?'border-green-500':'border-red-500'}`}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${c==='orange'?'text-orange-600':c==='green'?'text-green-600':'text-red-600'}`}>₹{val.toLocaleString('en-IN')}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-header"><h3 className="card-title">Pending Payments (Aging)</h3></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Invoice No.</th><th>Customer</th><th>Invoice Amount</th><th>Paid</th><th>Balance</th><th>Due Date</th><th>Status</th></tr></thead>
            <tbody>
              {unpaid.map(i => (
                <tr key={i.id}>
                  <td className="font-bold text-blue-600">{i.invoiceNo}</td>
                  <td className="font-semibold">{i.customer}</td>
                  <td>₹{i.amount?.toLocaleString('en-IN')}</td>
                  <td className="text-green-600">₹{i.paid?.toLocaleString('en-IN')}</td>
                  <td className="font-bold text-red-600">₹{i.balance?.toLocaleString('en-IN')}</td>
                  <td>{i.dueDate}</td>
                  <td><StatusBadge status={i.status} /></td>
                </tr>
              ))}
              {unpaid.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-gray-400">No outstanding payments 🎉</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── EXPENSES ─────────────────────────────────────────────────────
export function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense, employees } = useStore()
  const [open, setOpen] = useState(false)
  const [del, setDel] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const [billData, setBillData] = useState(null)
  const [billName, setBillName] = useState('')
  const [billPreview, setBillPreview] = useState(null)
  const billRef = useRef()

  function handleBill(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { alert('File must be under 10 MB'); return }
    const reader = new FileReader()
    reader.onload = ev => {
      setBillData(ev.target.result)
      setBillName(file.name)
      if (file.type.startsWith('image/')) setBillPreview(ev.target.result)
      else setBillPreview(null)
    }
    reader.readAsDataURL(file)
  }

  function removeBill() { setBillData(null); setBillName(''); setBillPreview(null); if (billRef.current) billRef.current.value = '' }

  function downloadBill(e) {
    const link = document.createElement('a')
    link.href = e.billData
    link.download = e.billName || 'expense-bill'
    link.click()
  }

  const onSubmit = (data) => {
    addExpense({ ...data, amount: parseFloat(data.amount), billData, billName })
    setOpen(false); reset(); removeBill()
  }

  const total = expenses.reduce((s, e) => s + (e.amount || 0), 0)

  return (
    <div>
      <PageHeader title="Expense Management" subtitle={`₹${total.toLocaleString('en-IN')} total`}
        actions={<Button onClick={() => setOpen(true)}><Plus size={15} />Add Expense</Button>} />
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Date</th><th>Employee</th><th>Type</th><th>Description</th><th>Bill</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id}>
                  <td>{e.date}</td><td>{e.employee}</td><td>{e.type}</td>
                  <td className="max-w-xs truncate">{e.description}</td>
                  <td>
                    {e.billData ? (
                      <button onClick={() => downloadBill(e)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium max-w-28 truncate" title={e.billName}>
                        {e.billData.startsWith('data:image') ? (
                          <img src={e.billData} alt="bill" className="w-8 h-8 object-cover rounded border border-gray-200 flex-shrink-0" />
                        ) : (
                          <FileDown size={13} />
                        )}
                        <span className="truncate">{e.billName || 'Bill'}</span>
                      </button>
                    ) : <span className="text-xs text-gray-400">—</span>}
                  </td>
                  <td className="font-semibold text-orange-600">₹{e.amount?.toLocaleString('en-IN')}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td>
                    <div className="flex gap-1 items-center">
                      <Select className="text-xs py-1 px-2 h-7" value={e.status} onChange={ev => updateExpense(e.id, { status: ev.target.value })}>
                        {['Pending','Approved','Rejected','Paid'].map(s => <option key={s}>{s}</option>)}
                      </Select>
                      <button onClick={() => setDel(e)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && <tr><td colSpan={8} className="text-center py-12 text-gray-400">No expenses logged</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteExpense(del.id); setDel(null) }}
        title="Delete Expense" message={`Delete this ${del?.type} expense of ₹${del?.amount?.toLocaleString('en-IN')}?`} />
      <Modal open={open} onClose={() => { setOpen(false); reset(); removeBill() }} title="Add Expense">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Date" type="date" {...register('date')} defaultValue={new Date().toISOString().split('T')[0]} />
            <Select label="Employee" {...register('employee')}><option value="">Select...</option>{employees.map(e => <option key={e.id}>{e.name}</option>)}</Select>
            <Select label="Expense Type" {...register('type')}>
              <option>Travel</option><option>Fuel</option><option>Food</option>
              <option>Entertainment</option><option>Office</option><option>Raw Material</option>
              <option>Maintenance</option><option>Courier</option><option>Other</option>
            </Select>
            <Input label="Amount (₹)" type="number" {...register('amount')} />
            <div className="col-span-2"><Textarea label="Description" {...register('description')} /></div>

            {/* Bill upload */}
            <div className="col-span-2">
              <label className="label">Bill / Receipt <span className="font-normal text-gray-400 normal-case">(Photo, PDF — max 10 MB)</span></label>
              <input ref={billRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleBill} />
              {billData ? (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  {billPreview ? (
                    <img src={billPreview} alt="Bill preview" className="w-16 h-16 object-cover rounded-lg border border-blue-300 flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={24} className="text-blue-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-blue-700 truncate">{billName}</p>
                    <p className="text-xs text-blue-500 mt-0.5">Bill attached</p>
                    <button type="button" onClick={removeBill} className="text-xs text-red-500 hover:text-red-700 font-semibold mt-1">Remove</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => billRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors">
                  <Paperclip size={16} />Take Photo or Upload Bill
                </button>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={() => { setOpen(false); reset(); removeBill() }}>Cancel</Button>
            <Button type="submit">Add Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

// ─── MACHINES ─────────────────────────────────────────────────────
export function Machines() {
  const { machines, addMachine, updateMachine, deleteMachine } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = (data) => {
    const payload = { ...data, cost: parseFloat(data.cost) }
    editing ? updateMachine(editing.id, payload) : addMachine(payload)
    setOpen(false); reset(); setEditing(null)
  }
  return (
    <div>
      <PageHeader title="Machines & Assets" subtitle={`${machines.length} registered assets`}
        actions={<Button onClick={() => setOpen(true)}><Plus size={15} />Add Machine</Button>} />
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Asset ID</th><th>Name</th><th>Type</th><th>Purchase Date</th><th>Cost (₹)</th><th>Last Service</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {machines.map(m => (
                <tr key={m.id}>
                  <td className="font-mono text-xs font-bold">{m.assetId}</td>
                  <td className="font-semibold">{m.name}</td><td>{m.type}</td>
                  <td>{m.purchaseDate}</td>
                  <td>₹{m.cost?.toLocaleString('en-IN')}</td>
                  <td>{m.lastService}</td>
                  <td><StatusBadge status={m.status} /></td>
                  <td>
                    <div className="flex gap-1 items-center">
                      <Select className="text-xs py-1 px-2 h-7" value={m.status} onChange={e => updateMachine(m.id, { status: e.target.value })}>
                        {['Running','Maintenance','Breakdown','Idle'].map(s => <option key={s}>{s}</option>)}
                      </Select>
                      <button onClick={() => { setEditing(m); reset(m); setOpen(true) }} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => setDel(m)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteMachine(del.id); setDel(null) }}
        title="Delete Asset" message={`Delete "${del?.name}" from asset registry?`} />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Machine / Asset' : 'Add Machine / Asset'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Machine Name *" {...register('name')} />
            <Input label="Type" {...register('type')} />
            <Input label="Purchase Date" type="date" {...register('purchaseDate')} />
            <Input label="Cost (₹)" type="number" {...register('cost')} />
            <Input label="Warranty Until" type="date" {...register('warranty')} />
            <Input label="Last Service Date" type="date" {...register('lastService')} />
            <Input label="Manufacturer" {...register('manufacturer')} />
            <Input label="Model No." {...register('model')} />
          </div>
          <div className="modal-footer"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">{editing ? 'Update' : 'Add Asset'}</Button></div>
        </form>
      </Modal>
    </div>
  )
}

// ─── SIMPLE STUBS ─────────────────────────────────────────────────
export function GST() {
  const { invoices } = useStore()
  const totalTaxable = invoices.reduce((s, i) => s + (i.subtotal || (i.amount || 0) / 1.18), 0)
  const totalGST = invoices.reduce((s, i) => s + (i.gstAmt || ((i.amount || 0) - (i.amount || 0) / 1.18)), 0)
  return (
    <div>
      <PageHeader title="GST & Taxation" subtitle="Tax summary & reports" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-5"><p className="text-xs font-bold text-gray-500 uppercase">Taxable Value</p><p className="text-2xl font-extrabold text-orange-600 mt-1">₹{totalTaxable.toLocaleString('en-IN', {maximumFractionDigits:0})}</p></div>
        <div className="card p-5"><p className="text-xs font-bold text-gray-500 uppercase">GST Collected</p><p className="text-2xl font-extrabold text-blue-600 mt-1">₹{totalGST.toLocaleString('en-IN', {maximumFractionDigits:0})}</p></div>
        <div className="card p-5"><p className="text-xs font-bold text-gray-500 uppercase">Total Invoiced</p><p className="text-2xl font-extrabold text-green-600 mt-1">₹{invoices.reduce((s,i)=>s+(i.amount||0),0).toLocaleString('en-IN')}</p></div>
      </div>
      <div className="card">
        <div className="card-header"><h3 className="card-title">GSTR-1 — Outward Supplies Summary</h3></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Invoice No.</th><th>Customer</th><th>Date</th><th>Taxable Amount</th><th>CGST (9%)</th><th>SGST (9%)</th><th>Total GST</th><th>Invoice Total</th></tr></thead>
            <tbody>
              {invoices.map(i => {
                const taxable = i.subtotal || (i.amount || 0) / 1.18
                const cgst = taxable * 0.09
                return (
                  <tr key={i.id}>
                    <td className="font-bold text-blue-600">{i.invoiceNo}</td>
                    <td>{i.customer}</td><td>{i.date}</td>
                    <td>₹{taxable.toLocaleString('en-IN', {maximumFractionDigits:2})}</td>
                    <td>₹{cgst.toLocaleString('en-IN', {maximumFractionDigits:2})}</td>
                    <td>₹{cgst.toLocaleString('en-IN', {maximumFractionDigits:2})}</td>
                    <td>₹{(cgst*2).toLocaleString('en-IN', {maximumFractionDigits:2})}</td>
                    <td className="font-bold">₹{i.amount?.toLocaleString('en-IN')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─── ARTWORK ──────────────────────────────────────────────────────
export function Artwork() {
  const { artworks, customers, addArtwork, updateArtwork, deleteArtwork } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const [search, setSearch] = useState('')
  const [fileData, setFileData] = useState(null)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef()

  const filtered = artworks.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.customer?.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() { setEditing(null); reset({}); setFileData(null); setFileName(''); setOpen(true) }
  function openEdit(a) { setEditing(a); reset(a); setFileData(a.fileData || null); setFileName(a.fileName || ''); setOpen(true) }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { alert('File must be under 10 MB'); return }
    const reader = new FileReader()
    reader.onload = ev => { setFileData(ev.target.result); setFileName(file.name) }
    reader.readAsDataURL(file)
  }

  function removeFile() { setFileData(null); setFileName(''); if (fileRef.current) fileRef.current.value = '' }

  function downloadFile(a) {
    const link = document.createElement('a')
    link.href = a.fileData
    link.download = a.fileName || 'artwork-file'
    link.click()
  }

  const onSubmit = (data) => {
    const payload = { ...data, fileData: fileData || (editing?.fileData || null), fileName: fileName || (editing?.fileName || '') }
    editing ? updateArtwork(editing.id, payload) : addArtwork(payload)
    setOpen(false); reset(); setFileData(null); setFileName('')
  }

  const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Approved: 'bg-green-100 text-green-700', 'Revision Required': 'bg-red-100 text-red-700', 'In Review': 'bg-blue-100 text-blue-700' }
  return (
    <div>
      <PageHeader title="Artwork & Design Management" subtitle={`${artworks.length} artwork files`}
        actions={<Button onClick={openAdd}><Plus size={15} />Add Artwork</Button>} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search artwork..." /></div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Art No.</th><th>Name</th><th>Customer</th><th>Version</th><th>File</th><th>Created</th><th>Status</th><th>Notes</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td className="font-mono text-xs font-bold text-blue-600">{a.artNo}</td>
                  <td className="font-semibold">{a.name}</td>
                  <td>{a.customer}</td>
                  <td><span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-mono">{a.version}</span></td>
                  <td>
                    {a.fileData ? (
                      <button onClick={() => downloadFile(a)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium max-w-28 truncate" title={a.fileName}>
                        <FileDown size={13} />{a.fileName}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">No file</span>
                    )}
                  </td>
                  <td>{a.createdAt}</td>
                  <td><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor[a.status] || 'bg-gray-100 text-gray-600'}`}>{a.status}</span></td>
                  <td className="text-xs text-gray-500 max-w-32 truncate">{a.notes}</td>
                  <td>
                    <div className="flex gap-1">
                      <Select className="text-xs py-0.5 px-1.5 h-7 mb-0 w-36" value={a.status}
                        onChange={e => updateArtwork(a.id, { status: e.target.value })}>
                        {['Pending', 'In Review', 'Approved', 'Revision Required'].map(s => <option key={s}>{s}</option>)}
                      </Select>
                      <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => setDel(a)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="text-center py-12 text-gray-400">No artwork files yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteArtwork(del.id); setDel(null) }}
        title="Delete Artwork" message={`Delete artwork "${del?.name}"?`} />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Artwork' : 'Add Artwork File'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Artwork Name *" {...register('name')} />
            <Select label="Customer" {...register('customer')}>
              <option value="">Select customer</option>
              {customers.map(c => <option key={c.id}>{c.company}</option>)}
            </Select>
            <Input label="Version" {...register('version')} placeholder="e.g. v1.0" defaultValue="v1.0" />
            <Input label="Order Reference" {...register('orderRef')} placeholder="ORD-2026-XXX" />
            <Select label="Status" {...register('status')}>
              <option>Pending</option><option>In Review</option><option>Approved</option><option>Revision Required</option>
            </Select>
            <Input label="Designer / Agency" {...register('designer')} />
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Artwork File <span className="font-normal text-gray-400">(PDF, AI, PNG, JPG — max 10 MB)</span></label>
              <input ref={fileRef} type="file" accept=".pdf,.ai,.png,.jpg,.jpeg,.svg,.eps,.zip,.tiff" className="hidden" onChange={handleFile} />
              {fileName ? (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <Paperclip size={16} className="text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-blue-700 font-medium flex-1 truncate">{fileName}</span>
                  <button type="button" onClick={removeFile} className="text-xs text-red-500 hover:text-red-700 font-semibold px-2">Remove</button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors">
                  <Paperclip size={16} />Upload Artwork File
                </button>
              )}
            </div>
            <div className="col-span-2"><Textarea label="Notes / Revision Instructions" {...register('notes')} /></div>
          </div>
          <div className="modal-footer"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">{editing ? 'Update' : 'Add Artwork'}</Button></div>
        </form>
      </Modal>
    </div>
  )
}

// ─── DOCUMENTS ────────────────────────────────────────────────────
export function Documents() {
  const { documents: docs, addDocument, updateDocument, deleteDocument, customers } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const [search, setSearch] = useState('')
  const [fileData, setFileData] = useState(null)
  const [fileName, setFileName] = useState('')
  const fileRef = useRef()

  const docList = docs || []
  const filtered = docList.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.type?.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() { setEditing(null); reset({}); setFileData(null); setFileName(''); setOpen(true) }
  function openEdit(d) { setEditing(d); reset(d); setFileData(d.fileData || null); setFileName(d.fileName || ''); setOpen(true) }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 20 * 1024 * 1024) { alert('File must be under 20 MB'); return }
    const reader = new FileReader()
    reader.onload = ev => { setFileData(ev.target.result); setFileName(file.name) }
    reader.readAsDataURL(file)
  }

  function downloadFile(d) {
    const link = document.createElement('a')
    link.href = d.fileData
    link.download = d.fileName || d.name || 'document'
    link.click()
  }

  const onSubmit = (data) => {
    const payload = { ...data, fileData: fileData || (editing?.fileData || null), fileName: fileName || (editing?.fileName || '') }
    editing ? updateDocument(editing.id, payload) : addDocument(payload)
    setOpen(false); reset(); setFileData(null); setFileName('')
  }

  const typeColor = { Certificate: 'bg-green-100 text-green-700', Contract: 'bg-blue-100 text-blue-700', Catalog: 'bg-orange-100 text-orange-700', Invoice: 'bg-purple-100 text-purple-700', HR: 'bg-yellow-100 text-yellow-700', Other: 'bg-gray-100 text-gray-700' }
  return (
    <div>
      <PageHeader title="Document Management" subtitle={`${docList.length} documents`}
        actions={<Button onClick={openAdd}><Plus size={15} />Add Document</Button>} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search documents..." /></div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Document Name</th><th>Type</th><th>File</th><th>Customer / Dept</th><th>Date</th><th>Expiry</th><th>Notes</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td className="font-semibold">{d.name}</td>
                  <td><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeColor[d.type] || typeColor.Other}`}>{d.type}</span></td>
                  <td>
                    {d.fileData ? (
                      <button onClick={() => downloadFile(d)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium max-w-32 truncate" title={d.fileName}>
                        <FileDown size={13} />{d.fileName}
                      </button>
                    ) : <span className="text-xs text-gray-400">No file</span>}
                  </td>
                  <td>{d.customer || d.department || '—'}</td>
                  <td className="text-sm">{d.date}</td>
                  <td className={`text-sm ${d.expiry && new Date(d.expiry) < new Date() ? 'text-red-600 font-semibold' : ''}`}>{d.expiry || '—'}</td>
                  <td className="text-xs text-gray-500 max-w-40 truncate">{d.notes}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => setDel(d)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-12 text-gray-400">No documents added yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteDocument(del.id); setDel(null) }}
        title="Delete Document" message={`Delete document "${del?.name}"?`} />
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Document' : 'Add Document'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Document Name *" {...register('name')} />
            <Select label="Type" {...register('type')}>
              <option>Certificate</option><option>Contract</option><option>Catalog</option>
              <option>Invoice</option><option>HR</option><option>Legal</option><option>Other</option>
            </Select>
            <Select label="Customer" {...register('customer')}>
              <option value="">None / Internal</option>
              {customers.map(c => <option key={c.id}>{c.company}</option>)}
            </Select>
            <Input label="Department" {...register('department')} placeholder="e.g. HR, Production" />
            <Input label="Document Date" type="date" {...register('date')} defaultValue={new Date().toISOString().split('T')[0]} />
            <Input label="Expiry Date" type="date" {...register('expiry')} />
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Attach File <span className="font-normal text-gray-400">(PDF, DOC, JPG — max 20 MB)</span></label>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls,.zip" className="hidden" onChange={handleFile} />
              {fileName ? (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <FileText size={16} className="text-blue-500 flex-shrink-0" />
                  <span className="text-sm text-blue-700 font-medium flex-1 truncate">{fileName}</span>
                  <button type="button" onClick={() => { setFileData(null); setFileName(''); if (fileRef.current) fileRef.current.value = '' }}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold px-2">Remove</button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors">
                  <Paperclip size={16} />Attach Document File
                </button>
              )}
            </div>
            <div className="col-span-2"><Textarea label="Notes" {...register('notes')} /></div>
          </div>
          <div className="modal-footer"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">{editing ? 'Update' : 'Add Document'}</Button></div>
        </form>
      </Modal>
    </div>
  )
}

// ─── FEEDBACK ─────────────────────────────────────────────────────
export function Feedback() {
  const { feedbacks, customers, orders, addFeedback, deleteFeedback } = useStore()
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset } = useForm()
  const [search, setSearch] = useState('')
  const filtered = feedbacks.filter(f =>
    f.customer?.toLowerCase().includes(search.toLowerCase()) ||
    f.category?.toLowerCase().includes(search.toLowerCase())
  )
  const onSubmit = (data) => { addFeedback({ ...data, rating: parseInt(data.rating) }); setOpen(false); reset() }
  const avgRating = feedbacks.length ? (feedbacks.reduce((s, f) => s + (f.rating || 0), 0) / feedbacks.length).toFixed(1) : '—'
  const Stars = ({ n }) => (
    <span>{[1,2,3,4,5].map(i => <span key={i} className={i <= n ? 'text-orange-400' : 'text-gray-300'}>★</span>)}</span>
  )
  return (
    <div>
      <PageHeader title="Customer Feedback" subtitle={`${feedbacks.length} responses · Avg Rating: ${avgRating}`}
        actions={<Button onClick={() => { reset({ date: new Date().toISOString().split('T')[0], rating: 5 }); setOpen(true) }}><Plus size={15} />Add Feedback</Button>} />
      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <div className="text-3xl font-extrabold text-orange-500">{avgRating}</div>
          <div className="text-xs text-gray-500 mt-1">Average Rating</div>
          {avgRating !== '—' && <div className="text-lg mt-1"><Stars n={Math.round(parseFloat(avgRating))} /></div>}
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-extrabold text-green-500">{feedbacks.filter(f=>f.rating>=4).length}</div>
          <div className="text-xs text-gray-500 mt-1">Happy Customers (4-5★)</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-3xl font-extrabold text-red-500">{feedbacks.filter(f=>f.rating<=2).length}</div>
          <div className="text-xs text-gray-500 mt-1">Need Attention (1-2★)</div>
        </div>
      </div>
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search feedback..." /></div>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Customer</th><th>Order Ref</th><th>Rating</th><th>Category</th><th>Comments</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td className="font-semibold">{f.customer}</td>
                  <td className="text-xs text-gray-500">{f.orderRef || '—'}</td>
                  <td><Stars n={f.rating} /></td>
                  <td><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{f.category || 'General'}</span></td>
                  <td className="text-sm text-gray-600 max-w-48 truncate">{f.comments}</td>
                  <td className="text-sm">{f.date}</td>
                  <td><button onClick={() => deleteFeedback(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-12 text-gray-400">No feedback collected yet</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Add Customer Feedback">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Select label="Customer *" {...register('customer')}>
              <option value="">Select customer</option>
              {customers.map(c => <option key={c.id}>{c.company}</option>)}
            </Select>
            <Select label="Order Reference" {...register('orderRef')}>
              <option value="">None</option>
              {orders.map(o => <option key={o.id}>{o.orderNo}</option>)}
            </Select>
            <Select label="Rating *" {...register('rating')}>
              <option value={5}>5 ★★★★★ - Excellent</option>
              <option value={4}>4 ★★★★☆ - Good</option>
              <option value={3}>3 ★★★☆☆ - Average</option>
              <option value={2}>2 ★★☆☆☆ - Poor</option>
              <option value={1}>1 ★☆☆☆☆ - Very Poor</option>
            </Select>
            <Select label="Category" {...register('category')}>
              <option>Quality</option><option>Delivery</option><option>Packaging</option>
              <option>Pricing</option><option>Service</option><option>General</option>
            </Select>
            <Input label="Date" type="date" {...register('date')} />
            <Input label="Received By" {...register('receivedBy')} />
            <div className="col-span-2"><Textarea label="Customer Comments" {...register('comments')} /></div>
          </div>
          <div className="modal-footer"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">Save Feedback</Button></div>
        </form>
      </Modal>
    </div>
  )
}

// ─── BRANCHES ─────────────────────────────────────────────────────
export function Branches() {
  const { branches, addBranch, updateBranch, deleteBranch } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const onSubmit = (data) => {
    editing ? updateBranch(editing.id, data) : addBranch(data)
    setOpen(false); reset()
  }
  return (
    <div>
      <PageHeader title="Branches & Plants" subtitle={`${branches.length} locations`}
        actions={<Button onClick={() => { setEditing(null); reset({}); setOpen(true) }}><Plus size={15} />Add Branch</Button>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {branches.map(b => (
          <div key={b.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{b.name}</h3>
                <p className="text-sm text-gray-500">{b.city}, {b.state}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.status}</span>
                <button onClick={() => { setEditing(b); reset(b); setOpen(true) }} className="p-1.5 rounded hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                <button onClick={() => deleteBranch(b.id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600">
              <div className="flex gap-2"><span className="font-medium w-20">Address:</span><span>{b.address}</span></div>
              <div className="flex gap-2"><span className="font-medium w-20">Phone:</span><span>{b.phone || '—'}</span></div>
              <div className="flex gap-2"><span className="font-medium w-20">Manager:</span><span className="text-orange-600 font-semibold">{b.manager || '—'}</span></div>
            </div>
          </div>
        ))}
      </div>
      {branches.length === 0 && (
        <div className="card p-10 text-center text-gray-400">No branches added yet</div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Branch' : 'Add Branch / Plant'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Branch Name *" {...register('name')} placeholder="e.g. Main Plant - Waghodiya" />
            <Input label="City *" {...register('city')} />
            <Input label="State" {...register('state')} defaultValue="Gujarat" />
            <Input label="Phone" {...register('phone')} />
            <div className="col-span-2"><Textarea label="Full Address *" {...register('address')} /></div>
            <Input label="Branch Manager" {...register('manager')} />
            <Select label="Status" {...register('status')}>
              <option>Active</option><option>Inactive</option>
            </Select>
          </div>
          <div className="modal-footer"><Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit">{editing ? 'Update' : 'Add Branch'}</Button></div>
        </form>
      </Modal>
    </div>
  )
}

export function Reports() {
  const { leads, customers, orders, invoices, employees } = useStore()
  const won = leads.filter(l => l.status === 'Won').length
  const rate = leads.length ? Math.round((won / leads.length) * 100) : 0
  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Business intelligence at a glance" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: 'Lead Conversion', items: [['Total Leads', leads.length], ['Won', won], ['Lost', leads.filter(l=>l.status==='Lost').length], ['Conversion Rate', `${rate}%`]] },
          { title: 'Sales Summary', items: [['Total Customers', customers.length], ['Total Orders', orders.length], ['Active Orders', orders.filter(o=>!['Delivered','Cancelled'].includes(o.status)).length], ['Total Revenue', `₹${invoices.reduce((s,i)=>s+(i.amount||0),0).toLocaleString('en-IN')}`]] },
          { title: 'Collection Status', items: [['Total Invoiced', `₹${invoices.reduce((s,i)=>s+(i.amount||0),0).toLocaleString('en-IN')}`], ['Collected', `₹${invoices.reduce((s,i)=>s+(i.paid||0),0).toLocaleString('en-IN')}`], ['Outstanding', `₹${invoices.filter(i=>i.status!=='Paid').reduce((s,i)=>s+(i.balance||0),0).toLocaleString('en-IN')}`], ['Paid Invoices', invoices.filter(i=>i.status==='Paid').length]] },
          { title: 'HR Summary', items: [['Total Staff', employees.length], ['Sales Team', employees.filter(e=>e.department==='Sales').length], ['Production', employees.filter(e=>e.department==='Production').length], ['Monthly Payroll', `₹${employees.reduce((s,e)=>s+(e.salary||0),0).toLocaleString('en-IN')}`]] },
        ].map(({ title, items }) => (
          <div key={title} className="card">
            <div className="card-header"><h3 className="card-title">{title}</h3></div>
            <div className="card-body">
              {items.map(([k, v]) => (
                <div key={k} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{k}</span>
                  <span className="font-bold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

