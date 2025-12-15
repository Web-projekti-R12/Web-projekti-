import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const [profile, setProfile] = useState(null);

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmMode, setConfirmMode] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const loadProfile = async () => {
    setError("");
    setSuccess("");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Load profile failed:", res.status, text);
        setError("Failed to load profile.");
        return;
      }

      const data = await res.json();
      setProfile(data);
      setDisplayName(data.display_name || "");
    } catch (err) {
      console.error(err);
      setError("Error loading profile.");
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveDisplayName = async () => {
    setError("");
    setSuccess("");

    const value = displayName.trim();
    if (value.length < 2) {
      setError("Display name must be at least 2 characters.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ display_name: value }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Update profile failed:", res.status, text);
        setError("Failed to update display name.");
        return;
      }

      const updated = await res.json();
      setProfile(updated);
      setSuccess("Profile updated!");
    } catch (err) {
      console.error(err);
      setError("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setConfirmMode(true);
    setConfirmText("");
    setError("");
    setSuccess("");
  };

  const handleCancelDelete = () => {
    setConfirmMode(false);
    setConfirmText("");
  };

  const handleConfirmDelete = async () => {
    setError("");
    setSuccess("");

    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" exactly to confirm.');
      return;
    }

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      setDeleting(true);

      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Delete account failed:", res.status, text);
        setError("Failed to delete account.");
        return;
      }

      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Error deleting account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">Profile</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!profile ? (
        <div className="text-muted">Loading profile...</div>
      ) : (
        <div className="row g-4">
          {/* Profile card */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Account info</h5>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input className="form-control" value={profile.email} disabled />
                  <div className="form-text">
                    Email is used for login.
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Display name</label>
                  <input
                    className="form-control"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. MovieFan99"
                    disabled={saving || deleting}
                  />
                  <div className="form-text">
                    This name will be shown in groups and discussions.
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={saveDisplayName}
                  disabled={saving || deleting || displayName.trim().length < 2}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>

                <button
                  className="btn btn-outline-secondary ms-2"
                  onClick={loadProfile}
                  disabled={saving || deleting}
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="col-12 col-lg-6">
            <div className="card border-danger shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-danger mb-2">Danger zone</h5>
                <p className="text-muted">
                  Deleting your account is permanent. Your user data will be removed.
                </p>

                {!confirmMode ? (
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteClick}
                    disabled={saving || deleting}
                  >
                    Delete account
                  </button>
                ) : (
                  <>
                    <div className="alert alert-warning">
                      Are you sure? Type <strong>DELETE</strong> to confirm.
                    </div>

                    <input
                      className="form-control mb-3"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      disabled={deleting}
                      placeholder='Type "DELETE"'
                    />

                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-danger"
                        onClick={handleConfirmDelete}
                        disabled={deleting || confirmText !== "DELETE"}
                      >
                        {deleting ? "Deleting..." : "Confirm delete"}
                      </button>

                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleCancelDelete}
                        disabled={deleting}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
