// models/groupRequestModel.js
import db from '../config/db.js';

export async function createJoinRequest(groupId, userId) {
  const result = await db.query(
    `
    INSERT INTO group_join_requests (group_id, user_id, status)
    VALUES ($1, $2, 'pending')
    ON CONFLICT (group_id, user_id)
    DO UPDATE SET status='pending', created_at=CURRENT_TIMESTAMP, decided_at=NULL, decided_by=NULL
    RETURNING *;
    `,
    [groupId, userId]
  );
  return result.rows[0];
}

export async function getPendingRequests(groupId) {
  const result = await db.query(
    `
    SELECT r.request_id, r.group_id, r.user_id, r.status, r.created_at, u.email
    FROM group_join_requests r
    JOIN users u ON u.user_id = r.user_id
    WHERE r.group_id = $1 AND r.status = 'pending'
    ORDER BY r.created_at ASC;
    `,
    [groupId]
  );
  return result.rows;
}

export async function getRequestById(requestId) {
  const result = await db.query(
    `SELECT * FROM group_join_requests WHERE request_id = $1`,
    [requestId]
  );
  return result.rows[0] || null;
}

export async function setRequestStatus(requestId, status, decidedBy) {
  const result = await db.query(
    `
    UPDATE group_join_requests
    SET status = $2, decided_at = CURRENT_TIMESTAMP, decided_by = $3
    WHERE request_id = $1
    RETURNING *;
    `,
    [requestId, status, decidedBy]
  );
  return result.rows[0] || null;
}
