const db = require("../database/db");

const addHistoryEntry = async ({ workOrderId, fromStatus, toStatus, note, changedByUserId }) => {
  const [result] = await db.query(
    `INSERT INTO work_order_status_history
     (work_order_id, from_status, to_status, note, changed_by_user_id)
     VALUES (?, ?, ?, ?, ?)`,
    [workOrderId, fromStatus, toStatus, note || null, changedByUserId]
  );

  return { id: result.insertId, workOrderId, fromStatus, toStatus, note, changedByUserId };
};

const getHistoryByOrderId = async (workOrderId, { page = 1, limit = 100 } = {}) => {
  const offset = (page - 1) * limit;

  const [countRows] = await db.query(
    "SELECT COUNT(*) AS total FROM work_order_status_history WHERE work_order_id = ?",
    [workOrderId]
  );
  const total = countRows[0].total;

  const [rows] = await db.query(
    `SELECT h.id, h.work_order_id, h.from_status, h.to_status, h.note,
            h.changed_by_user_id, u.name AS changed_by_name, h.created_at
     FROM work_order_status_history h
     JOIN users u ON u.id = h.changed_by_user_id
     WHERE h.work_order_id = ?
     ORDER BY h.created_at DESC
     LIMIT ? OFFSET ?`,
    [workOrderId, limit, offset]
  );

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { addHistoryEntry, getHistoryByOrderId };
