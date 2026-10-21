import { Link } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";

import "../assets/css/pages/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        {/* Icon */}
        <div className="not-found-icon">
          <SearchX size={42} strokeWidth={1.6} />
        </div>

        {/* Error Code */}
        <h1 className="not-found-code">404</h1>

        {/* Heading */}
        <h2 className="not-found-title">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="not-found-description">
          Oops! The page you're looking for doesn't exist,
          may have been moved, or the URL might be incorrect.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="not-found-actions">
          <Link to="/dashboard" className="not-found-home-button">
            <Home size={18} />
            <span>Back to Dashboard</span>
          </Link>

          <button
            type="button"
            className="not-found-back-button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={18} />
            <span>Go Back</span>
          </button>
        </div>

        {/* Footer */}
        <div className="not-found-footer">
          <span className="not-found-footer-dot" />
          <span>FinDash — Personal Finance Workspace</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;