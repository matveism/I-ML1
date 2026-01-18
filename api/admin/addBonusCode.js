import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { adminId, code, amount, expires, multiUse } = req.body || {};

  const data = JSON.parse(fs.readFileSync("iml.json", "utf8"));
  const admins = data.admins || [];
  const bonusCodes = data.bonusCodes || [];

  const admin = admins.find(a => a.AdminID === adminId);
  if (!admin) return res.json({ success: false, error: "Unauthorized" });

  bonusCodes.push({
    code,
    amount: Number(amount),
    expires: expires || null,
    multiUse: String(multiUse) === "true",
    usedBy: []
  });

  data.bonusCodes = bonusCodes;
  fs.writeFileSync("iml.json", JSON.stringify(data, null, 2));

  res.json({ success: true });
}
