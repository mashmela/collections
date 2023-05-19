import { ObjectId } from "mongodb";

import { DataBase } from "utils/database";

export default async function handler(req, res) {
  const { _id } = JSON.parse(req.body);

  const db = await DataBase.getDB();
  const foundUser = await db.collection("users").findOne({ _id: new ObjectId(_id) });

  if (foundUser === null) return res.status(400).json({ error: true, message: "Not found" });
  res.status(200).json(foundUser);
}
