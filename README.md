# 🥐 SweetBite POS & Bakery Management System

An elegant, modern Point-of-Sale (POS) and Enterprise Bakery Management SaaS built with **React 18**, **Vite**, and **Tailwind CSS**. Designed specifically for bakeries, patisseries, cafes, and confectionery shops.

---

## 🌟 Key Highlights

- **Dual-Mode System**: Cashier POS Billing terminal (`/`) and comprehensive Store Administration Portal (`/admin`).
- **100% Sales-Driven Customer Directory**: Automatic customer onboarding and visit tracking directly from POS checkout transactions.
- **Dynamic Order Types**: Instant switching between **Takeaway**, **Dine-in**, and custom advance **Order** with balance management.
- **Flexible Reporting**: Daily, Weekly, Monthly, and Yearly sales summaries with one-click CSV and customer statement downloads.
- **Artisan Color Palette**: Warm, premium aesthetic tailored for culinary excellence.

---

## 🎨 Color Palette & Design System

The application uses a curated luxury bakery theme:

| Role | Color | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Action** | Deep Teal | `#116D6E` | Main buttons, active states, brand accents |
| **Primary Text** | Dark Espresso | `#321E1E` | Headings, key labels, invoice text |
| **Muted & Borders** | Warm Brown | `#4E3636` | Subtitles, borders, dividers, badges |
| **Alerts & Due** | Vibrant Crimson | `#CD1818` | Pending balance, low stock, cancellations |
| **Surface Canvas** | Warm Off-White | `#FDFBF7` | App background, contrast cards, receipts |

---

## 🚀 Features Breakdown

### 1. 🛒 POS Billing Terminal (`/`)
- **Fast Product Search & Category Filtering**: Browse delicacies by Cakes, Pastries, Artisan Breads, Cookies, Beverages, and Savories.
- **Order Types**:
  - `Takeaway`: Quick takeaway orders.
  - `Dine-in`: In-cafe dining experience.
  - `Order`: Advance orders with customizable advance payment and automatic pending balance calculation.
- **Customer Registration**: Capture Customer Name and Mobile Number directly at checkout.
- **Cart & Pricing Controls**:
  - Item increment/decrement, quick deletion, and clear cart.
  - Custom discount percentage slider/input.
  - Automatic GST calculation and unique sequential bill numbers.
- **Multi-Payment Modal**:
  - Cash, UPI / QR, Credit/Debit Card, or Split Payment.
  - Change due calculation for cash transactions.
  - Festive confetti animation on successful checkout.
- **Receipt & Printing**:
  - Thermal-style bill generator with barcode, itemized table, and tax breakdown.
  - Browser print trigger and downloadable digital receipt.
- **Orders Menu (`OrdersView`)**:
  - Live tracking of today's bills and advance orders.
  - Quick receipt reprinting.
  - **Collect Balance**: Settle outstanding advance balances directly from the POS interface.
- **Category Explorer (`CategoriesView`)**:
  - Browse menu items, tax rates, and jump straight into POS with filtered delicacies.

---

### 2. 📊 Admin Management Portal (`/admin`)

- **Dashboard Overview (`/admin`)**:
  - High-level KPIs: Total Revenue, Total Orders, Average Order Value, Active Customers.
  - Visual revenue charts and sales analytics using **Recharts**.
  - Top-selling delicacies and recent transactions feed.
- **Orders Management (`/admin/orders`)**:
  - Complete list of all store sales with filter by status (Completed, Advance Paid, In Progress, Cancelled).
  - Search by Bill Number or Customer Name.
  - Detailed order view modal with thermal print capabilities.
- **Categories Management (`/admin/categories`)**:
  - Add, edit, or remove bakery product classifications.
  - Configure GST slabs (`0% GST`, `5% GST`, `12% GST`, `18% GST`).
  - Switch between Table and Grid catalog views.
- **Inventory Management (`/admin/inventory`)**:
  - Real-time stock counts and minimum threshold alerts.
  - Restock triggers and stock health indicators.
- **Customers & Sales Reports (`/admin/customers`)**:
  - **Sales-Driven Ledger**: Automatically updates customer profiles with every purchase made at POS.
  - **Timeframe Reports**: Switch between **Daily**, **Weekly**, **Monthly**, and **Yearly** customer reports.
  - **Report Exports**: Download full timeframe reports in CSV format.
  - **Customer Statements**: Export individual transaction statements per customer.
  - **Dynamic Loyalty Tiers**: Automatically classified into **Gold** (≥ ₹20,000), **Silver** (≥ ₹10,000), or **Bronze** based on lifetime spend.
- **Reports & Financials (`/admin/reports`)**:
  - Comprehensive revenue, tax, and sales breakdown.
  - CSV report exports for accounting and auditing.
- **Store Settings (`/admin/settings`)**:
  - Bakery information (Name, Address, FSSAI / GST numbers).
  - Receipt customizer (Header message, footer notes, print options).

---

## 📁 Project Architecture

```text
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # Reusable UI & POS components
│   │   ├── admin/          # Admin portal components (Sidebar, TopHeader, Cards)
│   │   ├── BillingCart.jsx # Cart, Order Type, and Advance Payment logic
│   │   ├── CategoriesView.jsx # User-facing category browser
│   │   ├── OrdersView.jsx  # POS orders ledger & balance collector
│   │   ├── PaymentModal.jsx# Multi-payment gateway dialog
│   │   ├── ProductCard.jsx # Delicacy catalog item card
│   │   ├── ProductCatalog.jsx # POS delicacy grid with category filters
│   │   ├── ReceiptModal.jsx# Printable thermal bill receipt
│   │   ├── Sidebar.jsx     # POS user navigation menu
│   │   └── TopBar.jsx      # POS header with live clock & search
│   ├── data/
│   │   ├── mockData.js     # Default delicacies, categories, and initial bills
│   │   └── adminMockData.js# Base customer records and admin analytics data
│   ├── layouts/
│   │   └── AdminLayout.jsx # Admin layout wrapper with sidebar and header
│   ├── pages/
│   │   ├── PosBillingDashboard.jsx # Main POS application page
│   │   └── admin/          # Admin subpages (Overview, Orders, Categories, etc.)
│   ├── App.jsx             # Main router configuration
│   ├── index.css           # Global Tailwind and font styles
│   └── main.jsx            # React root entry point
├── package.json            # Dependencies and npm scripts
├── tailwind.config.js      # Tailwind configuration with custom theme colors
└── vite.config.js          # Vite build and dev server configuration
```

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Framework**: [React 18](https://react.dev/)
- **Bundler & Dev Server**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Custom Design Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Graphs**: [Recharts](https://recharts.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **UI FX**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Data Persistence**: HTML5 `localStorage` with real-time multi-tab sync

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Abishek-09/Billing.git
   cd Billing
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000/` (or the port specified in terminal).

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 💡 Navigation Shortcuts

- **Cashier POS Billing**: [`/`](http://localhost:3000/)
- **Admin Management Portal**: [`/admin`](http://localhost:3000/admin)
- **Admin Orders**: [`/admin/orders`](http://localhost:3000/admin/orders)
- **Admin Categories**: [`/admin/categories`](http://localhost:3000/admin/categories)
- **Admin Customers & Reports**: [`/admin/customers`](http://localhost:3000/admin/customers)
- **Admin Inventory**: [`/admin/inventory`](http://localhost:3000/admin/inventory)
- **Admin Reports**: [`/admin/reports`](http://localhost:3000/admin/reports)

---

## 📄 License

This project is privately developed for bakery retail and SaaS demonstration.
