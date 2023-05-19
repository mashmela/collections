import { ObjectId } from "mongodb";

import { DataBase } from "utils/database";

export default async function handler(req, res) {
  const { _id, login, avatarSrc } = JSON.parse(req.body);

  const db = await DataBase.getDB();
  const foundUser = await db.collection("users").updateOne(
    { _id: new ObjectId(_id) },
    {
      $set: {
        login,
        avatarSrc,
      },
    },
  );

  if (foundUser === null) return res.status(400).json({ error: true, message: "Not found" });
  res.status(200).json(foundUser);
}
