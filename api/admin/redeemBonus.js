import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { user, code } = req.body || {};

  const data = JSON.parse(fs.readFileSync("iml.json", "utf8"));
  const users = data.users || [];
  const bonusCodes = data.bonusCodes || [];

  const u = users.find(x => x.UserID === user);
  if (!u) return res.json({ success: false, error: "User not found" });

  const c = bonusCodes.find(b => b.code.toLowerCase() === String(code).toLowerCase());
  if (!c) return res.json({ success: false, error: "Invalid code" });

  if (c.expires && new Date(c.expires) < new Date()) {
    return res.json({ success: false, error: "Code expired" });
  }

  if (!c.multiUse && c.usedBy.includes(user)) {
    return res.json({ success: false, error: "Code already used" });
  }

  u.Balance += Number(c.amount);

  if (!c.multiUse) c.usedBy.push(user);

  fs.writeFileSync("iml.json", JSON.stringify(data, null, 2));

  res.json({
    success: true,
    amount: c.amount,
    newBalance: u.Balance
  });
}
