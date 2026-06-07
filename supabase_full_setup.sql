-- ============================================================
-- PackCRM — Full Supabase Setup Script
-- Run once at: https://supabase.com/dashboard/project/wtipusjtoemphyrusnvg/sql/new
-- ============================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS app_state (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS app_state_updated_at ON app_state;
CREATE TRIGGER app_state_updated_at
  BEFORE UPDATE ON app_state
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. Row Level Security (open for anon — add auth later)
ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for anon" ON app_state;
CREATE POLICY "Allow all for anon"
  ON app_state FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 4. Seed company settings
INSERT INTO app_state (key, data) VALUES (
  'company',
  '{
    "name": "PackCRM Demo Co.",
    "address": "Plot No. 12, GIDC, Waghodiya, Vadodara - 390019, Gujarat",
    "phone": "+91 98765 43210",
    "email": "info@packcrmdemo.com",
    "gst": "24ABCDE1234F1Z5",
    "pan": "ABCDE1234F",
    "bank": "HDFC Bank, A/C: 50100123456789, IFSC: HDFC0001234",
    "logo": null
  }'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 5. Seed leads
INSERT INTO app_state (key, data) VALUES (
  'leads',
  '[
    {"id":"lead-001","name":"Havells India Ltd.","contact":"Suresh Patel","phone":"9876543210","email":"suresh@havells.com","city":"Noida","industry":"Electrical","source":"Cold Call","status":"Qualified","priority":"Hot","assignedTo":"Rahul","notes":"Interested in mono cartons","createdAt":"2026-06-01"},
    {"id":"lead-002","name":"Amul Dairy","contact":"Deepak Shah","phone":"9876543211","email":"deepak@amul.com","city":"Anand","industry":"Food & Dairy","source":"Reference","status":"Quote Sent","priority":"Hot","assignedTo":"Rahul","notes":"Need 5000 corrugated boxes monthly","createdAt":"2026-06-03"},
    {"id":"lead-003","name":"Nirma Ltd.","contact":"Kamlesh Joshi","phone":"9876543212","email":"kamlesh@nirma.com","city":"Ahmedabad","industry":"FMCG","source":"Exhibition","status":"New","priority":"Warm","assignedTo":"Priya","notes":"","createdAt":"2026-06-05"}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 6. Seed customers
INSERT INTO app_state (key, data) VALUES (
  'customers',
  '[
    {"id":"cust-001","company":"Amul Dairy Ltd.","contact":"Deepak Shah","phone":"9876543211","email":"deepak@amul.com","city":"Anand","state":"Gujarat","gst":"24AMULX1234A1Z1","industry":"Food & Dairy","category":"A","paymentTerms":"Net 30","creditLimit":500000,"status":"Active","createdAt":"2026-05-01"},
    {"id":"cust-002","company":"Cadbury India","contact":"Rohit Verma","phone":"9876543213","email":"rohit@cadbury.com","city":"Thane","state":"Maharashtra","gst":"27CADBU5678B2Z2","industry":"Food & Beverage","category":"A","paymentTerms":"Net 45","creditLimit":800000,"status":"Active","createdAt":"2026-04-15"},
    {"id":"cust-003","company":"Sun Pharma","contact":"Anita Mehta","phone":"9876543214","email":"anita@sunpharma.com","city":"Mumbai","state":"Maharashtra","gst":"27SUNPH9012C3Z3","industry":"Pharma","category":"A","paymentTerms":"Net 60","creditLimit":1000000,"status":"Active","createdAt":"2026-03-10"},
    {"id":"cust-004","company":"Pidilite Industries","contact":"Vijay Kumar","phone":"9876543215","email":"vijay@pidilite.com","city":"Surat","state":"Gujarat","gst":"24PIDIL3456D4Z4","industry":"Chemical","category":"B","paymentTerms":"Net 30","creditLimit":300000,"status":"Active","createdAt":"2026-04-01"},
    {"id":"cust-005","company":"Vadilal Foods","contact":"Sanjay Patel","phone":"9876543216","email":"sanjay@vadilal.com","city":"Vadodara","state":"Gujarat","gst":"24VADIL7890E5Z5","industry":"Food & Beverage","category":"B","paymentTerms":"Advance","creditLimit":200000,"status":"Active","createdAt":"2026-05-20"}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 7. Seed quotations
INSERT INTO app_state (key, data) VALUES (
  'quotations',
  '[
    {"id":"quot-001","quoteNo":"QT-2026-001","customer":"Amul Dairy Ltd.","product":"Corrugated Box B3","qty":5000,"unitPrice":24.75,"total":123750,"gst":22275,"grandTotal":146025,"status":"Sent","date":"2026-06-01","validUntil":"2026-06-30","notes":"3-ply corrugated, 4 color printing"},
    {"id":"quot-002","quoteNo":"QT-2026-002","customer":"Cadbury India","product":"Mono Carton 4C","qty":10000,"unitPrice":8.85,"total":88500,"gst":15930,"grandTotal":104430,"status":"Approved","date":"2026-06-02","validUntil":"2026-06-30","notes":"350 GSM SBS board"},
    {"id":"quot-003","quoteNo":"QT-2026-003","customer":"Sun Pharma","product":"Blister Pack Carton","qty":20000,"unitPrice":10.75,"total":215000,"gst":38700,"grandTotal":253700,"status":"Draft","date":"2026-06-05","validUntil":"2026-07-05","notes":""}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 8. Seed orders
INSERT INTO app_state (key, data) VALUES (
  'orders',
  '[
    {"id":"ord-001","orderNo":"ORD-2026-001","customer":"Amul Dairy Ltd.","product":"Corrugated Box B3","qty":5000,"value":146025,"status":"In Production","orderDate":"2026-06-03","deliveryDate":"2026-06-15","notes":""},
    {"id":"ord-002","orderNo":"ORD-2026-002","customer":"Cadbury India","product":"Mono Carton 4C","qty":10000,"value":104430,"status":"Dispatched","orderDate":"2026-06-04","deliveryDate":"2026-06-12","notes":""},
    {"id":"ord-003","orderNo":"ORD-2026-003","customer":"Pidilite Industries","product":"LDPE Bags 500g","qty":2000,"value":49560,"status":"Confirmed","orderDate":"2026-06-06","deliveryDate":"2026-06-18","notes":""}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 9. Seed invoices
INSERT INTO app_state (key, data) VALUES (
  'invoices',
  '[
    {"id":"inv-001","invoiceNo":"INV-2026-001","customer":"Cadbury India","orderNo":"ORD-2026-002","amount":104430,"paid":104430,"balance":0,"status":"Paid","date":"2026-06-12","dueDate":"2026-07-27"},
    {"id":"inv-002","invoiceNo":"INV-2026-002","customer":"Amul Dairy Ltd.","orderNo":"ORD-2026-001","amount":146025,"paid":0,"balance":146025,"status":"Unpaid","date":"2026-06-15","dueDate":"2026-07-15"}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 10. Seed employees
INSERT INTO app_state (key, data) VALUES (
  'employees',
  '[
    {"id":"emp-001","empId":"EMP-001","name":"Rahul Medhe","designation":"Sales Manager","department":"Sales","phone":"9876543210","email":"rahul@packcrm.com","joinDate":"2024-01-01","salary":45000,"status":"Active"},
    {"id":"emp-002","empId":"EMP-002","name":"Priya Shah","designation":"Sales Executive","department":"Sales","phone":"9876543217","email":"priya@packcrm.com","joinDate":"2024-03-01","salary":28000,"status":"Active"},
    {"id":"emp-003","empId":"EMP-003","name":"Ramesh Patel","designation":"Production Manager","department":"Production","phone":"9876543218","email":"ramesh@packcrm.com","joinDate":"2023-06-01","salary":38000,"status":"Active"}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 11. Seed inventory
INSERT INTO app_state (key, data) VALUES (
  'inventory',
  '[
    {"id":"inv-item-001","itemCode":"RM-001","name":"Kraft Paper 150 GSM","category":"Paper","unit":"KG","stock":2500,"minStock":500,"rate":65,"supplier":"Paper Mills Pvt Ltd"},
    {"id":"inv-item-002","itemCode":"RM-002","name":"Corrugating Medium 120 GSM","category":"Paper","unit":"KG","stock":1800,"minStock":400,"rate":52,"supplier":"Paper Mills Pvt Ltd"},
    {"id":"inv-item-003","itemCode":"RM-003","name":"Printing Ink (Black)","category":"Ink","unit":"KG","stock":45,"minStock":20,"rate":380,"supplier":"Ink Solutions Ltd"},
    {"id":"inv-item-004","itemCode":"RM-004","name":"Printing Ink (Cyan)","category":"Ink","unit":"KG","stock":12,"minStock":20,"rate":420,"supplier":"Ink Solutions Ltd"},
    {"id":"inv-item-005","itemCode":"RM-005","name":"BOPP Tape 2 inch","category":"Packing","unit":"Roll","stock":200,"minStock":50,"rate":85,"supplier":"Tape World"}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 12. Seed products
INSERT INTO app_state (key, data) VALUES (
  'products',
  '[
    {"id":"prod-001","code":"PROD-001","name":"Corrugated Box 3-Ply","category":"Corrugated","hsn":"4819","unit":"Pcs","rate":24.75,"gstRate":18,"description":"3-ply corrugated box, standard brown kraft"},
    {"id":"prod-002","code":"PROD-002","name":"Mono Carton 4C","category":"Mono Carton","hsn":"4819","unit":"Pcs","rate":8.85,"gstRate":18,"description":"350 GSM SBS board, 4-color offset printing"},
    {"id":"prod-003","code":"PROD-003","name":"Blister Pack Carton","category":"Pharma","hsn":"4819","unit":"Pcs","rate":10.75,"gstRate":12,"description":"Pharma-grade blister pack backing carton"},
    {"id":"prod-004","code":"PROD-004","name":"LDPE Bags 500g","category":"Flexible","hsn":"3923","unit":"Pcs","rate":24.78,"gstRate":18,"description":"LDPE flexible packaging bags"},
    {"id":"prod-005","code":"PROD-005","name":"Duplex Board Box","category":"Mono Carton","hsn":"4819","unit":"Pcs","rate":15.50,"gstRate":18,"description":"Duplex board packaging for retail"},
    {"id":"prod-006","code":"PROD-006","name":"Corrugated Box 5-Ply","category":"Corrugated","hsn":"4819","unit":"Pcs","rate":42.00,"gstRate":18,"description":"5-ply heavy-duty export corrugated box"},
    {"id":"prod-007","code":"PROD-007","name":"Shrink Wrap Film","category":"Flexible","hsn":"3920","unit":"KG","rate":180.00,"gstRate":18,"description":"PVC shrink wrap film roll"},
    {"id":"prod-008","code":"PROD-008","name":"Pre-Print Design Charges","category":"Service","hsn":"998314","unit":"Job","rate":2500.00,"gstRate":18,"description":"Artwork and pre-press design service"}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 13. Seed vendors
INSERT INTO app_state (key, data) VALUES (
  'vendors',
  '[
    {"id":"vend-001","name":"Paper Mills Pvt Ltd","contact":"Mahesh Gupta","phone":"9876500001","email":"mahesh@papermills.com","gst":"24PAPER1234A1Z1","material":"Kraft Paper, Corrugating Medium","paymentTerms":"Net 15","status":"Active"},
    {"id":"vend-002","name":"Ink Solutions Ltd","contact":"Sunil Jain","phone":"9876500002","email":"sunil@inksolutions.com","gst":"24INKSO5678B2Z2","material":"Printing Ink","paymentTerms":"Advance","status":"Active"}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 14. Seed machines
INSERT INTO app_state (key, data) VALUES (
  'machines',
  '[
    {"id":"mch-001","assetId":"MCH-001","name":"Manroland 700 Evolution (8-color)","type":"Offset Press","purchaseDate":"2020-01-15","cost":12500000,"status":"Running","lastService":"2026-04-01"},
    {"id":"mch-002","assetId":"MCH-002","name":"Bobst Die Cutter","type":"Die Cutter","purchaseDate":"2019-06-10","cost":3200000,"status":"Running","lastService":"2026-03-15"},
    {"id":"mch-003","assetId":"MCH-003","name":"Lamination Machine","type":"Laminator","purchaseDate":"2021-09-20","cost":1800000,"status":"Maintenance","lastService":"2026-05-01"}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 15. Seed branches
INSERT INTO app_state (key, data) VALUES (
  'branches',
  '[
    {"id":"branch-001","name":"Main Plant - Waghodiya","city":"Vadodara","state":"Gujarat","address":"Plot No. 12, GIDC Waghodiya, Vadodara - 390019","phone":"+91 98765 43210","manager":"Rahul Medhe","status":"Active"}
  ]'
) ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data;

-- 16. Empty tables (will be filled by users)
INSERT INTO app_state (key, data) VALUES ('complaints',      '[]') ON CONFLICT (key) DO NOTHING;
INSERT INTO app_state (key, data) VALUES ('activities',      '[]') ON CONFLICT (key) DO NOTHING;
INSERT INTO app_state (key, data) VALUES ('feedbacks',       '[]') ON CONFLICT (key) DO NOTHING;
INSERT INTO app_state (key, data) VALUES ('artworks',        '[]') ON CONFLICT (key) DO NOTHING;
INSERT INTO app_state (key, data) VALUES ('purchaseOrders',  '[]') ON CONFLICT (key) DO NOTHING;
INSERT INTO app_state (key, data) VALUES ('expenses',        '[]') ON CONFLICT (key) DO NOTHING;
INSERT INTO app_state (key, data) VALUES ('jobCards',        '[]') ON CONFLICT (key) DO NOTHING;
INSERT INTO app_state (key, data) VALUES ('documents',       '[]') ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- Done! Open your app in the browser and the data will load.
-- ============================================================
