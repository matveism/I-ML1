import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { adminId, userId, passId, balance, reversal } = req.body || {};

  const data = JSON.parse(fs.readFileSync("iml.json", "utf8"));
  const admins = data.admins || [];
  const users = data.users || [];

  const admin = admins.find(a => a.AdminID === adminId);
  if (!admin) return res.json({ success: false, error: "Unauthorized" });

  if (users.find(u => u.UserID === userId)) {
    return res.json({ success: false, error: "User already exists" });
  }

  users.push({
    UserID: userId,
    PassID: passId,
    Balance: Number(balance) || 0,
    Reversal: Number(reversal) || 0,
    TotalCorrect: 0,
    TotalQuestions: 0,
    Rewards: []
  });

  data.users = users;
  fs.writeFileSync("iml.json", JSON.stringify(data, null, 2));

  res.json({ success: true });
}
