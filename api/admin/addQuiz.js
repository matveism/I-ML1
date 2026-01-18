import fs from "fs";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { adminId, quizId, question, correctAnswer, rewardAmount } = req.body || {};

  const data = JSON.parse(fs.readFileSync("iml.json", "utf8"));
  const admins = data.admins || [];
  const quizzes = data.quizzes || [];

  const admin = admins.find(a => a.AdminID === adminId);
  if (!admin) return res.json({ success: false, error: "Unauthorized" });

  quizzes.push({
    quizId,
    question,
    correctAnswer,
    rewardAmount: Number(rewardAmount) || 10
  });

  data.quizzes = quizzes;
  fs.writeFileSync("iml.json", JSON.stringify(data, null, 2));

  res.json({ success: true });
}
