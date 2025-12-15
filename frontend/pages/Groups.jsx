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
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error(err);
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
        console.error("Create group failed:", res.status, text);
        setError("Failed to create group.");
        return;
      }

      const newGroup = await res.json();
      setGroups((prev) => [newGroup, ...prev]);

      setName("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Error creating group.");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="m-0">Groups</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadGroups}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4">
        {/* Create group card */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Create a new group</h5>

              {!isAuthenticated ? (
                <div className="alert alert-warning mb-0">
                  You must be logged in to create a group.
                </div>
              ) : (
                <form onSubmit={handleCreateGroup}>
                  <div className="mb-3">
                    <label className="form-label">Group name</label>
                    <input
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={createLoading}
                      placeholder="e.g. Horror Movie Fans"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description (optional)</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      disabled={createLoading}
                      placeholder="What is this group about?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={createLoading}
                  >
                    {createLoading ? "Creating..." : "Create group"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Group list */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">All groups</h5>

              {loading ? (
                <div className="text-muted">Loading groups...</div>
              ) : groups.length === 0 ? (
                <div className="text-muted">No groups yet.</div>
              ) : (
                <div className="list-group">
                  {groups.map((g) => (
                    <button
                      key={g.group_id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
                      onClick={() => navigate(`/groups/${g.group_id}`)}
                    >
                      <div className="me-3">
                        <div className="fw-semibold">{g.name}</div>
                        {g.description ? (
                          <div className="text-muted small">{g.description}</div>
                        ) : (
                          <div className="text-muted small">No description</div>
                        )}
                        <div className="text-muted small mt-1">
                          Owner: {g.owner_email || "Unknown"}
                        </div>
                      </div>

                      <span className="badge text-bg-secondary rounded-pill">
                        {g.member_count ?? 0}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className="text-muted small mt-3">
                Tip: Click a group to view details (members only).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
