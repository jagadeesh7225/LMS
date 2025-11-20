import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  userName: String,
  empId: String,
  email: String,

  fromDate: String,
  toDate: String,
  reason: String,
  days: Number,

  status: { type: String, default: "Pending" },
  remark: { type: String, default: "" },

  appliedAt: String,
});

export default mongoose.model("Leave", leaveSchema);
