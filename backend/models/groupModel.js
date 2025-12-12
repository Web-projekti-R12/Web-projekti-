// models/groupModel.js
import db from "../config/db.js";

// List all groups (public)
export async function getAllGroups() {
  const result = await db.query(
    `
    SELECT 
      g.group_id,
      g.name,
      g.description,
      g.owner_id,
      g.created_at,
      u.email AS owner_email,
      COUNT(m.user_id) AS member_count
    FROM groups g
    LEFT JOIN group_members m ON m.group_id = g.group_id
    LEFT JOIN users u ON u.user_id = g.owner_id
    GROUP BY g.group_id, u.email
    ORDER BY g.created_at DESC;
    `
  );
  return result.rows;
}

// Create new group
export async function createGroup(name, description, ownerId) {
  const result = await db.query(
    `
    INSERT INTO groups (name, description, owner_id)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [name, description, ownerId]
  );

  const group = result.rows[0];

  // Add owner as a member
  await db.query(
    `
    INSERT INTO group_members (group_id, user_id, role)
    VALUES ($1, $2, 'owner')
    ON CONFLICT (group_id, user_id) DO NOTHING;
    `,
    [group.group_id, ownerId]
  );

  return group;
}

// Get single group
export async function getGroupById(groupId) {
  const result = await db.query(
    `
    SELECT 
      g.group_id,
      g.name,
      g.description,
      g.owner_id,
      g.created_at,
      u.email AS owner_email
    FROM groups g
    LEFT JOIN users u ON u.user_id = g.owner_id
    WHERE g.group_id = $1;
    `,
    [groupId]
  );
  return result.rows[0] || null;
}

// Check membership
export async function isMember(groupId, userId) {
  const result = await db.query(
    `
    SELECT 1 
    FROM group_members
    WHERE group_id = $1 AND user_id = $2;
    `,
    [groupId, userId]
  );
  return result.rowCount > 0;
}

// Check ownership
export async function isOwner(groupId, userId) {
  const res = await db.query(
    `SELECT 1 FROM groups WHERE group_id = $1 AND owner_id = $2`,
    [groupId, userId]
  );
  return res.rowCount > 0;
}

// Add member (role can be 'member' or 'owner')
export async function addMember(groupId, userId, role = "member") {
  const res = await db.query(
    `
    INSERT INTO group_members (group_id, user_id, role)
    VALUES ($1, $2, $3)
    ON CONFLICT (group_id, user_id) DO NOTHING
    RETURNING *;
    `,
    [groupId, userId, role]
  );
  return res.rows[0] || null;
}

// Remove member
export async function removeMember(groupId, userId) {
  const res = await db.query(
    `DELETE FROM group_members WHERE group_id = $1 AND user_id = $2`,
    [groupId, userId]
  );
  return res.rowCount > 0;
}

// List members
export async function getMembers(groupId) {
  const res = await db.query(
    `
    SELECT m.user_id, m.role, m.joined_at, u.email
    FROM group_members m
    JOIN users u ON u.user_id = m.user_id
    WHERE m.group_id = $1
    ORDER BY m.role DESC, m.joined_at ASC;
    `,
    [groupId]
  );
  return res.rows;
}

// Delete group (only owner)
export async function deleteGroup(groupId, ownerId) {
  const check = await db.query(
    `SELECT owner_id FROM groups WHERE group_id = $1`,
    [groupId]
  );

  if (check.rowCount === 0) {
    return { ok: false, reason: "not_found" };
  }

  if (check.rows[0].owner_id !== ownerId) {
    return { ok: false, reason: "not_owner" };
  }

  await db.query(`DELETE FROM groups WHERE group_id = $1`, [groupId]);

  return { ok: true };
}
