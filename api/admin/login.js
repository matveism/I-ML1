import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { adminId, adminPass } = req.body || {};

  const data = JSON.parse(fs.readFileSync("iml.json", "utf8"));
  const admins = data.admins || [];

  const found = admins.find(a => a.AdminID === adminId && a.AdminPass === adminPass);

  if (!found) return res.json({ success: false, error: "Invalid admin login" });

  res.json({ success: true, AdminID: found.AdminID });
}
