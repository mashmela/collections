import { DataBase } from "utils/database";

export default async function handler(req, res) {
  const { login, password } = JSON.parse(req.body);

  const db = await DataBase.getDB();
  const foundUser = await db.collection("users").findOne({ login, password });

  if (foundUser === null) return res.status(400).json({ error: true, message: "Not found" });
  delete foundUser.password;
  res.status(200).json(foundUser);
}
