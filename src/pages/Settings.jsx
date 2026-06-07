import { useState, useRef } from 'react'
import { Save, Building2, FileText, Palette, Upload, X, Image } from 'lucide-react'
import { Button, Input, Textarea } from '../components/ui'
import useStore from '../store/useStore'
import { useForm } from 'react-hook-form'

export default function Settings() {
  const { company, updateCompany } = useStore()
  const { register, handleSubmit, formState: { isDirty } } = useForm({ defaultValues: company })
  const [saved, setSaved] = useState(false)
  const [logoPreview, setLogoPreview] = useState(company.logo || null)
  const [logoData, setLogoData] = useState(company.logo || null)
  const fileRef = useRef()

  function onSubmit(data) {
    updateCompany({ ...data, logo: logoData })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleLogoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 500 * 1024) {
      alert('Logo must be under 500 KB')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setLogoPreview(ev.target.result)
      setLogoData(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function removeLogo() {
    setLogoPreview(null)
    setLogoData(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-2.5 rounded-xl"><Building2 size={20} className="text-orange-600" /></div>
        <div><h1 className="page-title">Company Settings</h1><p className="page-sub">This info appears on all PDF documents</p></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Logo Section */}
        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title flex items-center gap-2"><Image size={15} />Company Logo</h3></div>
          <div className="card-body">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                {logoPreview ? (
                  <img src={logoPreview} alt="Company Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="text-center">
                    <Image size={28} className="text-gray-300 mx-auto mb-1" />
                    <p className="text-xs text-gray-400">No logo</p>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-3">Upload your company logo. It will appear on all invoices, quotations, and PDF documents.</p>
                <p className="text-xs text-gray-400 mb-3">Accepted: PNG, JPG, SVG · Max size: 500 KB · Recommended: 200×200 px</p>
                <div className="flex gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                    <Upload size={14} />
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  {logoPreview && (
                    <Button type="button" variant="outline" size="sm" onClick={removeLogo}>
                      <X size={14} />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title flex items-center gap-2"><Building2 size={15} />Company Information</h3></div>
          <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Company Name *" {...register('name')} />
            <Input label="Phone *" {...register('phone')} />
            <Input label="Email" {...register('email')} />
            <Input label="GST Number" {...register('gst')} />
            <Input label="PAN Number" {...register('pan')} />
            <Input label="Website" {...register('website')} />
            <div className="col-span-2">
              <Textarea label="Full Address *" {...register('address')} />
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header"><h3 className="card-title flex items-center gap-2"><FileText size={15} />Bank & Payment Details</h3></div>
          <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Bank Name" {...register('bankName')} />
            <Input label="Account Number" {...register('bankAccount')} />
            <Input label="IFSC Code" {...register('ifsc')} />
            <Input label="Branch" {...register('branch')} />
            <div className="col-span-2">
              <Input label="Full Bank Details (for PDF)" {...register('bank')} placeholder="e.g. HDFC Bank, A/C: 50100..., IFSC: HDFC0001234" />
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <div className="card-header"><h3 className="card-title flex items-center gap-2"><Palette size={15} />PDF & Document Settings</h3></div>
          <div className="card-body grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0">
            <Input label="Invoice Prefix" {...register('invoicePrefix')} placeholder="INV" />
            <Input label="Quote Prefix" {...register('quotePrefix')} placeholder="QT" />
            <Input label="Order Prefix" {...register('orderPrefix')} placeholder="ORD" />
            <Input label="PO Prefix" {...register('poPrefix')} placeholder="PO" />
            <div className="col-span-2">
              <Input label="PDF Footer Text" {...register('pdfFooter')} placeholder="Thank you for your business!" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg">
            <Save size={16} />
            {saved ? '✓ Saved!' : 'Save Settings'}
          </Button>
          {saved && <span className="text-sm text-green-600 font-medium">Settings saved successfully!</span>}
        </div>
      </form>
    </div>
  )
}
