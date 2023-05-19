import { DataBase } from "utils/database";

export default async function handler(req, res) {
  const db = await DataBase.getDB();
  const listUsers = await db
    .collection("users")
    .find({}, { projection: { login: 1, avatarSrc: 1, _id: 1, collections: 1 } })
    .limit(10)
    .toArray((err, r) => r);

  res.status(200).json(listUsers);
}
