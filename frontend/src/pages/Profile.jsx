import { useState } from "react";
import {
  UserRound,
  Pencil,
  Mail,
  Phone,
  MapPin,
  BriefcaseBusiness,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CircleUserRound,
} from "lucide-react";

import "../assets/css/pages/Profile.css";

const PROFILE_STORAGE_KEY = "findash_profile";
const PROFILE_PICTURE_KEY = "findash_profile_picture";
const MAX_IMAGE_SIZE = 1.5 * 1024 * 1024;

const DEFAULT_PROFILE = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  occupation: "",
  bio: "",
};

const loadProfile = () => {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);

    return saved
      ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) }
      : { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
};

const loadProfilePicture = () => {
  try {
    return localStorage.getItem(PROFILE_PICTURE_KEY) || "";
  } catch {
    return "";
  }
};

function Profile() {
  const [profile, setProfile] = useState(loadProfile);
  const [savedProfile, setSavedProfile] = useState(loadProfile);
  const [profilePicture, setProfilePicture] =
    useState(loadProfilePicture);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [pictureError, setPictureError] = useState("");

  // Get initials for the default profile avatar
  const getInitials = (name) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const initials = getInitials(profile.fullName);

  // Profile completion
  const completedFields = [
    profile.fullName,
    profile.email,
    profile.phone,
    profile.location,
    profile.occupation,
    profile.bio,
  ].filter((value) => value.trim()).length;

  // Handle form changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setMessage("");
    setMessageType("");
  };

  // Validate profile form
  const validateProfile = () => {
    const newErrors = {};

    if (!profile.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!profile.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (
      profile.phone.trim() &&
      !/^[0-9+\-\s()]{7,20}$/.test(profile.phone.trim())
    ) {
      newErrors.phone = "Enter a valid phone number.";
    }

    return newErrors;
  };

  // Save profile information
  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validateProfile();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage("");
      setMessageType("");
      return;
    }

    const cleanedProfile = {
      ...profile,
      fullName: profile.fullName.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      location: profile.location.trim(),
      occupation: profile.occupation.trim(),
      bio: profile.bio.trim(),
    };

    try {
      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(cleanedProfile)
      );

      setProfile(cleanedProfile);
      setSavedProfile(cleanedProfile);
      setErrors({});
      setMessage("Profile saved successfully.");
      setMessageType("success");
    } catch (error) {
      console.error("Unable to save profile:", error);

      setMessage("Unable to save your profile. Please try again.");
      setMessageType("error");
    }
  };

  // Discard unsaved changes
  const handleReset = () => {
    setProfile({ ...savedProfile });
    setErrors({});
    setMessage("Unsaved changes have been discarded.");
    setMessageType("info");
  };

  // Upload or change profile picture by clicking the pencil
  const handlePictureChange = (event) => {
    const file = event.target.files?.[0];

    // Allow selecting the same file again
    event.target.value = "";

    if (!file) return;

    setPictureError("");

    if (!file.type.startsWith("image/")) {
      setPictureError("Please select a valid image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setPictureError("Choose an image smaller than 1.5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      if (typeof imageData !== "string") {
        setPictureError("Unable to read this image.");
        return;
      }

      const image = new Image();

      image.onload = () => {
        try {
          localStorage.setItem(PROFILE_PICTURE_KEY, imageData);

          setProfilePicture(imageData);
          setPictureError("");
        } catch (error) {
          console.error("Unable to save image:", error);

          setPictureError(
            "Unable to save the image. Please choose a smaller file."
          );
        }
      };

      image.onerror = () => {
        setPictureError(
          "Unable to open this image. Please select another."
        );
      };

      image.src = imageData;
    };

    reader.onerror = () => {
      setPictureError("Unable to read this image.");
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className="profile-page">
      {/* Page Header */}
      <div className="profile-page-header">
        <div className="profile-heading-icon">
          <UserRound size={23} />
        </div>

        <div>
          <h1>My Profile</h1>
          <p>
            Manage your personal information and profile details.
          </p>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="profile-overview-card">
        <div className="profile-overview-background">
          <div className="profile-background-circle profile-circle-one" />
          <div className="profile-background-circle profile-circle-two" />
        </div>

        <div className="profile-overview-content">
          {/* Profile Picture with Pencil Icon */}
          <div className="profile-picture-section">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="profile-avatar-image"
                  />
                ) : initials ? (
                  <span>{initials}</span>
                ) : (
                  <UserRound size={38} />
                )}
              </div>

              <label
                htmlFor="profile-picture-upload"
                className="profile-picture-edit"
                title="Change profile picture"
                aria-label="Change profile picture"
              >
                <Pencil size={16} />
              </label>

              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                hidden
              />
            </div>

            <div className="profile-picture-details">
              <span className="profile-picture-name">
                Profile Picture
              </span>

              <span className="profile-picture-description">
                Click the pencil to change your photo.
              </span>

              <span className="profile-picture-hint">
                Maximum image size: 1.5 MB
              </span>

              {pictureError && (
                <p className="profile-picture-error" role="alert">
                  <AlertCircle size={14} />
                  {pictureError}
                </p>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="profile-overview-info">
            <span className="profile-overview-label">
              PERSONAL ACCOUNT
            </span>

            <h2>{profile.fullName || "Your Name"}</h2>

            <p>
              <Mail size={15} />
              <span>
                {profile.email || "Add your email address"}
              </span>
            </p>

            <div className="profile-overview-badges">
              <span className="profile-role-badge">
                <ShieldCheck size={14} />
                FinDash User
              </span>

              {profile.occupation && (
                <span className="profile-occupation-badge">
                  <BriefcaseBusiness size={13} />
                  {profile.occupation}
                </span>
              )}
            </div>
          </div>

          {/* Completion Card */}
          <div className="profile-completion">
            <div className="profile-completion-icon">
              <CircleUserRound size={20} />
            </div>

            <div>
              <span>Profile details</span>
              <strong>{completedFields} of 6 completed</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content-grid">
        {/* Left Information Sidebar */}
        <aside className="profile-info-sidebar">
          <div className="profile-sidebar-card">
            <div className="profile-sidebar-heading">
              <div className="profile-sidebar-heading-icon">
                <ShieldCheck size={19} />
              </div>

              <h3>Account Information</h3>
            </div>

            <p className="profile-sidebar-description">
              Keep your information up to date to maintain an
              accurate personal profile.
            </p>

            <div className="profile-sidebar-divider" />

            <div className="profile-info-item">
              <div className="profile-info-item-icon">
                <Mail size={17} />
              </div>

              <div>
                <span>Email address</span>
                <strong>{profile.email || "Not provided"}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-item-icon">
                <Phone size={17} />
              </div>

              <div>
                <span>Phone number</span>
                <strong>{profile.phone || "Not provided"}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-item-icon">
                <MapPin size={17} />
              </div>

              <div>
                <span>Location</span>
                <strong>{profile.location || "Not provided"}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="profile-info-item-icon">
                <BriefcaseBusiness size={17} />
              </div>

              <div>
                <span>Occupation</span>
                <strong>
                  {profile.occupation || "Not provided"}
                </strong>
              </div>
            </div>

            <div className="profile-sidebar-divider" />

            <div className="profile-sidebar-note">
              <CheckCircle2 size={16} />
              <span>
                Your profile details are stored locally in this browser.
              </span>
            </div>
          </div>

          <div className="profile-tip-card">
            <div className="profile-tip-icon">
              <UserRound size={20} />
            </div>

            <h3>Make it yours</h3>

            <p>
              Add your personal details to personalize your FinDash
              experience.
            </p>
          </div>
        </aside>

        {/* Personal Information Form */}
        <div className="profile-form-card">
          <div className="profile-form-header">
            <div>
              <h2>Personal Information</h2>
              <p>
                Update the information associated with your profile.
              </p>
            </div>

            <div className="profile-form-header-icon">
              <UserRound size={21} />
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="profile-form-body">
              {/* Full Name */}
              <div className="profile-form-field">
                <label htmlFor="fullName">
                  Full Name <span>*</span>
                </label>

                <div
                  className={`profile-input-wrapper ${
                    errors.fullName ? "has-error" : ""
                  }`}
                >
                  <UserRound size={17} />

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={profile.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                </div>

                {errors.fullName && (
                  <p className="profile-field-error">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="profile-form-field">
                <label htmlFor="email">
                  Email Address <span>*</span>
                </label>

                <div
                  className={`profile-input-wrapper ${
                    errors.email ? "has-error" : ""
                  }`}
                >
                  <Mail size={17} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                {errors.email && (
                  <p className="profile-field-error">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="profile-form-field">
                <label htmlFor="phone">Phone Number</label>

                <div
                  className={`profile-input-wrapper ${
                    errors.phone ? "has-error" : ""
                  }`}
                >
                  <Phone size={17} />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    autoComplete="tel"
                  />
                </div>

                {errors.phone && (
                  <p className="profile-field-error">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="profile-form-field">
                <label htmlFor="location">Location</label>

                <div className="profile-input-wrapper">
                  <MapPin size={17} />

                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    autoComplete="address-level2"
                  />
                </div>
              </div>

              {/* Occupation */}
              <div className="profile-form-field profile-field-full">
                <label htmlFor="occupation">Occupation</label>

                <div className="profile-input-wrapper">
                  <BriefcaseBusiness size={17} />

                  <input
                    id="occupation"
                    name="occupation"
                    type="text"
                    value={profile.occupation}
                    onChange={handleChange}
                    placeholder="Your profession"
                    autoComplete="organization-title"
                  />
                </div>
              </div>

              {/* About Me */}
              <div className="profile-form-field profile-field-full">
                <div className="profile-label-row">
                  <label htmlFor="bio">About Me</label>
                  <span>{profile.bio.length}/300</span>
                </div>

                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  maxLength={300}
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Write a short introduction about yourself..."
                />

                <p className="profile-field-hint">
                  Briefly introduce yourself.
                </p>
              </div>
            </div>

            {/* Feedback Message */}
            {message && (
              <div
                role="status"
                className={`profile-feedback profile-feedback-${messageType}`}
              >
                {messageType === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}

                <span>{message}</span>
              </div>
            )}

            {/* Form Footer */}
            <div className="profile-form-footer">
              <p className="profile-required-note">
                <span>*</span> Required fields
              </p>

              <div className="profile-form-actions">
                <button
                  type="button"
                  onClick={handleReset}
                  className="profile-reset-button"
                >
                  <RotateCcw size={16} />
                  Discard Changes
                </button>

                <button
                  type="submit"
                  className="profile-save-button"
                >
                  <Save size={17} />
                  Save Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Profile;