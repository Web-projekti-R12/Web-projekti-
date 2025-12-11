import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");
  const [notMember, setNotMember] = useState(false);

  const token = localStorage.getItem("authToken");

  const loadGroup = async () => {
    setLoading(true);
    setError("");
    setNotMember(false);

    if (!token) {
      setError("You must be logged in to view this group.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        // User is not a member
        setNotMember(true);
        setGroup(null);
        setLoading(false);
        return;
      }

      if (res.status === 404) {
        setError("Group not found.");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to load group:", res.status, text);
        setError("Failed to load group.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setGroup(data);
    } catch (err) {
      console.error("Error loading group:", err);
      setError("Error loading group.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleJoin = async () => {
    if (!token) {
      setError("You must be logged in to join this group.");
      return;
    }

    setJoinLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${id}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to join group:", res.status, text);
        setError("Failed to join group.");
        setJoinLoading(false);
        return;
      }

      // Joined → reload group details
      await loadGroup();
    } catch (err) {
      console.error("Error joining group:", err);
      setError("Error joining group.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;

    const sure = window.confirm(
      "Are you sure you want to delete this group? This cannot be undone."
    );
    if (!sure) return;

    setDeleteLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        setError("Only the owner can delete this group.");
        setDeleteLoading(false);
        return;
      }

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Failed to delete group:", res.status, text);
        setError("Failed to delete group.");
        setDeleteLoading(false);
        return;
      }

      // Successfully deleted
      navigate("/groups");
    } catch (err) {
      console.error("Error deleting group:", err);
      setError("Error deleting group.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="group-detail-container">
      {loading ? (
        <p>Loading group...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : notMember ? (
        <div>
          <h2>Group</h2>
          <p>You are not a member of this group.</p>
          <button onClick={handleJoin} disabled={joinLoading}>
            {joinLoading ? "Joining..." : "Join group"}
          </button>
        </div>
      ) : group ? (
        <div>
          <h2>{group.name}</h2>
          {group.description && <p>{group.description}</p>}
          <p>
            <small>
              Owner: {group.owner_email || "Unknown"} | Created:{" "}
              {new Date(group.created_at).toLocaleString()}
            </small>
          </p>

          {/* Placeholder for future content like group messages, etc. */}
          <div style={{ marginTop: "1rem" }}>
            <h3>Group content</h3>
            <p>Only visible to members. (You can add messages, movies, etc. later.)</p>
          </div>

          {group.isOwner && (
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                style={{ color: "white", backgroundColor: "red" }}
              >
                {deleteLoading ? "Deleting..." : "Delete group"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Group not found.</p>
      )}
    </div>
  );
}
