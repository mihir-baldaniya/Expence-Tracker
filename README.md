# FinDash — Expense Tracker

FinDash is a modern, responsive personal expense-tracking dashboard built with React.js. It provides an organized interface for reviewing expenses, exploring spending patterns, and managing personal profile and application preferences.

The frontend is built with reusable React components, page-specific CSS, interactive charts, and client-side routing.

## Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Frontend Project Structure](#frontend-project-structure)
- [Application Pages](#application-pages)
- [Reusable Components](#reusable-components)
- [Data Storage](#data-storage)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Navigation Routes](#navigation-routes)
- [Design Approach](#design-approach)
- [Possible Future Enhancements](#possible-future-enhancements)
- [Author](#author)

## Overview

FinDash is designed to make personal expense tracking easier to understand. The dashboard organizes financial information into dedicated pages for expenses, analytics, profile management, and settings.

The interface uses a clean green-themed design with a sidebar, header, cards, tables, and charts. Its component-based structure keeps page content, layout elements, styles, and utility functions organized separately.

> **Current implementation note:** The frontend uses browser Local Storage for supported data such as expense records, profile information, profile pictures, and settings. A connected backend or cloud database should not be assumed unless separately configured.

## Features

### Dashboard
- Central overview of expense activity.
- Spending trend visualization.
- Category-based expense breakdown.
- Recent transaction section.

### Expense Management
- Add and review expense records.
- Display transactions in an organized table.
- Review expense details and categories.
- Keep expense-related components separate and reusable.

### Analytics
- Visualize spending trends.
- Explore expenses by category.
- Review filtered financial information.
- Identify the highest recorded expense.

### Profile Management
- Edit personal profile information.
- Upload a profile picture.
- Display profile information in the header.
- Synchronize profile updates within the application using a custom browser event.

### Settings
- Configure supported application preferences.
- Set currency and date-format preferences.
- Configure monthly budget and savings-goal values.
- Manage supported notification preferences.
- Save settings in browser Local Storage.

### User Interface
- Responsive sidebar and header layout.
- Client-side navigation using React Router.
- Reusable components and separate CSS files.
- Green-themed visual design.
- Icons from Lucide React.
- Charts powered by Recharts.

## Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Component-based user interface |
| JavaScript (ES6+) | Application logic and interactions |
| Vite | Development server and production build |
| React Router | Client-side routing |
| CSS3 | Layout, styling, and responsive design |
| Recharts | Financial charts and visualizations |
| Lucide React | Interface icons |
| Browser Local Storage | Persistence for supported client-side data |

## Frontend Project Structure

The following tree represents the main frontend structure. Some projects may include additional configuration files or assets.

```text
frontend/
├── public/
│
├── src/
│   ├── assets/
│   │   ├── image/
│   │   │   ├── logo.png
│   │   │   └── circlelogo.png
│   │   │
│   │   └── css/
│   │       ├── global.css
│   │       │
│   │       ├── layout/
│   │       │   ├── MainLayout.css
│   │       │   ├── Sidebar.css
│   │       │   └── Header.css
│   │       │
│   │       ├── pages/
│   │       │   ├── Dashboard.css
│   │       │   ├── Expenses.css
│   │       │   ├── Analytics.css
│   │       │   ├── Profile.css
│   │       │   └── Settings.css
│   │       │
│   │       ├── analytics/
│   │       │   ├── SummaryCards.css
│   │       │   ├── SpendTrendChart.css
│   │       │   └── CategoryBreakdown.css
│   │       │
│   │       └── expenses/
│   │           ├── RecentTransactions.css
│   │           ├── ExpenseTable.css
│   │           └── ExpenseForm.css
│   │
│   ├── components/
│   │   └── layout/
│   │       ├── MainLayout.jsx
│   │       ├── Sidebar.jsx
│   │       └── Header.jsx
│   │
│   ├── features/
│   │   ├── analytics/
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── SpendTrendChart.jsx
│   │   │   └── CategoryBreakdown.jsx
│   │   │
│   │   └── expenses/
│   │       ├── RecentTransactions.jsx
│   │       ├── ExpenseTable.jsx
│   │       ├── ExpenseForm.jsx
│   │       ├── useExpenseStorage.js
│   │       └── expenseData.js
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Expenses.jsx
│   │   ├── Analytics.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   │
│   ├── utils/
│   │   └── currency.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

### Directory guide

- **`assets/image/`** — Logo and other image assets used by the interface.
- **`assets/css/`** — Stylesheets organized by layout, page, analytics, and expense components.
- **`components/layout/`** — Shared application layout components, including the header, sidebar, and main layout.
- **`features/analytics/`** — Reusable analytics cards and chart components.
- **`features/expenses/`** — Expense form, transaction table, recent transactions, data, and storage hook.
- **`pages/`** — Page-level components rendered by the router.
- **`utils/`** — Shared helper functions, such as currency formatting.
- **`App.jsx`** — Defines the application routes.
- **`main.jsx`** — Frontend entry point.
- **`index.css` and `global.css`** — Global styles and foundational styling.

## Application Pages

| Page | Route | Description |
|---|---|---|
| Dashboard | `/dashboard` | Main overview of expense activity |
| Expenses | `/expenses` | Expense records and expense management |
| Analytics | `/analytics` | Charts and spending analysis |
| Profile | `/profile` | Personal profile details and picture |
| Settings | `/settings` | Application preferences |

The root route (`/`) redirects to `/dashboard`.

## Reusable Components

### Layout
- **`MainLayout.jsx`** — Shared page layout and outlet for routed pages.
- **`Sidebar.jsx`** — Navigation links for the application.
- **`Header.jsx`** — Welcome message, notifications icon, and profile dropdown.

### Analytics
- **`SummaryCards.jsx`** — Summary information for the dashboard.
- **`SpendTrendChart.jsx`** — Spending trend visualization.
- **`CategoryBreakdown.jsx`** — Expense category visualization.

### Expenses
- **`ExpenseForm.jsx`** — Form interface for expense entry.
- **`ExpenseTable.jsx`** — Tabular expense display.
- **`RecentTransactions.jsx`** — Recent expense activity.
- **`useExpenseStorage.js`** — Hook for the client-side expense storage workflow.
- **`expenseData.js`** — Expense-related data definitions.

## Data Storage

FinDash stores supported application data in the browser using Local Storage. Current storage keys used by profile-related features include:

| Key | Purpose |
|---|---|
| `findash_profile` | Saved profile information |
| `findash_profile_picture` | Saved profile picture data |
| `findash_settings_changed` | Browser event used to signal settings changes |

The application also uses custom browser events such as `profileUpdated` to refresh profile information across components in the same browser tab.

**Storage considerations:**
- Local Storage belongs to the current browser and origin.
- Data does not automatically synchronize between different devices or browsers.
- Clearing browser storage can remove locally saved data.
- Local Storage is not a secure database for sensitive financial information.
- Expense persistence is handled by the expense storage implementation in the frontend.

## Getting Started

### Prerequisites

Install the following tools:

- [Node.js](https://nodejs.org/) (use a current supported LTS version)
- npm, included with Node.js
- Git (optional, for cloning the repository)

### 1. Open the frontend directory

From the repository root, navigate to the frontend folder:

```bash
cd frontend
```

Adjust the command if your frontend folder is located elsewhere.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Vite prints a local URL in the terminal. Open that URL in your browser, commonly:

```text
http://localhost:5173
```

### 4. Create a production build

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

## Available Scripts

The scripts below are typical for a Vite frontend. The exact commands available are determined by the scripts configured in `package.json`.

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |

## Navigation Routes

The application uses React Router's `createBrowserRouter` and `RouterProvider` for client-side navigation. The main route configuration includes:

```jsx
{
  path: "/",
  element: <MainLayout />,
  children: [
    { index: true, element: <Navigate to="/dashboard" replace /> },
    { path: "dashboard", element: <Dashboard /> },
    { path: "expenses", element: <Expenses /> },
    { path: "analytics", element: <Analytics /> },
    { path: "profile", element: <Profile /> },
    { path: "settings", element: <Settings /> },
  ],
}
```

Navigation from the header should use React Router navigation, such as `useNavigate()`, rather than manually changing the URL hash.

## Design Approach

FinDash uses a minimal finance-dashboard design:

- Pale green sidebar with a clear active navigation state.
- White cards against a light workspace background.
- Forest-green accents for key interface elements.
- Spacious layout and readable typography.
- Separate CSS files for pages and reusable component groups.
- Responsive behavior for desktop and smaller screens.

## Possible Future Enhancements

The frontend can be extended with features such as:

- Backend API integration.
- Database-backed expense storage.
- User authentication and protected routes.
- Synchronization across devices.
- Exportable CSV or PDF reports.
- More advanced search, sorting, and filtering.
- Additional budgeting and financial reporting tools.
- Automated tests and accessibility improvements.

These are potential improvements and should not be interpreted as already implemented features.

## Author

**Mihir Baldaniya**

- GitHub : https://github.com/mihir-baldaniya/Expence-Tracker
- LinkedIn : www.linkedin.com/in/mihirbaldaniyaofficial
- Live : https://expencetracker.mihirbaldaniya.site/
