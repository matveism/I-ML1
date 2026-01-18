import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { adminId, requestId } = req.body || {};

  const data = JSON.parse(fs.readFileSync("iml.json", "utf8"));
  const admins = data.admins || [];
  const users = data.users || [];
  const cashoutRequests = data.cashoutRequests || [];

  const admin = admins.find(a => a.AdminID === adminId);
  if (!admin) return res.json({ success: false, error: "Unauthorized" });

  const reqObj = cashoutRequests.find(r => r.id === requestId);
  if (!reqObj) return res.json({ success: false, error: "Request not found" });

  if (reqObj.status !== "pending") {
    return res.json({ success: false, error: "Already processed" });
  }

  const user = users.find(u => u.UserID === reqObj.user);
  if (!user) return res.json({ success: false, error: "User not found" });

  const rewardCode = "IML-" + Math.floor(10000 + Math.random() * 90000);

  user.Rewards = user.Rewards || [];
  user.Rewards.push({
    rewardName: reqObj.rewardName,
    cost: reqObj.cost,
    code: rewardCode,
    approvedAt: new Date().toISOString()
  });

  reqObj.status = "approved";
  reqObj.approvedAt = new Date().toISOString();

  data.users = users;
  data.cashoutRequests = cashoutRequests;
  fs.writeFileSync("iml.json", JSON.stringify(data, null, 2));

  res.json({ success: true, rewardCode });
}
