import Leave from "../models/Leave.js";

/* ---------------------------------------------------
   APPLY LEAVE
--------------------------------------------------- */
export const applyLeave = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;

    // BLOCK duplicate pending leave with overlapping dates
    const clash = await Leave.findOne({
      email: user.email,
      status: "Pending",
      $or: [
        {
          fromDate: { $lte: data.toDate },
          toDate: { $gte: data.fromDate },
        },
      ],
    });

    if (clash) {
      return res.json({
        success: false,
        message:
          "Your previous leave request is still pending. Please cancel it before applying again.",
      });
    }

    // Create new leave
    const newLeave = await Leave.create({
      ...data,
      userName: user.name,
      empId: user.empId,
      email: user.email,
      appliedAt: new Date().toISOString(),
    });

    res.json({ success: true, leave: newLeave });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};

/* ---------------------------------------------------
   GET USER LEAVES
--------------------------------------------------- */
export const getMyLeaves = async (req, res) => {
  const leaves = await Leave.find({ email: req.user.email }).sort({
    appliedAt: -1,
  });

  res.json({ success: true, leaves });
};

/* ---------------------------------------------------
   ADMIN: ALL LEAVES
--------------------------------------------------- */
export const adminAllLeaves = async (req, res) => {
  const leaves = await Leave.find().sort({ appliedAt: -1 });
  res.json({ success: true, leaves });
};

/* ---------------------------------------------------
   ADMIN: UPDATE STATUS
--------------------------------------------------- */
export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status, remark } = req.body;

  await Leave.findByIdAndUpdate(id, { status, remark });
  res.json({ success: true });
};

/* ---------------------------------------------------
   USER: CANCEL LEAVE
--------------------------------------------------- */
export const cancelLeave = async (req, res) => {
  const { id } = req.params;

  const leave = await Leave.findById(id);
  if (!leave)
    return res.json({ success: false, message: "Leave not found" });

  if (leave.status !== "Pending")
    return res.json({
      success: false,
      message: "Only pending leaves can be cancelled",
    });

  leave.status = "Cancelled";
  leave.remark = "Cancelled by user";
  await leave.save();

  res.json({ success: true });
};
