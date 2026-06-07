import { create } from 'zustand'
import { v4 as uuid } from 'uuid'
import { supabase } from '../lib/supabase'

// ─── Default company ───────────────────────────────────────────────
const defaultCompany = {
  name: 'PackCRM Demo Co.',
  address: 'Plot No. 12, GIDC, Waghodiya, Vadodara - 390019, Gujarat',
  phone: '+91 98765 43210',
  email: 'info@packcrmdemo.com',
  gst: '24ABCDE1234F1Z5',
  pan: 'ABCDE1234F',
  bank: 'HDFC Bank, A/C: 50100123456789, IFSC: HDFC0001234',
  logo: null,
}

// ─── Seed data ─────────────────────────────────────────────────────
const seed = {
  leads: [
    { id: uuid(), name: 'Havells India Ltd.', contact: 'Suresh Patel', phone: '9876543210', email: 'suresh@havells.com', city: 'Noida', industry: 'Electrical', source: 'Cold Call', status: 'Qualified', priority: 'Hot', assignedTo: 'Rahul', notes: 'Interested in mono cartons', createdAt: '2026-06-01' },
    { id: uuid(), name: 'Amul Dairy', contact: 'Deepak Shah', phone: '9876543211', email: 'deepak@amul.com', city: 'Anand', industry: 'Food & Dairy', source: 'Reference', status: 'Quote Sent', priority: 'Hot', assignedTo: 'Rahul', notes: 'Need 5000 corrugated boxes monthly', createdAt: '2026-06-03' },
    { id: uuid(), name: 'Nirma Ltd.', contact: 'Kamlesh Joshi', phone: '9876543212', email: 'kamlesh@nirma.com', city: 'Ahmedabad', industry: 'FMCG', source: 'Exhibition', status: 'New', priority: 'Warm', assignedTo: 'Priya', notes: '', createdAt: '2026-06-05' },
  ],
  customers: [
    { id: uuid(), company: 'Amul Dairy Ltd.', contact: 'Deepak Shah', phone: '9876543211', email: 'deepak@amul.com', city: 'Anand', state: 'Gujarat', gst: '24AMULX1234A1Z1', industry: 'Food & Dairy', category: 'A', paymentTerms: 'Net 30', creditLimit: 500000, status: 'Active', createdAt: '2026-05-01' },
    { id: uuid(), company: 'Cadbury India', contact: 'Rohit Verma', phone: '9876543213', email: 'rohit@cadbury.com', city: 'Thane', state: 'Maharashtra', gst: '27CADBU5678B2Z2', industry: 'Food & Beverage', category: 'A', paymentTerms: 'Net 45', creditLimit: 800000, status: 'Active', createdAt: '2026-04-15' },
    { id: uuid(), company: 'Sun Pharma', contact: 'Anita Mehta', phone: '9876543214', email: 'anita@sunpharma.com', city: 'Mumbai', state: 'Maharashtra', gst: '27SUNPH9012C3Z3', industry: 'Pharma', category: 'A', paymentTerms: 'Net 60', creditLimit: 1000000, status: 'Active', createdAt: '2026-03-10' },
    { id: uuid(), company: 'Pidilite Industries', contact: 'Vijay Kumar', phone: '9876543215', email: 'vijay@pidilite.com', city: 'Surat', state: 'Gujarat', gst: '24PIDIL3456D4Z4', industry: 'Chemical', category: 'B', paymentTerms: 'Net 30', creditLimit: 300000, status: 'Active', createdAt: '2026-04-01' },
    { id: uuid(), company: 'Vadilal Foods', contact: 'Sanjay Patel', phone: '9876543216', email: 'sanjay@vadilal.com', city: 'Vadodara', state: 'Gujarat', gst: '24VADIL7890E5Z5', industry: 'Food & Beverage', category: 'B', paymentTerms: 'Advance', creditLimit: 200000, status: 'Active', createdAt: '2026-05-20' },
  ],
  quotations: [
    { id: uuid(), quoteNo: 'QT-2026-001', customer: 'Amul Dairy Ltd.', product: 'Corrugated Box B3', qty: 5000, unitPrice: 24.75, total: 123750, gst: 22275, grandTotal: 146025, status: 'Sent', date: '2026-06-01', validUntil: '2026-06-30', notes: '3-ply corrugated, 4 color printing' },
    { id: uuid(), quoteNo: 'QT-2026-002', customer: 'Cadbury India', product: 'Mono Carton 4C', qty: 10000, unitPrice: 8.85, total: 88500, gst: 15930, grandTotal: 104430, status: 'Approved', date: '2026-06-02', validUntil: '2026-06-30', notes: '350 GSM SBS board' },
    { id: uuid(), quoteNo: 'QT-2026-003', customer: 'Sun Pharma', product: 'Blister Pack Carton', qty: 20000, unitPrice: 10.75, total: 215000, gst: 38700, grandTotal: 253700, status: 'Draft', date: '2026-06-05', validUntil: '2026-07-05', notes: '' },
  ],
  orders: [
    { id: uuid(), orderNo: 'ORD-2026-001', customer: 'Amul Dairy Ltd.', product: 'Corrugated Box B3', qty: 5000, value: 146025, status: 'In Production', orderDate: '2026-06-03', deliveryDate: '2026-06-15', notes: '' },
    { id: uuid(), orderNo: 'ORD-2026-002', customer: 'Cadbury India', product: 'Mono Carton 4C', qty: 10000, value: 104430, status: 'Dispatched', orderDate: '2026-06-04', deliveryDate: '2026-06-12', notes: '' },
    { id: uuid(), orderNo: 'ORD-2026-003', customer: 'Pidilite Industries', product: 'LDPE Bags 500g', qty: 2000, value: 49560, status: 'Confirmed', orderDate: '2026-06-06', deliveryDate: '2026-06-18', notes: '' },
  ],
  invoices: [
    { id: uuid(), invoiceNo: 'INV-2026-001', customer: 'Cadbury India', orderNo: 'ORD-2026-002', amount: 104430, paid: 104430, balance: 0, status: 'Paid', date: '2026-06-12', dueDate: '2026-07-27' },
    { id: uuid(), invoiceNo: 'INV-2026-002', customer: 'Amul Dairy Ltd.', orderNo: 'ORD-2026-001', amount: 146025, paid: 0, balance: 146025, status: 'Unpaid', date: '2026-06-15', dueDate: '2026-07-15' },
  ],
  employees: [
    { id: uuid(), empId: 'EMP-001', name: 'Rahul Medhe', designation: 'Sales Manager', department: 'Sales', phone: '9876543210', email: 'rahul@packcrm.com', joinDate: '2024-01-01', salary: 45000, status: 'Active' },
    { id: uuid(), empId: 'EMP-002', name: 'Priya Shah', designation: 'Sales Executive', department: 'Sales', phone: '9876543217', email: 'priya@packcrm.com', joinDate: '2024-03-01', salary: 28000, status: 'Active' },
    { id: uuid(), empId: 'EMP-003', name: 'Ramesh Patel', designation: 'Production Manager', department: 'Production', phone: '9876543218', email: 'ramesh@packcrm.com', joinDate: '2023-06-01', salary: 38000, status: 'Active' },
  ],
  inventory: [
    { id: uuid(), itemCode: 'RM-001', name: 'Kraft Paper 150 GSM', category: 'Paper', unit: 'KG', stock: 2500, minStock: 500, rate: 65, supplier: 'Paper Mills Pvt Ltd' },
    { id: uuid(), itemCode: 'RM-002', name: 'Corrugating Medium 120 GSM', category: 'Paper', unit: 'KG', stock: 1800, minStock: 400, rate: 52, supplier: 'Paper Mills Pvt Ltd' },
    { id: uuid(), itemCode: 'RM-003', name: 'Printing Ink (Black)', category: 'Ink', unit: 'KG', stock: 45, minStock: 20, rate: 380, supplier: 'Ink Solutions Ltd' },
    { id: uuid(), itemCode: 'RM-004', name: 'Printing Ink (Cyan)', category: 'Ink', unit: 'KG', stock: 12, minStock: 20, rate: 420, supplier: 'Ink Solutions Ltd' },
    { id: uuid(), itemCode: 'RM-005', name: 'BOPP Tape 2 inch', category: 'Packing', unit: 'Roll', stock: 200, minStock: 50, rate: 85, supplier: 'Tape World' },
  ],
  products: [
    { id: uuid(), code: 'PROD-001', name: 'Corrugated Box 3-Ply', category: 'Corrugated', hsn: '4819', unit: 'Pcs', rate: 24.75, gstRate: 18, description: '3-ply corrugated box, standard brown kraft' },
    { id: uuid(), code: 'PROD-002', name: 'Mono Carton 4C', category: 'Mono Carton', hsn: '4819', unit: 'Pcs', rate: 8.85, gstRate: 18, description: '350 GSM SBS board, 4-color offset printing' },
    { id: uuid(), code: 'PROD-003', name: 'Blister Pack Carton', category: 'Pharma', hsn: '4819', unit: 'Pcs', rate: 10.75, gstRate: 12, description: 'Pharma-grade blister pack backing carton' },
    { id: uuid(), code: 'PROD-004', name: 'LDPE Bags 500g', category: 'Flexible', hsn: '3923', unit: 'Pcs', rate: 24.78, gstRate: 18, description: 'LDPE flexible packaging bags' },
    { id: uuid(), code: 'PROD-005', name: 'Duplex Board Box', category: 'Mono Carton', hsn: '4819', unit: 'Pcs', rate: 15.50, gstRate: 18, description: 'Duplex board packaging for retail' },
    { id: uuid(), code: 'PROD-006', name: 'Corrugated Box 5-Ply', category: 'Corrugated', hsn: '4819', unit: 'Pcs', rate: 42.00, gstRate: 18, description: '5-ply heavy-duty export corrugated box' },
    { id: uuid(), code: 'PROD-007', name: 'Shrink Wrap Film', category: 'Flexible', hsn: '3920', unit: 'KG', rate: 180.00, gstRate: 18, description: 'PVC shrink wrap film roll' },
    { id: uuid(), code: 'PROD-008', name: 'Pre-Print Design Charges', category: 'Service', hsn: '998314', unit: 'Job', rate: 2500.00, gstRate: 18, description: 'Artwork and pre-press design service' },
  ],
  vendors: [
    { id: uuid(), name: 'Paper Mills Pvt Ltd', contact: 'Mahesh Gupta', phone: '9876500001', email: 'mahesh@papermills.com', gst: '24PAPER1234A1Z1', material: 'Kraft Paper, Corrugating Medium', paymentTerms: 'Net 15', status: 'Active' },
    { id: uuid(), name: 'Ink Solutions Ltd', contact: 'Sunil Jain', phone: '9876500002', email: 'sunil@inksolutions.com', gst: '24INKSO5678B2Z2', material: 'Printing Ink', paymentTerms: 'Advance', status: 'Active' },
  ],
  machines: [
    { id: uuid(), assetId: 'MCH-001', name: 'Manroland 700 Evolution (8-color)', type: 'Offset Press', purchaseDate: '2020-01-15', cost: 12500000, status: 'Running', lastService: '2026-04-01' },
    { id: uuid(), assetId: 'MCH-002', name: 'Bobst Die Cutter', type: 'Die Cutter', purchaseDate: '2019-06-10', cost: 3200000, status: 'Running', lastService: '2026-03-15' },
    { id: uuid(), assetId: 'MCH-003', name: 'Lamination Machine', type: 'Laminator', purchaseDate: '2021-09-20', cost: 1800000, status: 'Maintenance', lastService: '2026-05-01' },
  ],
  branches: [
    { id: uuid(), name: 'Main Plant - Waghodiya', city: 'Vadodara', state: 'Gujarat', address: 'Plot No. 12, GIDC Waghodiya, Vadodara - 390019', phone: '+91 98765 43210', manager: 'Rahul Medhe', status: 'Active' },
  ],
  complaints: [],
  activities: [],
  feedbacks: [],
  artworks: [],
  purchaseOrders: [],
  expenses: [],
  jobCards: [],
  documents: [],
}

