import { ObjectId } from "mongodb";

import { DataBase } from "utils/database";

export default async function handler(req, res) {
  const { _id, name } = JSON.parse(req.body);

  const db = await DataBase.getDB();
  const usersCollection = db.collection("users");

  const foundUser = await usersCollection.findOne({ _id: new ObjectId(_id) });
  if (!foundUser) return res.status(400).json({ error: true, message: "User is not found" });

  const newCollections = [...foundUser.collections, { name, items: [] }];
  const updateResult = await usersCollection.updateOne(
    { _id: new ObjectId(_id) },
    {
      $set: { collections: newCollections },
    },
  );

  if (updateResult.modifiedCount === 0)
    return res.status(400).json({ error: true, message: "Error when updating user" });
  res.status(200).json({ ...foundUser, collections: newCollections });
}
