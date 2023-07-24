const express = require("express");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// connect database
const uri = process.env.MONGO_URL;

// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// console.log(client);

// making a function there we'll operate crud

const run = async () => {
  try {
    // connect db
    await client.connect();
    // create database name
    const database = client.db("crud-practice");
    // create a collection
    const userCollection = database.collection("user");

    // post data

    app.post("/user", async (req, res) => {
      try {
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertMany(user);
        console.log(result);
        res.json(result);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // get data
    app.get("/user", async (req, res) => {
      try {
        const data = await userCollection.find({}).toArray();
        res.send(data);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // update data
    app.patch("/user/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;
        const result = await userCollection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        console.log(result);
        res.json(result);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // delete data
    app.delete("/user/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await userCollection.findOneAndDelete({
          _id: new ObjectId(id),
        });
        console.log(result);
        res.json(result);
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

// first server api
app.get("/", (req, res) => {
  res.send("getting data properly...");
});

app.listen(port, () => {
  console.log("server is running on port", port);
});
