import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  UserRound,
  ChevronDown,
  Menu,
} from "lucide-react";

import "../../assets/css/layout/Header.css";

const PROFILE_PICTURE_KEY = "findash_profile_picture";
const PROFILE_STORAGE_KEY = "findash_profile";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const [profilePicture, setProfilePicture] = useState(() => {
    try {
      return localStorage.getItem(PROFILE_PICTURE_KEY) || "";
    } catch {
      return "";
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      return savedProfile ? JSON.parse(savedProfile) : {};
    } catch {
      return {};
    }
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  const fullName = profile.fullName?.trim() || "My Account";

  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const handleProfileNavigation = () => {
    setShowProfileMenu(false);
    navigate("/profile");
  };

  return (
    <header className="header">
      {/* Left Section */}
      <div className="header-left">
        {/* Mobile and Tablet Sidebar Toggle */}
        <button
          type="button"
          className="header-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          aria-controls="findash-sidebar"
          title="Open menu"
        >
          <Menu size={22} />
        </button>

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
            <div className="header-avatar">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="header-profile-info">
              <span className="header-profile-name">
                {profile.fullName?.trim() || "My Account"}
              </span>

              <span className="header-profile-role">
                Personal Account
              </span>
            </div>

            <ChevronDown
              size={16}
              className={`header-profile-chevron ${
                showProfileMenu ? "is-open" : ""
              }`}
            />
          </button>

          {showProfileMenu && (
            <div className="header-profile-dropdown">
              <div className="header-dropdown-user">
                <div className="header-avatar header-dropdown-avatar">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>

                <div>
                  <p className="header-dropdown-name">
                    {profile.fullName?.trim() || "My Account"}
                  </p>

                  <p className="header-dropdown-email">
                    {profile.email || "Personal Account"}
                  </p>
                </div>
              </div>

              <div className="header-dropdown-divider" />

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