// ─── Debounced Supabase sync ────────────────────────────────────────
// Batches rapid changes and saves after 800ms of inactivity
const syncTimers = {}
function syncToSupabase(key, data) {
  clearTimeout(syncTimers[key])
  syncTimers[key] = setTimeout(async () => {
    const { error } = await supabase.from('app_state').upsert({ key, data }, { onConflict: 'key' })
    if (error) console.error(`[PackCRM] Supabase sync failed for "${key}":`, error.message)
  }, 800)
}

// ─── Store ─────────────────────────────────────────────────────────
const useStore = create((set, get) => ({
  // Loading state
  loading: true,
  syncError: null,

  // Data
  company: defaultCompany,
  leads: [],
  customers: [],
  quotations: [],
  orders: [],
  invoices: [],
  employees: [],
  inventory: [],
  products: [],
  complaints: [],
  activities: [],
  feedbacks: [],
  artworks: [],
  branches: [],
  vendors: [],
  purchaseOrders: [],
  machines: [],
  expenses: [],
  jobCards: [],
  documents: [],

  // ─── Initialize from Supabase ───────────────────────────────────
  fetchAll: async () => {
    set({ loading: true, syncError: null })
    try {
      const { data, error } = await supabase.from('app_state').select('*')

      if (error) throw error

      if (!data || data.length === 0) {
        // First run — seed the DB with default data
        console.log('[PackCRM] No data in Supabase — seeding with defaults...')
        const seedState = { company: defaultCompany, ...seed }
        set({ ...seedState, loading: false })

        // Async seed — fire and forget
        const seedEntries = [
          { key: 'company', data: defaultCompany },
          ...Object.entries(seed).map(([key, data]) => ({ key, data })),
        ]
        supabase.from('app_state').insert(seedEntries).then(({ error: e }) => {
          if (e) console.warn('[PackCRM] Seed insert error:', e.message)
          else console.log('[PackCRM] Seeded Supabase successfully')
        })
      } else {
        // Hydrate store from Supabase data
        const fromDB = Object.fromEntries(data.map(r => [r.key, r.data]))
        set({
          company: fromDB.company || defaultCompany,
          leads: fromDB.leads || seed.leads,
          customers: fromDB.customers || seed.customers,
          quotations: fromDB.quotations || seed.quotations,
          orders: fromDB.orders || seed.orders,
          invoices: fromDB.invoices || seed.invoices,
          employees: fromDB.employees || seed.employees,
          inventory: fromDB.inventory || seed.inventory,
          products: fromDB.products || seed.products,
          complaints: fromDB.complaints || [],
          activities: fromDB.activities || [],
          feedbacks: fromDB.feedbacks || [],
          artworks: fromDB.artworks || [],
          branches: fromDB.branches || seed.branches,
          vendors: fromDB.vendors || seed.vendors,
          purchaseOrders: fromDB.purchaseOrders || [],
          machines: fromDB.machines || seed.machines,
          expenses: fromDB.expenses || [],
          jobCards: fromDB.jobCards || [],
          documents: fromDB.documents || [],
          loading: false,
        })
        console.log('[PackCRM] Loaded from Supabase:', data.length, 'tables')
      }
    } catch (err) {
      console.error('[PackCRM] Failed to load from Supabase:', err.message)
      // Graceful fallback to seed data so app still works offline
      set({ ...seed, company: defaultCompany, loading: false, syncError: err.message })
    }
  },

  // ─── Company ────────────────────────────────────────────────────
  updateCompany: (data) => set((s) => {
    const company = { ...s.company, ...data }
    syncToSupabase('company', company)
    return { company }
  }),

  // ─── Leads ──────────────────────────────────────────────────────
  addLead: (lead) => set((s) => {
    const leads = [{ id: uuid(), createdAt: new Date().toISOString().split('T')[0], ...lead }, ...s.leads]
    syncToSupabase('leads', leads)
    return { leads }
  }),
  updateLead: (id, data) => set((s) => {
    const leads = s.leads.map(l => l.id === id ? { ...l, ...data } : l)
    syncToSupabase('leads', leads)
    return { leads }
  }),
  deleteLead: (id) => set((s) => {
    const leads = s.leads.filter(l => l.id !== id)
    syncToSupabase('leads', leads)
    return { leads }
  }),

  // ─── Customers ──────────────────────────────────────────────────
  addCustomer: (c) => set((s) => {
    const customers = [{ id: uuid(), createdAt: new Date().toISOString().split('T')[0], ...c }, ...s.customers]
    syncToSupabase('customers', customers)
    return { customers }
  }),
  updateCustomer: (id, data) => set((s) => {
    const customers = s.customers.map(c => c.id === id ? { ...c, ...data } : c)
    syncToSupabase('customers', customers)
    return { customers }
  }),
  deleteCustomer: (id) => set((s) => {
    const customers = s.customers.filter(c => c.id !== id)
    syncToSupabase('customers', customers)
    return { customers }
  }),

  // ─── Quotations ─────────────────────────────────────────────────
  addQuotation: (q) => set((s) => {
    const no = `QT-2026-${String(s.quotations.length + 1).padStart(3, '0')}`
    const quotations = [{ id: uuid(), quoteNo: no, date: new Date().toISOString().split('T')[0], status: 'Draft', ...q }, ...s.quotations]
    syncToSupabase('quotations', quotations)
    return { quotations }
  }),
  updateQuotation: (id, data) => set((s) => {
    const quotations = s.quotations.map(q => q.id === id ? { ...q, ...data } : q)
    syncToSupabase('quotations', quotations)
    return { quotations }
  }),
  deleteQuotation: (id) => set((s) => {
    const quotations = s.quotations.filter(q => q.id !== id)
    syncToSupabase('quotations', quotations)
    return { quotations }
  }),

  // ─── Orders ─────────────────────────────────────────────────────
  addOrder: (o) => set((s) => {
    const no = `ORD-2026-${String(s.orders.length + 1).padStart(3, '0')}`
    const orders = [{ id: uuid(), orderNo: no, orderDate: new Date().toISOString().split('T')[0], status: 'Confirmed', ...o }, ...s.orders]
    syncToSupabase('orders', orders)
    return { orders }
  }),
  updateOrder: (id, data) => set((s) => {
    const orders = s.orders.map(o => o.id === id ? { ...o, ...data } : o)
    syncToSupabase('orders', orders)
    return { orders }
  }),
  deleteOrder: (id) => set((s) => {
    const orders = s.orders.filter(o => o.id !== id)
    syncToSupabase('orders', orders)
    return { orders }
  }),

  // ─── Invoices ───────────────────────────────────────────────────
  addInvoice: (inv) => set((s) => {
    const no = `INV-2026-${String(s.invoices.length + 1).padStart(3, '0')}`
    const invoices = [{ id: uuid(), invoiceNo: no, date: new Date().toISOString().split('T')[0], status: 'Unpaid', paid: 0, ...inv }, ...s.invoices]
    syncToSupabase('invoices', invoices)
    return { invoices }
  }),
  updateInvoice: (id, data) => set((s) => {
    const invoices = s.invoices.map(i => i.id === id ? { ...i, ...data } : i)
    syncToSupabase('invoices', invoices)
    return { invoices }
  }),
  deleteInvoice: (id) => set((s) => {
    const invoices = s.invoices.filter(i => i.id !== id)
    syncToSupabase('invoices', invoices)
    return { invoices }
  }),

  // ─── Employees ──────────────────────────────────────────────────
  addEmployee: (e) => set((s) => {
    const no = `EMP-${String(s.employees.length + 1).padStart(3, '0')}`
    const employees = [{ id: uuid(), empId: no, status: 'Active', ...e }, ...s.employees]
    syncToSupabase('employees', employees)
    return { employees }
  }),
  updateEmployee: (id, data) => set((s) => {
    const employees = s.employees.map(e => e.id === id ? { ...e, ...data } : e)
    syncToSupabase('employees', employees)
    return { employees }
  }),
  deleteEmployee: (id) => set((s) => {
    const employees = s.employees.filter(e => e.id !== id)
    syncToSupabase('employees', employees)
    return { employees }
  }),

  // ─── Inventory ──────────────────────────────────────────────────
  addInventory: (item) => set((s) => {
    const inventory = [{ id: uuid(), ...item }, ...s.inventory]
    syncToSupabase('inventory', inventory)
    return { inventory }
  }),
  updateInventory: (id, data) => set((s) => {
    const inventory = s.inventory.map(i => i.id === id ? { ...i, ...data } : i)
    syncToSupabase('inventory', inventory)
    return { inventory }
  }),
  deleteInventory: (id) => set((s) => {
    const inventory = s.inventory.filter(i => i.id !== id)
    syncToSupabase('inventory', inventory)
    return { inventory }
  }),

  // ─── Products ───────────────────────────────────────────────────
  addProduct: (p) => set((s) => {
    const no = `PROD-${String(s.products.length + 1).padStart(3, '0')}`
    const products = [{ id: uuid(), code: no, gstRate: 18, ...p }, ...s.products]
    syncToSupabase('products', products)
    return { products }
  }),
  updateProduct: (id, data) => set((s) => {
    const products = s.products.map(p => p.id === id ? { ...p, ...data } : p)
    syncToSupabase('products', products)
    return { products }
  }),
  deleteProduct: (id) => set((s) => {
    const products = s.products.filter(p => p.id !== id)
    syncToSupabase('products', products)
    return { products }
  }),

  // ─── Complaints ─────────────────────────────────────────────────
  addComplaint: (c) => set((s) => {
    const complaints = [{ id: uuid(), date: new Date().toISOString().split('T')[0], status: 'Open', ...c }, ...s.complaints]
    syncToSupabase('complaints', complaints)
    return { complaints }
  }),
  updateComplaint: (id, data) => set((s) => {
    const complaints = s.complaints.map(c => c.id === id ? { ...c, ...data } : c)
    syncToSupabase('complaints', complaints)
    return { complaints }
  }),
  deleteComplaint: (id) => set((s) => {
    const complaints = s.complaints.filter(c => c.id !== id)
    syncToSupabase('complaints', complaints)
    return { complaints }
  }),

  // ─── Activities ─────────────────────────────────────────────────
  addActivity: (a) => set((s) => {
    const activities = [{ id: uuid(), date: new Date().toISOString().split('T')[0], ...a }, ...s.activities]
    syncToSupabase('activities', activities)
    return { activities }
  }),
  updateActivity: (id, data) => set((s) => {
    const activities = s.activities.map(a => a.id === id ? { ...a, ...data } : a)
    syncToSupabase('activities', activities)
    return { activities }
  }),
  deleteActivity: (id) => set((s) => {
    const activities = s.activities.filter(a => a.id !== id)
    syncToSupabase('activities', activities)
    return { activities }
  }),

  // ─── Vendors ────────────────────────────────────────────────────
  addVendor: (v) => set((s) => {
    const vendors = [{ id: uuid(), status: 'Active', ...v }, ...s.vendors]
    syncToSupabase('vendors', vendors)
    return { vendors }
  }),
  updateVendor: (id, data) => set((s) => {
    const vendors = s.vendors.map(v => v.id === id ? { ...v, ...data } : v)
    syncToSupabase('vendors', vendors)
    return { vendors }
  }),
  deleteVendor: (id) => set((s) => {
    const vendors = s.vendors.filter(v => v.id !== id)
    syncToSupabase('vendors', vendors)
    return { vendors }
  }),

  // ─── Purchase Orders ────────────────────────────────────────────
  addPO: (po) => set((s) => {
    const no = `PO-2026-${String(s.purchaseOrders.length + 1).padStart(3, '0')}`
    const purchaseOrders = [{ id: uuid(), poNo: no, date: new Date().toISOString().split('T')[0], status: 'Draft', ...po }, ...s.purchaseOrders]
    syncToSupabase('purchaseOrders', purchaseOrders)
    return { purchaseOrders }
  }),
  updatePO: (id, data) => set((s) => {
    const purchaseOrders = s.purchaseOrders.map(p => p.id === id ? { ...p, ...data } : p)
    syncToSupabase('purchaseOrders', purchaseOrders)
    return { purchaseOrders }
  }),
  deletePO: (id) => set((s) => {
    const purchaseOrders = s.purchaseOrders.filter(p => p.id !== id)
    syncToSupabase('purchaseOrders', purchaseOrders)
    return { purchaseOrders }
  }),

  // ─── Machines ───────────────────────────────────────────────────
  addMachine: (m) => set((s) => {
    const no = `MCH-${String(s.machines.length + 1).padStart(3, '0')}`
    const machines = [{ id: uuid(), assetId: no, status: 'Running', ...m }, ...s.machines]
    syncToSupabase('machines', machines)
    return { machines }
  }),
  updateMachine: (id, data) => set((s) => {
    const machines = s.machines.map(m => m.id === id ? { ...m, ...data } : m)
    syncToSupabase('machines', machines)
    return { machines }
  }),
  deleteMachine: (id) => set((s) => {
    const machines = s.machines.filter(m => m.id !== id)
    syncToSupabase('machines', machines)
    return { machines }
  }),

  // ─── Expenses ───────────────────────────────────────────────────
  addExpense: (e) => set((s) => {
    const expenses = [{ id: uuid(), date: new Date().toISOString().split('T')[0], status: 'Pending', ...e }, ...s.expenses]
    syncToSupabase('expenses', expenses)
    return { expenses }
  }),
  updateExpense: (id, data) => set((s) => {
    const expenses = s.expenses.map(e => e.id === id ? { ...e, ...data } : e)
    syncToSupabase('expenses', expenses)
    return { expenses }
  }),
  deleteExpense: (id) => set((s) => {
    const expenses = s.expenses.filter(e => e.id !== id)
    syncToSupabase('expenses', expenses)
    return { expenses }
  }),

  // ─── Job Cards ──────────────────────────────────────────────────
  addJobCard: (jc) => set((s) => {
    const no = `JC-2026-${String(s.jobCards.length + 1).padStart(3, '0')}`
    const jobCards = [{ id: uuid(), jobNo: no, status: 'Pending', createdAt: new Date().toISOString().split('T')[0], ...jc }, ...s.jobCards]
    syncToSupabase('jobCards', jobCards)
    return { jobCards }
  }),
  updateJobCard: (id, data) => set((s) => {
    const jobCards = s.jobCards.map(j => j.id === id ? { ...j, ...data } : j)
    syncToSupabase('jobCards', jobCards)
    return { jobCards }
  }),
  deleteJobCard: (id) => set((s) => {
    const jobCards = s.jobCards.filter(j => j.id !== id)
    syncToSupabase('jobCards', jobCards)
    return { jobCards }
  }),

  // ─── Feedbacks ──────────────────────────────────────────────────
  addFeedback: (f) => set((s) => {
    const feedbacks = [{ id: uuid(), date: new Date().toISOString().split('T')[0], ...f }, ...s.feedbacks]
    syncToSupabase('feedbacks', feedbacks)
    return { feedbacks }
  }),
  updateFeedback: (id, data) => set((s) => {
    const feedbacks = s.feedbacks.map(f => f.id === id ? { ...f, ...data } : f)
    syncToSupabase('feedbacks', feedbacks)
    return { feedbacks }
  }),
  deleteFeedback: (id) => set((s) => {
    const feedbacks = s.feedbacks.filter(f => f.id !== id)
    syncToSupabase('feedbacks', feedbacks)
    return { feedbacks }
  }),

  // ─── Artworks ───────────────────────────────────────────────────
  addArtwork: (a) => set((s) => {
    const no = `ART-${String(s.artworks.length + 1).padStart(3, '0')}`
    const artworks = [{ id: uuid(), artNo: no, status: 'Pending', version: 'v1.0', createdAt: new Date().toISOString().split('T')[0], ...a }, ...s.artworks]
    syncToSupabase('artworks', artworks)
    return { artworks }
  }),
  updateArtwork: (id, data) => set((s) => {
    const artworks = s.artworks.map(a => a.id === id ? { ...a, ...data } : a)
    syncToSupabase('artworks', artworks)
    return { artworks }
  }),
  deleteArtwork: (id) => set((s) => {
    const artworks = s.artworks.filter(a => a.id !== id)
    syncToSupabase('artworks', artworks)
    return { artworks }
  }),

  // ─── Branches ───────────────────────────────────────────────────
  addBranch: (b) => set((s) => {
    const branches = [{ id: uuid(), status: 'Active', ...b }, ...s.branches]
    syncToSupabase('branches', branches)
    return { branches }
  }),
  updateBranch: (id, data) => set((s) => {
    const branches = s.branches.map(b => b.id === id ? { ...b, ...data } : b)
    syncToSupabase('branches', branches)
    return { branches }
  }),
  deleteBranch: (id) => set((s) => {
    const branches = s.branches.filter(b => b.id !== id)
    syncToSupabase('branches', branches)
    return { branches }
  }),

  // ─── Documents ──────────────────────────────────────────────────
  addDocument: (d) => set((s) => {
    const documents = [{ id: uuid(), date: new Date().toISOString().split('T')[0], ...d }, ...s.documents]
    syncToSupabase('documents', documents)
    return { documents }
  }),
  updateDocument: (id, data) => set((s) => {
    const documents = s.documents.map(d => d.id === id ? { ...d, ...data } : d)
    syncToSupabase('documents', documents)
    return { documents }
  }),
  deleteDocument: (id) => set((s) => {
    const documents = s.documents.filter(d => d.id !== id)
    syncToSupabase('documents', documents)
    return { documents }
  }),
}))

export default useStore
