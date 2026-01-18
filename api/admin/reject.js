import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { adminId, requestId } = req.body || {};

  const data = JSON.parse(fs.readFileSync("iml.json", "utf8"));
  const admins = data.admins || [];
  const cashoutRequests = data.cashoutRequests || [];

  const admin = admins.find(a => a.AdminID === adminId);
  if (!admin) return res.json({ success: false, error: "Unauthorized" });

  const reqObj = cashoutRequests.find(r => r.id === requestId);
  if (!reqObj) return res.json({ success: false, error: "Request not found" });

  if (reqObj.status !== "pending") {
    return res.json({ success: false, error: "Already processed" });
  }

  reqObj.status = "rejected";
  reqObj.rejectedAt = new Date().toISOString();

  data.cashoutRequests = cashoutRequests;
  fs.writeFileSync("iml.json", JSON.stringify(data, null, 2));

  res.json({ success: true });
}
