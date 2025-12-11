import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const isAuthenticated = !!token;

  const loadGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/groups`);
      if (!res.ok) {
        throw new Error(`Failed to load groups (${res.status})`);
      }
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error("Error loading groups:", err);
      setError("Failed to load groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Group name is required.");
      return;
    }

    if (!token) {
      setError("You must be logged in to create a group.");
      return;
    }

    try {
      setCreateLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/groups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to create group:", res.status, text);
        setError("Failed to create group.");
        return;
      }

      const newGroup = await res.json();
      // Add new group to the top of the list
      setGroups((prev) => [newGroup, ...prev]);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Error creating group.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleOpenGroup = (groupId) => {
    // If you want details to require auth, you can still navigate;
    // backend + ProtectedRoute will handle access.
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="groups-container">
      <h2>Groups</h2>

      {error && <p className="error-message">{error}</p>}

      {/* Create group form – only visible when logged in */}
      {isAuthenticated ? (
        <div className="group-create-box">
          <h3>Create a new group</h3>
          <form onSubmit={handleCreateGroup}>
            <div>
              <label>Group name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createLoading}
              />
            </div>
            <div>
              <label>Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={createLoading}
              />
            </div>
            <button type="submit" disabled={createLoading}>
              {createLoading ? "Creating..." : "Create group"}
            </button>
          </form>
        </div>
      ) : (
        <p>You must be logged in to create a group.</p>
      )}

      <hr />

      <h3>All groups</h3>
      {loading ? (
        <p>Loading groups...</p>
      ) : groups.length === 0 ? (
        <p>No groups yet.</p>
      ) : (
        <ul className="group-list">
          {groups.map((group) => (
            <li key={group.group_id} className="group-list-item">
              <div>
                <strong>{group.name}</strong>
                {group.description && (
                  <p style={{ margin: "0.25rem 0" }}>{group.description}</p>
                )}
                <small>
                  Owner: {group.owner_email || "Unknown"} | Members:{" "}
                  {group.member_count ?? 0}
                </small>
              </div>
              <button onClick={() => handleOpenGroup(group.group_id)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
