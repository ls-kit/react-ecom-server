const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// connect database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gkhtj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
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
    const database = client.db("tour-and-travel");
    // create a collection
    const userCollection = database.collection("user");

    // post data

    app.post("/user", async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    // get data

    app.get("/user", async (req, res) => {
      const data = userCollection.find({});
      const places = await data.toArray();
      res.send(places);
    });

    // update data

    app.patch("/user/:id", async (req, res) => {
      const id = req.params;
      const updatedData = req.body;
      const result = await userCollection.findOneAndUpdate(id, updatedData);
      console.log(result);
      res.json(result);
    });

    app.delete("/user/:id", async (req, res) => {
      const id = req.params;
      const result = await userCollection.findOneAndDelete(id);
      console.log(result);
      res.json(result);
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
