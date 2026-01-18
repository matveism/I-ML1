import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { user, cost, rewardName } = req.body || {};

  const data = JSON.parse(fs.readFileSync("iml.json", "utf8"));
  const users = data.users || [];
  const cashoutOptions = data.cashoutOptions || [];

  const u = users.find(x => x.UserID === user);
  if (!u) return res.json({ success: false, error: "User not found" });

  const option = cashoutOptions.find(o => o.name === rewardName && o.cost === Number(cost));
  if (!option) return res.json({ success: false, error: "Invalid reward" });

  if (u.Balance < cost) {
    return res.json({ success: false, error: "Not enough balance" });
  }

  const request = {
    id: Date.now().toString(),
    user: u.UserID,
    rewardName: option.name,
    cost: option.cost,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  data.cashoutRequests = data.cashoutRequests || [];
  data.cashoutRequests.push(request);

  fs.writeFileSync("iml.json", JSON.stringify(data, null, 2));

  res.json({
    success: true,
    message: "Cashout request submitted",
    requestId: request.id
  });
}
