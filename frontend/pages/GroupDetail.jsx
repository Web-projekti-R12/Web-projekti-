import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddMovieToGroup from "../components/AddMovieToGroup";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TMDB_KEY = import.meta.env.VITE_APP_TMDB_API_KEY;


export default function GroupDetail() {
  const { id } = useParams();
  const groupId = Number(id);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  // group access
  const [group, setGroup] = useState(null);
  const [notMember, setNotMember] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // group stuff
  const [members, setMembers] = useState([]);
  const [requests, setRequests] = useState([]);

  // group movies
  const [groupMovies, setGroupMovies] = useState([]); // enriched with TMDB data
  const [moviesLoading, setMoviesLoading] = useState(false);

  // discussion
  const [selected, setSelected] = useState(null); // selected group movie object
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  // ui state
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------- loaders ----------
  const loadMembers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/members`, {
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
      const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/requests`, {
        headers: authHeaders,
      });
      if (!res.ok) return;
      setRequests(await res.json());
    } catch (err) {
      console.error("Requests load error:", err);
    }
  };

  const fetchTmdbMovie = async (tmdbMovieId) => {
    const url = `https://api.themoviedb.org/3/movie/${tmdbMovieId}?api_key=${TMDB_KEY}&language=en-US`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
  };

  const loadGroupMovies = async (keepSelected = true) => {
    setMoviesLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/movies`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        // members only, so ignore if not allowed
        setGroupMovies([]);
        return;
      }

      const rows = await res.json(); // [{group_movie_id, tmdb_movie_id, added_by_email, created_at ...}]
      const enriched = await Promise.all(
        rows.map(async (gm) => {
          try {
            const tmdb = await fetchTmdbMovie(gm.tmdb_movie_id);
            return {
              ...gm,
              title: tmdb.title,
              overview: tmdb.overview,
              poster_path: tmdb.poster_path,
              release_date: tmdb.release_date,
            };
          } catch {
            return { ...gm, title: `TMDB #${gm.tmdb_movie_id}` };
          }
        })
      );

      setGroupMovies(enriched);

      if (!keepSelected) {
        setSelected(null);
        setComments([]);
        return;
      }

      // if we already selected a movie, keep it if still exists
      if (selected) {
        const stillThere = enriched.find(
          (x) => x.group_movie_id === selected.group_movie_id
        );
        setSelected(stillThere || null);
        if (!stillThere) setComments([]);
      }
    } catch (err) {
      console.error("Group movies load error:", err);
    } finally {
      setMoviesLoading(false);
    }
  };

  const loadComments = async (groupMovieId) => {
    setCommentsLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/groups/${groupId}/movies/${groupMovieId}/comments`,
        { headers: authHeaders }
      );

      if (!res.ok) {
        setComments([]);
        return;
      }

      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Comments load error:", err);
      setComments([]);
    } finally {
      setCommentsLoading(false);
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
      const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}`, {
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
      await loadGroupMovies(true);
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
  }, [groupId]);

  // ---------- actions ----------
  const requestToJoin = async () => {
    setActionLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/requests`, {
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
        `${API_BASE_URL}/api/groups/${groupId}/requests/${requestId}/approve`,
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
        `${API_BASE_URL}/api/groups/${groupId}/requests/${requestId}/reject`,
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
      const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}/leave`, {
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
        `${API_BASE_URL}/api/groups/${groupId}/members/${userId}`,
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
      const res = await fetch(`${API_BASE_URL}/api/groups/${groupId}`, {
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

  const removeGroupMovie = async (groupMovieId) => {
    const ok = window.confirm("Remove this movie from the group?");
    if (!ok) return;

    setActionLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/groups/${groupId}/movies/${groupMovieId}`,
        { method: "DELETE", headers: authHeaders }
      );

      if (!res.ok && res.status !== 204) {
        const text = await res.text();
        console.error("Remove group movie failed:", res.status, text);
        setError("Failed to remove movie.");
        return;
      }

      // if removed movie was selected, clear selection
      const removedWasSelected =
        selected && selected.group_movie_id === groupMovieId;

      await loadGroupMovies(!removedWasSelected);
      if (removedWasSelected) {
        setSelected(null);
        setComments([]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
      setError("Error removing movie.");
    } finally {
      setActionLoading(false);
    }
  };

  const selectMovie = async (gm) => {
    setSelected(gm);
    setNewComment("");
    await loadComments(gm.group_movie_id);
  };

  const submitComment = async () => {
    if (!selected) return;

    const content = newComment.trim();
    if (!content) return;

    setActionLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/groups/${groupId}/movies/${selected.group_movie_id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Add comment failed:", res.status, text);
        setError("Failed to add comment.");
        return;
      }

      setNewComment("");
      await loadComments(selected.group_movie_id);
    } catch (err) {
      console.error(err);
      setError("Error adding comment.");
    } finally {
      setActionLoading(false);
    }
  };

  // ---------- render ----------
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
                <p className="text-muted mb-3">
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
          {/* LEFT: Group info + add movie */}
          <div className="col-12 col-lg-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h3 className="card-title mb-1">{group.name}</h3>
                <div className="text-muted small mb-3 fw-semibold">
                  Group owner: {group.owner_name || "Unknown"}
                </div>

                {group.description ? (
                  <p className="mb-3">{group.description}</p>
                ) : (
                  <p className="text-muted mb-3">No description.</p>
                )}

                <div className="d-flex gap-2 flex-wrap">
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

                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => loadGroup()}
                    disabled={actionLoading}
                    title="Reload group data"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            {/* Add movie */}
            <AddMovieToGroup
              groupId={groupId}
              onAdded={() => loadGroupMovies(true)}
            />

            {/* Members */}
            <div className="card shadow-sm mt-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">Members</h5>
                  <span className="badge text-bg-secondary">{members.length}</span>
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
                          <strong>{m.name}</strong>
                          {m.role === "owner" && (
                            <span className="badge bg-primary ms-2">Owner</span>
                          )}
                        </div>

                        {m.role !== "owner" && (
                          <span className="badge bg-secondary text-capitalize">
                            {m.role}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Join requests (owner only) */}
            {group.isOwner && (
              <div className="card shadow-sm mt-4">
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

          {/* RIGHT: Movie list + discussion pane */}
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">Group Movies</h5>
                  <div className="d-flex gap-2 align-items-center">
                    {moviesLoading && <span className="text-muted small">Loading...</span>}
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => loadGroupMovies(true)}
                      disabled={moviesLoading || actionLoading}
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {groupMovies.length === 0 ? (
                  <div className="text-muted">
                    No movies added yet. Add one to start a discussion.
                  </div>
                ) : (
                  <div className="row g-3">
                    {/* Left pane: movie list */}
                    <div className="col-12 col-md-5">
                      <div className="list-group">
                        {groupMovies.map((gm) => {
                          const isActive =
                            selected && selected.group_movie_id === gm.group_movie_id;

                          return (
                            <button
                              key={gm.group_movie_id}
                              className={`list-group-item list-group-item-action d-flex gap-2 ${
                                isActive ? "active" : ""
                              }`}
                              onClick={() => selectMovie(gm)}
                              style={{ textAlign: "left" }}
                            >
                              <img
                                src={
                                  gm.poster_path
                                    ? `https://image.tmdb.org/t/p/w92${gm.poster_path}`
                                    : "https://via.placeholder.com/92x138?text=No+Image"
                                }
                                alt={gm.title || "Movie"}
                                style={{ width: 46, height: 69, objectFit: "cover", borderRadius: 4 }}
                              />

                              <div className="flex-grow-1">
                                <div className="fw-semibold">
                                  {gm.title || `TMDB #${gm.tmdb_movie_id}`}
                                </div>
                                <div className="small">
                                  {gm.release_date ? gm.release_date.slice(0, 4) : "—"}
                                </div>
                                <div className={`small ${isActive ? "text-white-50" : "text-muted"}`}>
                                  Added by: {gm.added_by_name || gm.added_by_email || "Unknown"}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right pane: discussion */}
                    <div className="col-12 col-md-7">
                      {!selected ? (
                        <div className="text-muted">
                          Select a movie from the list to view and join the discussion.
                        </div>
                      ) : (
                        <div>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="mb-1">{selected.title}</h5>
                            </div>

                            {group.isOwner && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeGroupMovie(selected.group_movie_id)}
                                disabled={actionLoading}
                              >
                                Remove movie
                              </button>
                            )}
                          </div>

                          {selected.overview && (
                            <p className="small text-muted">{selected.overview}</p>
                          )}

                          <hr />

                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">Talk about a movie</h6>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => loadComments(selected.group_movie_id)}
                              disabled={commentsLoading || actionLoading}
                            >
                              Refresh
                            </button>
                          </div>

                          {commentsLoading ? (
                            <div className="text-muted">Loading comments...</div>
                          ) : comments.length === 0 ? (
                            <div className="text-muted">No comments yet. Be the first!</div>
                          ) : (
                            <div className="list-group mb-3">
                              {comments.map((c) => (
                                <div key={c.comment_id} className="list-group-item">
                                  <div className="d-flex justify-content-between">
                                    <div className="fw-semibold">{c.author_name || c.email || "Unknown"}</div>
                                    <div className="text-muted small">
                                      {new Date(c.created_at).toLocaleString()}
                                    </div>
                                  </div>
                                  <div>{c.content}</div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="input-group">
                            <input
                              className="form-control"
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              disabled={actionLoading}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") submitComment();
                              }}
                            />
                            <button
                              className="btn btn-primary"
                              onClick={submitComment}
                              disabled={actionLoading || !newComment.trim()}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
