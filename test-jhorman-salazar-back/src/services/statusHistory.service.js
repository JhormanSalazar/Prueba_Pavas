const prisma = require("../lib/prisma");

const addHistoryEntry = async ({ workOrderId, fromStatus, toStatus, note, changedByUserId }) => {
  const entry = await prisma.workOrderStatusHistory.create({
    data: {
      workOrderId: Number(workOrderId),
      fromStatus,
      toStatus,
      note: note || null,
      changedByUserId: Number(changedByUserId),
    },
    select: { id: true, workOrderId: true, fromStatus: true, toStatus: true, note: true, changedByUserId: true },
  });

  return entry;
};

const getHistoryByOrderId = async (workOrderId, { page = 1, limit = 100 } = {}) => {
  const where = { workOrderId: Number(workOrderId) };
  const skip = (page - 1) * limit;

  const [total, rows] = await Promise.all([
    prisma.workOrderStatusHistory.count({ where }),
    prisma.workOrderStatusHistory.findMany({
      where,
      include: {
        changedBy: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
  ]);

  const data = rows.map((h) => ({
    id: h.id,
    work_order_id: h.workOrderId,
    from_status: h.fromStatus,
    to_status: h.toStatus,
    note: h.note,
    changed_by_user_id: h.changedByUserId,
    changed_by_name: h.changedBy.name,
    created_at: h.createdAt,
  }));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { addHistoryEntry, getHistoryByOrderId };
