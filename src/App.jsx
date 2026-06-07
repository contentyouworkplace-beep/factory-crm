import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
import LoginPage from './pages/LoginPage'
import {
  Contacts, Activities, Production, Procurement, Quality,
  Dispatch, Payments, Expenses, Machines, GST,
  Artwork, Documents, Feedback, Branches, Reports
} from './pages/GenericPage'
import useStore from './store/useStore'

export function getUser() {
  try { return JSON.parse(localStorage.getItem('packcrm_user')) } catch { return null }
}

function RequireAuth({ children }) {
  return getUser() ? children : <Navigate to="/login" replace />
}

function AppInner() {
  const { fetchAll } = useStore()

  useEffect(() => { fetchAll() }, [])

  return (
    <Layout>
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
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/offer" element={<OfferPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<RequireAuth><AppInner /></RequireAuth>} />
    </Routes>
  )
}
