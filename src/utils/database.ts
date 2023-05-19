import { MongoClient, Db } from "mongodb";

export const DataBase = new (class DataBaseClass {
  database: null | Db = null;
  async getDB() {
    if (this.database) return this.database;
    const mongodbUri = process.env.MONGODB_URI as string;
    const client = await MongoClient.connect(mongodbUri);
    this.database = client.db("db");
    return this.database;
  }
})();
