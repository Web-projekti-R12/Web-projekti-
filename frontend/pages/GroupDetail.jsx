import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const [group, setGroup] = useState(null);
  const [notMember, setNotMember] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const loadMembers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${id}/members`, {
        headers: authHeaders,
      });
      if (!res.ok) return;
      setMembers(await res.json());
    } catch (err) {
      console.error("Members load error:", err);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${id}/requests`, {
        headers: authHeaders,
      });
      if (!res.ok) return;
      setRequests(await res.json());
    } catch (err) {
      console.error("Requests load error:", err);
    }
  };

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
        headers: authHeaders,
      });

      if (res.status === 403) {
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
        console.error("Load group failed:", res.status, text);
        setError("Failed to load group.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setGroup(data);

      await loadMembers();
      if (data.isOwner) await loadRequests();
    } catch (err) {
      console.error(err);
      setError("Error loading group.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const requestToJoin = async () => {
    setActionLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${id}/requests`, {
        method: "POST",
        headers: authHeaders,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Request join failed:", res.status, text);
        setError("Failed to send request.");
        return;
      }

      setRequestSent(true);
    } catch (err) {
      console.error(err);
      setError("Error sending request.");
    } finally {
      setActionLoading(false);
    }
  };

  const approve = async (requestId) => {
    setActionLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/groups/${id}/requests/${requestId}/approve`,
        { method: "POST", headers: authHeaders }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Approve failed:", res.status, text);
        setError("Failed to approve.");
        return;
      }

      await loadRequests();
      await loadMembers();
    } catch (err) {
      console.error(err);
      setError("Error approving request.");
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async (requestId) => {
    setActionLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/groups/${id}/requests/${requestId}/reject`,
        { method: "POST", headers: authHeaders }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Reject failed:", res.status, text);
        setError("Failed to reject.");
        return;
      }

      await loadRequests();
    } catch (err) {
      console.error(err);
      setError("Error rejecting request.");
    } finally {
      setActionLoading(false);
    }
  };

  const leaveGroup = async () => {
    const ok = window.confirm("Leave this group?");
    if (!ok) return;

    setActionLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${id}/leave`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Leave failed:", res.status, text);
        setError("Failed to leave group.");
        return;
      }

      navigate("/groups");
    } catch (err) {
      console.error(err);
      setError("Error leaving group.");
    } finally {
      setActionLoading(false);
    }
  };

  const removeMember = async (userId) => {
    const ok = window.confirm("Remove this member from the group?");
    if (!ok) return;

    setActionLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/groups/${id}/members/${userId}`,
        { method: "DELETE", headers: authHeaders }
      );

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Remove member failed:", res.status, text);
        setError("Failed to remove member.");
        return;
      }

      await loadMembers();
    } catch (err) {
      console.error(err);
      setError("Error removing member.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteGroup = async () => {
    const ok = window.confirm("Delete this group permanently?");
    if (!ok) return;

    setActionLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Delete group failed:", res.status, text);
        setError("Failed to delete group.");
        return;
      }

      navigate("/groups");
    } catch (err) {
      console.error(err);
      setError("Error deleting group.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button className="btn btn-link px-0 mb-3" onClick={() => navigate("/groups")}>
        ← Back to groups
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {notMember ? (
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title">Group</h4>
            {!requestSent ? (
              <>
                <p className="text-muted">
                  You are not a member of this group.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={requestToJoin}
                  disabled={actionLoading}
                >
                  {actionLoading ? "Sending..." : "Request to join"}
                </button>
              </>
            ) : (
              <div className="alert alert-success mb-0">
                Request sent! Please wait for approval.
              </div>
            )}
          </div>
        </div>
      ) : !group ? (
        <div className="alert alert-warning">Group not found.</div>
      ) : (
        <div className="row g-4">
          {/* Group info */}
          <div className="col-12 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title mb-1">{group.name}</h3>
                <div className="text-muted small mb-3">
                  Owner: {group.owner_email || "Unknown"}
                </div>

                {group.description ? (
                  <p className="mb-3">{group.description}</p>
                ) : (
                  <p className="text-muted mb-3">No description.</p>
                )}

                {!group.isOwner && (
                  <button
                    className="btn btn-outline-danger"
                    onClick={leaveGroup}
                    disabled={actionLoading}
                  >
                    Leave group
                  </button>
                )}

                {group.isOwner && (
                  <button
                    className="btn btn-danger"
                    onClick={deleteGroup}
                    disabled={actionLoading}
                  >
                    Delete group
                  </button>
                )}
              </div>
            </div>

            {/* Future feature placeholder */}
            <div className="card shadow-sm mt-4">
              <div className="card-body">
                <h5 className="card-title">Group content</h5>
                <p className="text-muted mb-0">
                  This section is reserved for future features (posts, shared movies, etc.).
                </p>
              </div>
            </div>
          </div>

          {/* Members + requests */}
          <div className="col-12 col-lg-7">
            {/* Members */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h5 className="card-title mb-0">Members</h5>
                  <span className="badge text-bg-secondary">
                    {members.length}
                  </span>
                </div>

                {members.length === 0 ? (
                  <div className="text-muted">No members found.</div>
                ) : (
                  <ul className="list-group">
                    {members.map((m) => (
                      <li
                        key={m.user_id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div className="fw-semibold">{m.email}</div>
                          <div className="text-muted small">{m.role}</div>
                        </div>

                        {group.isOwner && m.role !== "owner" && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeMember(m.user_id)}
                            disabled={actionLoading}
                          >
                            Remove
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Requests (owner only) */}
            {group.isOwner && (
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Join requests</h5>

                  {requests.length === 0 ? (
                    <div className="text-muted">No pending requests.</div>
                  ) : (
                    <ul className="list-group">
                      {requests.map((r) => (
                        <li
                          key={r.request_id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div className="fw-semibold">{r.email}</div>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => approve(r.request_id)}
                              disabled={actionLoading}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => reject(r.request_id)}
                              disabled={actionLoading}
                            >
                              Reject
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
