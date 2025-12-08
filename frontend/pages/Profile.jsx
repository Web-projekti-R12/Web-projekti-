import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const [confirmMode, setConfirmMode] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteClick = () => {
    setConfirmMode(true);
    setConfirmText("");
    setError("");
  };

  const handleConfirmDelete = async () => {
    if (confirmText !== "DELETE") {
      setError('Please type "DELETE" exactly to confirm.');
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You are not logged in.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Delete account failed:", res.status, text);
        setError("Failed to delete account.");
        setLoading(false);
        return;
      }

      localStorage.removeItem("authToken");
      navigate("/login");
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Error deleting account.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmMode(false);
    setConfirmText("");
    setError("");
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      {error && <p className="error-message">{error}</p>}

      {!confirmMode ? (
        <button className="danger-button" onClick={handleDeleteClick}>
          Delete account
        </button>
      ) : (
        <div className="delete-confirm-box">
          <p>Are you sure you want to delete your account?</p>
          <p>
            Type <strong>DELETE</strong> to confirm.
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={loading}
          />

          <div style={{ marginTop: "10px" }}>
            <button
              onClick={handleConfirmDelete}
              disabled={loading || confirmText !== "DELETE"}
            >
              {loading ? "Deleting..." : "Confirm delete"}
            </button>
            <button onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
