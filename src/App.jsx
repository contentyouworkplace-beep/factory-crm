import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Customers from './pages/Customers'
import Quotations from './pages/Quotations'
import Orders from './pages/Orders'
import Invoices from './pages/Invoices'
import Employees from './pages/Employees'
import Inventory from './pages/Inventory'
import Settings from './pages/Settings'
import Products from './pages/Products'
import OfferPage from './pages/OfferPage'
import {
  Contacts, Activities, Production, Procurement, Quality,
  Dispatch, Payments, Expenses, Machines, GST,
  Artwork, Documents, Feedback, Branches, Reports
} from './pages/GenericPage'
import useStore from './store/useStore'

function AppInner() {
  const { loading, syncError, fetchAll } = useStore()

  useEffect(() => {
    fetchAll()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-white text-lg font-semibold tracking-wide">Loading PackCRM…</p>
        <p className="text-gray-400 text-sm">Connecting to database</p>
      </div>
    )
  }

  return (
    <>
      <Layout syncError={syncError}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/products" element={<Products />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/production" element={<Production />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/gst" element={<GST />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/machines" element={<Machines />} />
          <Route path="/artwork" element={<Artwork />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/offer" element={<OfferPage />} />
      <Route path="/*" element={<AppInner />} />
    </Routes>
  )
}
