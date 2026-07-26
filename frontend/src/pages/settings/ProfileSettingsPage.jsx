import { useEffect, useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import PageLoader from "@/components/common/PageLoader";
import PasswordInput from "@/components/forms/PasswordInput";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import userService from "@/services/userService";
import useAuth from "@/hooks/useAuth";

const ProfileSettingsPage = () => {
  const { updateUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] =
    useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await userService.getCurrentUserProfile();

        setProfile(data);

        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          profileImage: data.profileImage || "",
        });
      } catch (err) {
        console.error(
          "Unable to load user profile.",
          err,
        );

        setError(
          err.response?.data?.message ||
            "Unable to load your profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    if (name === "profileImage") {
      setImageError(false);
    }

    setSuccessMessage("");
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((currentPasswordData) => ({
      ...currentPasswordData,
      [name]: value,
    }));

    setPasswordError("");
    setPasswordSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const updatedProfile =
        await userService.updateCurrentUserProfile(
          formData,
        );

      setProfile(updatedProfile);
      updateUser(updatedProfile);

      setFormData({
        name: updatedProfile.name || "",
        bio: updatedProfile.bio || "",
        profileImage: updatedProfile.profileImage || "",
      });

      setSuccessMessage(
        "Profile updated successfully.",
      );
    } catch (err) {
      console.error(
        "Unable to update user profile.",
        err,
      );

      setError(
        err.response?.data?.message ||
          "Unable to update your profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters.",
      );
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordError("");
      setPasswordSuccessMessage("");

      const response = await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordSuccessMessage(response.message);
    } catch (err) {
      console.error(
        "Unable to change password.",
        err,
      );

      setPasswordError(
        err.response?.data ||
          "Unable to change your password. Please try again.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleOpenPasswordForm = () => {
    setError("");
    setSuccessMessage("");
    setPasswordError("");
    setPasswordSuccessMessage("");
    setIsChangingPassword(true);
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordError("");
    setPasswordSuccessMessage("");
    setIsChangingPassword(false);
  };

  if (loading) {
    return <PageLoader message="Loading profile..." />;
  }

  if (!profile) {
    return (
      <div
        role="alert"
        className="
          rounded-card
          border border-danger/20
          bg-danger/5
          px-4 py-3
          text-sm text-danger
        "
      >
        {error || "Profile could not be loaded."}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-8">
        <h1
          className="
            text-2xl font-semibold
            tracking-tight text-text
          "
        >
          Profile & Settings
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          Manage your profile information and account settings.
        </p>
      </div>

      <div
        className="
          rounded-card
          border border-border
          bg-surface
          p-5
          shadow-sm
          sm:p-6
          lg:p-8
        "
      >
        {!isChangingPassword ? (
          <>
            <div
              className="
                flex flex-col gap-4
                border-b border-border
                pb-6
                sm:flex-row sm:items-center
              "
            >
              {profile.profileImage && !imageError ? (
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  onError={() => setImageError(true)}
                  className="
                    h-16 w-16
                    shrink-0
                    rounded-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex h-16 w-16
                    shrink-0
                    items-center justify-center
                    rounded-full
                    bg-primary-light
                    text-lg font-semibold
                    text-primary
                  "
                >
                  {getInitials(profile.name)}
                </div>
              )}

              <div className="min-w-0">
                <h2
                  className="
                    truncate
                    text-lg font-semibold
                    text-text
                  "
                >
                  {profile.name}
                </h2>

                <p
                  className="
                    mt-1 truncate
                    text-sm text-text-secondary
                  "
                >
                  {profile.email}
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              {error && (
                <div
                  role="alert"
                  className="
                    rounded-card
                    border border-danger/20
                    bg-danger/5
                    px-4 py-3
                    text-sm text-danger
                  "
                >
                  {error}
                </div>
              )}

              {successMessage && (
                <div
                  role="status"
                  className="
                    rounded-card
                    border border-success/20
                    bg-success/10
                    px-4 py-3
                    text-sm text-success
                  "
                >
                  {successMessage}
                </div>
              )}

              <div
                className="
                  grid grid-cols-1 gap-5
                  md:grid-cols-2
                "
              >
                <Input
                  id="name"
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />

                <Input
                  id="email"
                  label="Email"
                  value={profile.email}
                  leftIcon={Mail}
                  disabled
                  helperText="Email cannot be changed."
                />
              </div>

              <Textarea
                id="bio"
                name="bio"
                label="Bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell your team a little about yourself"
                helperText="A short description shown on your profile."
              />

              <Input
                id="profileImage"
                name="profileImage"
                label="Profile Image URL"
                type="url"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
                helperText="Enter a direct URL to your profile image."
              />

              <div
                className="
                  flex flex-col-reverse gap-3
                  border-t border-border
                  pt-5
                  sm:flex-row sm:justify-end
                "
              >
                <Button
                  type="button"
                  variant="secondary"
                  leftIcon={LockKeyhole}
                  onClick={handleOpenPasswordForm}
                >
                  Change Password
                </Button>

                <Button
                  type="submit"
                  loading={saving}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div
              className="
                flex items-start gap-3
                border-b border-border
                pb-6
              "
            >
              <div
                className="
                  flex h-10 w-10
                  shrink-0
                  items-center justify-center
                  rounded-button
                  bg-primary-light
                  text-primary
                "
              >
                <LockKeyhole className="h-5 w-5" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-text">
                  Change Password
                </h2>

                <p className="mt-1 text-sm text-text-secondary">
                  Update your account password.
                </p>
              </div>
            </div>

            <form
              onSubmit={handlePasswordSubmit}
              className="mt-6 space-y-5"
            >
              {passwordError && (
                <div
                  role="alert"
                  className="
                    rounded-card
                    border border-danger/20
                    bg-danger/5
                    px-4 py-3
                    text-sm text-danger
                  "
                >
                  {passwordError}
                </div>
              )}

              {passwordSuccessMessage && (
                <div
                  role="status"
                  className="
                    rounded-card
                    border border-success/20
                    bg-success/10
                    px-4 py-3
                    text-sm text-success
                  "
                >
                  {passwordSuccessMessage}
                </div>
              )}

              <PasswordInput
                id="currentPassword"
                name="currentPassword"
                label="Current Password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter your current password"
                autoComplete="current-password"
                required
              />

              <div
                className="
                  grid grid-cols-1 gap-5
                  md:grid-cols-2
                "
              >
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  helperText="Password must be at least 6 characters."
                  required
                />

                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div
                className="
                  flex flex-col-reverse gap-3
                  border-t border-border
                  pt-5
                  sm:flex-row sm:justify-end
                "
              >
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancelPasswordChange}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={changingPassword}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSettingsPage;