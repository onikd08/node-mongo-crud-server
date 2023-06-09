const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 8000;

const password = "4yL4A9UIvRUqwk5R";
const username = "dbuser1";
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const uri = `mongodb+srv://${username}:${password}@cluster0.onuh6mj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("nodeMongoCrud");
    const userCollection = database.collection("users");

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("trying to delete", id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const user = req.body;
      console.log(user);
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email,
          address: user.address,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => console.log("Server is running on port ", port));
