import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { adminId } = req.body || {};

  const data = JSON.parse(fs.readFileSync("iml.json", "utf8"));
  const admins = data.admins || [];
  const cashoutRequests = data.cashoutRequests || [];

  const admin = admins.find(a => a.AdminID === adminId);
  if (!admin) return res.json({ success: false, error: "Unauthorized" });

  const pending = cashoutRequests.filter(r => r.status === "pending");

  res.json({ success: true, requests: pending });
}
