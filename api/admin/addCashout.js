import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { adminId, name, cost, description, imageUrl } = req.body || {};

  const data = JSON.parse(fs.readFileSync("iml.json", "utf8"));
  const admins = data.admins || [];
  const cashoutOptions = data.cashoutOptions || [];

  const admin = admins.find(a => a.AdminID === adminId);
  if (!admin) return res.json({ success: false, error: "Unauthorized" });

  cashoutOptions.push({
    id: Date.now().toString(),
    name,
    cost: Number(cost),
    description: description || "",
    imageUrl: imageUrl || ""
  });

  data.cashoutOptions = cashoutOptions;
  fs.writeFileSync("iml.json", JSON.stringify(data, null, 2));

  res.json({ success: true });
}
