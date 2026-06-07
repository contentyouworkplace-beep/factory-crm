import { useState } from 'react'
import {
  CheckCircle2, Package, FileText, Users, BarChart3, Truck, Settings,
  Layers, ShieldCheck, Zap, ArrowRight, Phone,
  Factory, Printer, ChevronDown, ChevronUp, MessageCircle
} from 'lucide-react'

const WA_NUMBER = '916353583148'
function waLink(msg = 'Hi, I am interested in PackCRM for my packaging company.') {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

const FEATURES = [
  { icon: Users, title: 'Lead & Customer CRM', desc: 'Manage all leads, track follow-ups, log calls & meetings. Never miss a hot inquiry from Amul, Cadbury or any buyer.' },
  { icon: FileText, title: 'Quotation & Order Management', desc: 'Create professional PDF quotations in one click. Convert to order instantly. Track status from Confirmed → Dispatched → Delivered.' },
  { icon: Package, title: 'Inventory & Raw Material', desc: 'Real-time stock of kraft paper, inks, films, boards. Low stock alerts so your production never stops for material shortage.' },
  { icon: Factory, title: 'Production Job Cards', desc: 'Create job cards for each order. Track pre-press → printing → lamination → die-cutting → packing stages live.' },
  { icon: Printer, title: 'Artwork Version Control', desc: 'Upload PDF/AI artwork files per customer. Track versions (v1, v2, v3) and approvals. No more WhatsApp confusion.' },
  { icon: Truck, title: 'Dispatch & Delivery Challan', desc: 'Generate professional delivery challans in one click. Track dispatch status and vehicle details.' },
  { icon: FileText, title: 'Invoice & Collections', desc: 'GST invoices with line items, payment recording, aging reports. Know exactly who owes you money.' },
  { icon: BarChart3, title: 'Reports & Analytics', desc: 'Lead conversion rate, revenue, collection status, HR payroll — all on one screen. No more Excel.' },
  { icon: Users, title: 'Employee & HR Module', desc: 'Salary slips, offer letters, attendance, department-wise headcount — everything for your factory staff.' },
  { icon: ShieldCheck, title: 'Quality & Complaint Tracking', desc: 'Log customer complaints, root cause, corrective action. Show ISO auditors your quality system.' },
  { icon: Settings, title: 'Machine & Asset Register', desc: 'Track all printing/die-cutting machines, maintenance history, warranty, service dates.' },
  { icon: Layers, title: 'GST & Tax Reports', desc: 'Auto-calculate CGST/SGST on invoices. GSTR-1 outward supply summary ready for your CA.' },
]

const PAIN_POINTS = [
  { icon: '😤', title: 'WhatsApp artwork chaos', desc: 'Customers keep asking "which version is approved?" You have 200 unread messages.' },
  { icon: '📊', title: 'Excel everywhere', desc: '5 different sheets for orders, stock, employees. Nothing talks to each other. Data gets lost.' },
  { icon: '💸', title: 'Chasing payments', desc: "You don't know who owes what. Outstanding keeps growing. Your CA asks for invoice list every month." },
  { icon: '🏭', title: 'Production confusion', desc: 'Workers don\'t know which order to run next. No visibility on raw material availability.' },
  { icon: '📋', title: 'Manual quotations', desc: 'Making quotations in Word/Excel takes 30 minutes. Customers want it in 5 minutes on WhatsApp.' },
  { icon: '📦', title: 'Stock-outs surprise you', desc: 'You find out paper/ink is finished only when production stops. Emergency buying at high prices.' },
]

const TESTIMONIALS = [
  { name: 'Suresh Patel', company: 'Patel Packaging, Vadodara', rating: 5, text: 'We were using 4 different Excel files. PackCRM brought everything together. Now I can see today\'s orders, pending invoices and stock — all in one screen. Saved us 3 hours every day.' },
  { name: 'Meena Shah', company: 'Shah Print Pack, Ahmedabad', rating: 5, text: 'The artwork version control alone is worth the price. No more "which file is approved" on WhatsApp. Our design approval time went from 3 days to same day.' },
  { name: 'Rajesh Desai', company: 'Desai Corrugators, Surat', rating: 5, text: 'GST reporting used to take our accountant half a day every month. Now he downloads the GSTR-1 summary in 2 minutes. Our CA is very happy.' },
]

const HOW_IT_WORKS = [
  { step: '01', title: 'Setup in 5 Minutes', desc: 'Enter your company details, add your customers, products and team. We pre-load packaging industry defaults.' },
  { step: '02', title: 'Manage Daily Operations', desc: 'Log inquiries, create quotations, track production, manage stock — everything from one browser tab.' },
  { step: '03', title: 'Grow Confidently', desc: 'Use reports to spot your best customers, fastest-moving products, and collection gaps.' },
]

const FAQS = [
  { q: 'Is this specific to packaging companies?', a: 'Yes — PackCRM is built specifically for corrugated box, mono carton, flexible packaging and label manufacturers in India. The workflow, terminology and features match your exact business.' },
  { q: 'Do we need to install any software?', a: 'No installation needed. PackCRM runs in any web browser — Chrome, Safari, Edge. Works on laptop, tablet and mobile. Your data is stored securely on cloud.' },
  { q: 'What happens after the first 100 customers?', a: 'The price goes back to Rs.25,000/year. The Rs.15,000 offer is locked in permanently for the first 100 customers — your renewal price stays at Rs.15,000.' },
  { q: 'What\'s included in support?', a: 'All plans include WhatsApp support, bug fixes, and feature updates. We are a small team that deeply understands the packaging industry — you get direct support from the founders.' },
  { q: 'Can we add more users?', a: 'Yes. The plan includes up to 5 users. Additional users can be added at Rs.1,500/user/year.' },
  { q: 'Is our data secure?', a: 'Your data is stored on Supabase (Postgres) with daily backups and enterprise-grade encryption. We never sell or share your data.' },
]

function StarRating({ n }) {
  return <span>{[1,2,3,4,5].map(i => <span key={i} className={i <= n ? 'text-yellow-400' : 'text-gray-300'}>★</span>)}</span>
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
        <span className="font-semibold text-gray-900">{q}</span>
        {open ? <ChevronUp size={18} className="text-orange-500 flex-shrink-0" /> : <ChevronDown size={18} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">{a}</div>}
    </div>
  )
}

function HeroForm() {
  const [form, setForm] = useState({ name: '', company: '', phone: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.phone) return
    const msg = `Hi, I want a demo of PackCRM!\nName: ${form.name}\nCompany: ${form.company}\nPhone: ${form.phone}`
    window.open(waLink(msg), '_blank')
    setSent(true)
  }

  if (sent) return (
    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center max-w-md mx-auto">
      <CheckCircle2 size={36} className="text-green-500 mx-auto mb-3" />
      <p className="font-bold text-green-800 text-lg">Opening WhatsApp…</p>
      <p className="text-green-600 text-sm mt-1">Send the pre-filled message and we'll reply within minutes.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-md mx-auto">
      <p className="text-sm font-semibold text-gray-500 mb-4 text-center uppercase tracking-wide">Get a Free Demo — Reply in Minutes</p>
      <div className="space-y-3 mb-4">
        <input
          type="text" placeholder="Your Name"
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="text" placeholder="Company Name"
          value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="tel" placeholder="WhatsApp Number *" required
          value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>
      <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2">
        <MessageCircle size={20} /> WhatsApp Me a Free Demo
      </button>
      <p className="text-center text-xs text-gray-400 mt-3">No spam. No sales calls. Just a quick demo link on WhatsApp.</p>
    </form>
  )
}

export default function OfferPage() {
  const [slots] = useState(67)

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Urgency Banner */}
      <div className="bg-orange-600 text-white text-center py-2.5 px-4 text-sm font-semibold">
        Early Access Offer — Only <span className="bg-white text-orange-600 px-2 py-0.5 rounded font-bold mx-1">{100 - slots} of 100</span> slots remaining at Rs.15,000/year
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900">Pack<span className="text-orange-500">CRM</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
            <a href="#features" className="hover:text-orange-500 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-orange-500 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-orange-500 transition-colors">Reviews</a>
            <a href="#pricing" className="hover:text-orange-500 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-orange-500 transition-colors">FAQ</a>
          </div>
          <a href={waLink('Hi, I want early access to PackCRM!')} target="_blank" rel="noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-1.5">
            <MessageCircle size={15} />WhatsApp Us
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-24 px-6 bg-gradient-to-br from-orange-50 via-white to-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Zap size={14} />Built for Indian Packaging Manufacturers
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Run Your Packaging Factory<br />
              <span className="text-orange-500">From One Screen</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              PackCRM replaces your Excel files, WhatsApp chaos, and paper job cards with one complete system — built specifically for corrugated, mono carton, and flexible packaging companies.
            </p>
          </div>

          {/* Hero CTA Form */}
          <HeroForm />

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mt-8">
            {['No setup fee', 'All updates included', 'WhatsApp support', 'Cancel anytime'].map(t => (
              <div key={t} className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-green-500" />{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Numbers */}
      <section className="py-14 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: '25+', label: 'Packaging companies onboarded' },
            { n: '3 hrs', label: 'Saved daily on admin work' },
            { n: '100%', label: 'Cloud-based, no install needed' },
            { n: '4.9★', label: 'Customer satisfaction rating' },
          ].map(({ n, label }) => (
            <div key={label}>
              <div className="text-4xl font-extrabold text-orange-400 mb-1">{n}</div>
              <div className="text-gray-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Sound Familiar?</h2>
            <p className="text-gray-500 text-lg">These are the exact problems our customers had before PackCRM</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PAIN_POINTS.map(({ icon, title, desc }) => (
              <div key={title} className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-6 py-3 rounded-xl font-semibold">
              <CheckCircle2 size={18} />PackCRM solves every one of these problems
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Layers size={14} />12 Powerful Modules
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything Your Factory Needs</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">Not a generic CRM. Every feature is designed for how packaging companies actually work.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-orange-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Up and Running in Minutes</h2>
            <p className="text-gray-500 text-lg">No IT team needed. No complex training. Just sign in and start.</p>
          </div>
          <div className="space-y-6">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-6 items-start bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center text-xl font-extrabold flex-shrink-0">
                  {step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-xl mb-2">{title}</h3>
                  <p className="text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-white mb-4">Packaging Companies Love PackCRM</h2>
            <p className="text-gray-400 text-lg">Real feedback from factory owners across Gujarat</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, company, rating, text }) => (
              <div key={name} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="mb-3"><StarRating n={rating} /></div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{text}"</p>
                <div>
                  <p className="font-bold text-white">{name}</p>
                  <p className="text-gray-400 text-xs">{company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, Honest Pricing</h2>
            <p className="text-gray-500 text-lg">Everything included. No hidden charges. No per-module fees.</p>
          </div>
          <div className="bg-white rounded-3xl border-2 border-orange-500 shadow-xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-5 py-1.5 rounded-full text-sm font-bold">
              EARLY ACCESS — First 100 Companies Only
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl font-bold text-gray-400 line-through">Rs.25,000</span>
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm font-bold">40% OFF</span>
              </div>
              <div className="text-6xl font-extrabold text-gray-900 mb-1">Rs.15,000</div>
              <div className="text-gray-500 font-medium">per year · all inclusive</div>
              <div className="mt-3 text-sm text-orange-600 font-semibold">
                Only {100 - slots} slots remaining
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-orange-500 h-2.5 rounded-full transition-all" style={{ width: `${slots}%` }} />
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'All 12 modules — CRM, Production, Inventory, HR, GST',
                'Up to 5 user accounts',
                'Unlimited customers, orders, invoices',
                'PDF generation — Invoice, Quotation, Challan, PO, Salary Slip',
                'Artwork file uploads & version tracking',
                'Cloud hosting on Supabase (99.9% uptime)',
                'WhatsApp support from founders',
                'All future updates & new features',
                'Price locked at Rs.15,000 for all renewals',
              ].map(f => (
                <li key={f} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{f}</span>
                </li>
              ))}
            </ul>

            <a href={waLink('Hi, I want early access to PackCRM. Please share demo details.\nCompany: \nCity: ')}
              target="_blank" rel="noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={22} /> Book My Slot on WhatsApp — Rs.15,000/yr
            </a>
            <p className="text-center text-xs text-gray-400 mt-3">No credit card needed. We'll send you a demo link on WhatsApp first.</p>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Questions? WhatsApp us at <a href={waLink('Hi, I have a question about PackCRM')} target="_blank" rel="noreferrer" className="text-green-600 font-semibold">+91 63535 83148</a>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Why PackCRM Over Generic Software?</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-3 px-4 text-gray-600 font-semibold w-1/3">Feature</th>
                  <th className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Package size={16} className="text-orange-500" />
                      <span className="text-orange-600 font-bold">PackCRM</span>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-center text-gray-500">Generic CRM (Zoho/HubSpot)</th>
                  <th className="py-3 px-4 text-center text-gray-500">Tally / ERP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Built for packaging industry', '✅', '❌', '❌'],
                  ['Artwork version control', '✅', '❌', '❌'],
                  ['Production job cards', '✅', '❌', '✅ (complex)'],
                  ['Delivery challan PDF', '✅', '❌', '✅ (complex)'],
                  ['Simple to use (no training)', '✅', '❌', '❌'],
                  ['Price per year', 'Rs.15,000', 'Rs.60,000+', 'Rs.30,000+'],
                ].map(([feature, ...vals]) => (
                  <tr key={feature} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-700">{feature}</td>
                    {vals.map((v, i) => (
                      <td key={i} className={`py-3 px-4 text-center ${i === 0 ? 'font-bold text-orange-600' : 'text-gray-500'}`}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(faq => <FAQ key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-orange-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Stop Running Your Factory on WhatsApp & Excel</h2>
          <p className="text-orange-100 text-lg mb-8 max-w-xl mx-auto">
            Join {slots} packaging companies who already upgraded. Offer ends when 100 slots are filled.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={waLink('Hi, I want early access to PackCRM!')} target="_blank" rel="noreferrer"
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={20} />Book My Slot on WhatsApp
            </a>
            <a href="/" className="bg-orange-600 hover:bg-orange-700 text-white border-2 border-orange-400 px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2">
              View Live Demo <ArrowRight size={20} />
            </a>
          </div>
          <p className="text-orange-200 text-sm mt-6">
            No credit card. No commitment. We'll show you a live demo of your factory data first.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <Package size={15} className="text-white" />
          </div>
          <span className="text-lg font-extrabold text-white">Pack<span className="text-orange-400">CRM</span></span>
        </div>
        <p className="text-gray-500 text-sm mb-2">Built with love for Indian Packaging Industry · Vadodara, Gujarat</p>
        <p className="text-gray-600 text-xs">© 2026 PackCRM. All rights reserved.</p>
      </footer>

    </div>
  )
}
