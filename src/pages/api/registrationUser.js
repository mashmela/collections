import { DataBase } from "utils/database";

export default async function handler(req, res) {
  const { login, password } = JSON.parse(req.body);

  const db = await DataBase.getDB();
  const foundUser = await db.collection("users").findOne({ login });
  if (foundUser) return res.status(400).json({ error: true, message: "This login already exists" });

  const registrationUser = await db.collection("users").insertOne({
    avatarSrc: null,
    login,
    password,
    collections: [],
  });

  res.status(200).json({ success: true, id: registrationUser.insertedId });
}
