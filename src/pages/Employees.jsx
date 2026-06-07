import { useState } from 'react'
import { Plus, Pencil, Trash2, Download, FileText } from 'lucide-react'
import { Button, Modal, Input, Select, StatusBadge, SearchBar, PageHeader, ConfirmDialog } from '../components/ui'
import useStore from '../store/useStore'
import { useForm } from 'react-hook-form'
import { generateSalarySlipPDF, generateOfferLetterPDF } from '../utils/pdf'

const depts = ['Sales', 'Production', 'Accounts', 'HR', 'Quality', 'Dispatch', 'Admin', 'IT']
const types = ['Full-Time', 'Part-Time', 'Contract', 'Daily Wage']

export default function Employees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee, company } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [del, setDel] = useState(null)
  const [search, setSearch] = useState('')
  const [slipModal, setSlipModal] = useState(null)
  const [month, setMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }))
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const filtered = employees.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.department?.toLowerCase().includes(search.toLowerCase()) ||
    e.designation?.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() { setEditing(null); reset({}); setOpen(true) }
  function openEdit(e) { setEditing(e); reset(e); setOpen(true) }
  function onSubmit(data) {
    editing ? updateEmployee(editing.id, { ...data, salary: parseFloat(data.salary) })
            : addEmployee({ ...data, salary: parseFloat(data.salary) })
    setOpen(false); reset()
  }

  return (
    <div>
      <PageHeader title="Employees" subtitle={`${employees.length} staff members`}
        actions={<Button onClick={openAdd}><Plus size={15} />Add Employee</Button>} />

      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search employees..." /></div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Emp ID</th><th>Name</th><th>Designation</th><th>Department</th><th>Phone</th><th>Joining Date</th><th>Salary (₹)</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td className="font-mono text-xs font-bold text-blue-600">{e.empId}</td>
                  <td className="font-semibold">{e.name}</td>
                  <td>{e.designation}</td>
                  <td>{e.department}</td>
                  <td>{e.phone}</td>
                  <td>{e.joinDate}</td>
                  <td className="font-semibold text-orange-600">₹{e.salary?.toLocaleString('en-IN')}</td>
                  <td><StatusBadge status={e.status || 'Active'} /></td>
                  <td>
                    <div className="flex gap-1">
                      <button title="Salary Slip" onClick={() => setSlipModal(e)} className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-500"><Download size={13} /></button>
                      <button title="Offer Letter" onClick={() => generateOfferLetterPDF(e, company)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-500"><FileText size={13} /></button>
                      <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"><Pencil size={13} /></button>
                      <button onClick={() => setDel(e)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={9} className="text-center py-12 text-gray-400">No employees found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Employee */}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Employee' : 'Add Employee'} size="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body grid grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Full Name *" {...register('name', { required: 'Required' })} error={errors.name?.message} />
            <Input label="Designation *" {...register('designation', { required: 'Required' })} error={errors.designation?.message} />
            <Select label="Department" {...register('department')}>
              {depts.map(d => <option key={d}>{d}</option>)}
            </Select>
            <Select label="Employment Type" {...register('employmentType')}>
              {types.map(t => <option key={t}>{t}</option>)}
            </Select>
            <Input label="Phone *" {...register('phone', { required: 'Required' })} error={errors.phone?.message} />
            <Input label="Email" type="email" {...register('email')} />
            <Input label="Date of Joining" type="date" {...register('joinDate')} />
            <Input label="Monthly Salary (₹) *" type="number" {...register('salary', { required: 'Required' })} error={errors.salary?.message} />
            <Input label="Aadhar Number" {...register('aadhar')} />
            <Input label="PAN Number" {...register('pan')} />
            <Input label="Bank Account No." {...register('bankAccount')} />
            <Input label="IFSC Code" {...register('ifsc')} />
            <div className="col-span-2"><Input label="Address" {...register('address')} /></div>
            <Select label="Status" {...register('status')}>
              <option>Active</option><option>Inactive</option><option>On Leave</option>
            </Select>
          </div>
          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">{editing ? 'Update' : 'Add Employee'}</Button>
          </div>
        </form>
      </Modal>

      {/* Salary Slip Modal */}
      <Modal open={!!slipModal} onClose={() => setSlipModal(null)} title="Generate Salary Slip">
        <div className="modal-body">
          <p className="text-sm text-gray-600 mb-4">Generate salary slip for <strong>{slipModal?.name}</strong></p>
          <Input label="Month & Year" value={month} onChange={e => setMonth(e.target.value)} placeholder="e.g. June 2026" />
        </div>
        <div className="modal-footer">
          <Button variant="ghost" onClick={() => setSlipModal(null)}>Cancel</Button>
          <Button onClick={() => { generateSalarySlipPDF(slipModal, month, company); setSlipModal(null) }}><Download size={15} />Download PDF</Button>
        </div>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)}
        onConfirm={() => { deleteEmployee(del.id); setDel(null) }}
        title="Delete Employee" message={`Remove "${del?.name}" from the system?`} />
    </div>
  )
}
