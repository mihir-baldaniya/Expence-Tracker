import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  UserRound,
  ChevronDown,
} from "lucide-react";

import "../../assets/css/layout/Header.css";

const PROFILE_PICTURE_KEY = "findash_profile_picture";
const PROFILE_STORAGE_KEY = "findash_profile";

const Header = () => {
  const navigate = useNavigate();

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState(() => {
    try {
      return localStorage.getItem(PROFILE_PICTURE_KEY) || "";
    } catch {
      return "";
    }
  });

  // Profile information state
  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      return savedProfile ? JSON.parse(savedProfile) : {};
    } catch {
      return {};
    }
  });

  // Dropdown visibility
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Synchronize profile information and picture
  useEffect(() => {
    const syncProfile = () => {
      try {
        setProfilePicture(
          localStorage.getItem(PROFILE_PICTURE_KEY) || ""
        );

        const savedProfile = localStorage.getItem(
          PROFILE_STORAGE_KEY
        );

        setProfile(savedProfile ? JSON.parse(savedProfile) : {});
      } catch (error) {
        console.error("Unable to sync profile:", error);
      }
    };

    window.addEventListener("storage", syncProfile);
    window.addEventListener("profileUpdated", syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("profileUpdated", syncProfile);
    };
  }, []);

  // User's full name
  const fullName = profile.fullName?.trim() || "My Account";

  // Generate avatar initials
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  // Navigate to Profile page
  const handleProfileNavigation = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  return (
    <header className="header">
      {/* Left Section */}
      <div className="header-left">
        <div className="header-welcome">
          <h2>
            Welcome back
            {profile.fullName?.trim()
              ? `, ${profile.fullName.trim().split(/\s+/)[0]}`
              : ""}
            !
          </h2>

          <p>Here is your financial overview.</p>
        </div>
      </div>

      {/* Right Section */}
      <div className="header-right">
        {/* Notifications */}
        <button
          type="button"
          className="header-icon-button"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="header-notification-dot" />
        </button>

        {/* Profile Dropdown */}
        <div className="header-profile-container">
          <button
            type="button"
            className="header-profile-button"
            onClick={() =>
              setShowProfileMenu((previous) => !previous)
            }
            aria-expanded={showProfileMenu}
            aria-label="Open profile menu"
          >
            {/* Profile Avatar */}
            <div className="header-avatar">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="header-avatar-image"
                />
              ) : initials ? (
                <span>{initials}</span>
              ) : (
                <UserRound size={20} />
              )}
            </div>

            {/* Profile Information */}
            <div className="header-profile-info">
              <span className="header-profile-name">
                {fullName}
              </span>

              <span className="header-profile-role">
                Personal Account
              </span>
            </div>

            {/* Dropdown Arrow */}
            <ChevronDown
              size={16}
              className={`header-profile-chevron ${
                showProfileMenu ? "is-open" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="header-profile-dropdown">
              {/* User Details */}
              <div className="header-dropdown-user">
                <div className="header-avatar header-dropdown-avatar">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="header-avatar-image"
                    />
                  ) : initials ? (
                    <span>{initials}</span>
                  ) : (
                    <UserRound size={20} />
                  )}
                </div>

                <div className="header-dropdown-user-info">
                  <strong>{fullName}</strong>

                  <span>
                    {profile.email || "Personal Account"}
                  </span>
                </div>
              </div>

              <div className="header-dropdown-divider" />

              {/* My Profile */}
              <button
                type="button"
                className="header-dropdown-item"
                onClick={handleProfileNavigation}
              >
                <UserRound size={17} />
                <span>My Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;