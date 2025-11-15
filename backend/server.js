import express from "express";
import "dotenv/config";
import { MongoClient } from "mongodb";
import bodyParser from "body-parser";
import cors from "cors";

const URL = "mongodb://127.0.0.1:27017";
const client = new MongoClient(URL);

const dbName = "passop";
const app = express();
const port = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors()); // must call cors()

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
connectDB();

// GET → fetch all passwords
app.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (err) {
    res.status(500).send("Error fetching documents");
  }
});

// POST → insert a password
app.post("/", async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection("passwords");

    const insertResult = await collection.insertOne(password);

    res.send({ success: true, result: insertResult });
  } catch (err) {
    res.status(500).send("Error inserting document");
  }
});

// DELETE → delete using body (site, username, etc.)
app.delete("/", async (req, res) => {
  try {
    const data = req.body; // example: { site: "google.com", username: "abc" }

    const db = client.db(dbName);
    const collection = db.collection("passwords");

    const deleteResult = await collection.deleteOne(data);

    res.send({ success: true, result: deleteResult });
  } catch (err) {
    res.status(500).send("Error deleting document");
  }
});

// START SERVER
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
