import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  ChartNoAxesCombined,
  UserRound,
  Settings,
  X,
  Leaf,
  ArrowUpRight,
} from "lucide-react";

import "../../assets/css/layout/Sidebar.css";
import logo from "../../assets/image/logo.png";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Expenses",
    path: "/expenses",
    icon: ReceiptText,
  },
  {
    name: "Analytics",
    path: "/analytics",
    icon: ChartNoAxesCombined,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserRound,
  },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={onClose}
          className="sidebar-overlay"
        />
      )}

      <aside
        className={`app-sidebar ${isOpen ? "sidebar-open" : ""}`}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="sidebar-brand-link"
          >
            {/* Circular Logo */}
            <div className="sidebar-logo">
              <img
                src={logo}
                alt="FinDash Logo"
                className="sidebar-logo-image"
              />
            </div>

            {/* Brand Name */}
            <div className="sidebar-brand-text">
              <h1>FinDash</h1>
              <p>Finance workspace</p>
            </div>
          </NavLink>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="sidebar-close-button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="sidebar-navigation">
          <p className="sidebar-label">MENU</p>

          <nav className="sidebar-nav">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-nav-link sidebar-settings-link ${
                isActive ? "active" : ""
              }`
            }
          >
            <Settings size={19} strokeWidth={1.8} />
            <span>Settings</span>
          </NavLink>

          {/* Information Card */}
          <div className="sidebar-upgrade-card">
            <div className="sidebar-upgrade-icon">
              <Leaf size={20} />
            </div>

            <h3>Make smarter decisions.</h3>

            <p>
              Understand your spending and build better financial habits.
            </p>

            <div className="sidebar-upgrade-footer">
              <span>Explore insights</span>
              <ArrowUpRight size={16} />
            </div>
          </div>

          {/* Footer */}
          <div className="sidebar-footer">
            <span className="sidebar-footer-dot" />
            <span>FinDash Workspace</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;