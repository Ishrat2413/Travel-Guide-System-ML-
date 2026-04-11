const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const bcrypt = require("bcrypt");
const salt = 10;

app.use(cors());
app.use(express.json());

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://mkarifat24:khairulanam24@travelguidesystem.dqchubt.mongodb.net/?retryWrites=true&w=majority&appName=TravelGuideSystem";

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
    await client.connect();

    const database = client.db("usersDB");
    const userCollection = database.collection("users");

    const feedbackCollection = client.db("travelDB").collection("feedback");
    const itinerariesCollection = client
      .db("travelDB")
      .collection("itineraries");

    app.post("/login", async (req, res) => {
      const user = req.body;
      try {
        console.log(req.body);
        const result = await userCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Error during registration");
      }
    });

    // feedback read
    app.get("/feedback", async (req, res) => {
      const cursor = feedbackCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // add feedback
    app.post("/feedback", async (req, res) => {
      const newFeedback = req.body;
      console.log(newFeedback);
      const result = await feedbackCollection.insertOne(newFeedback);
      res.send(result);
    });
    // delete feedback
    app.delete("/feedback/:id", async (req, res) => {
      const id = req.params.id;
      let newId = new ObjectId(id);
      if (id && newId) {
        const query = { _id: newId };
        const result = await feedbackCollection.deleteOne(query);
        res.send(result);
      } else {
        res.send("Nothing to show");
      }
    });

    ///Samira Hossain
    app.get("/itineraries/:userId", async (req, res) => {
      try {
        const userId = req.params.userId;
        const itineraries = await itinerariesCollection
          .find({ userId: userId }, { projection: { title: 1 } })
          .toArray();
        res.json(itineraries);
      } catch (error) {
        res.status(500).json({ error: "Error fetching itineraries" });
      }
    });

    app.get("/itinerary/:id", async (req, res) => {
      try {
        const itinerary = await itinerariesCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        if (!itinerary) {
          return res.status(404).json({ error: "Itinerary not found" });
        }
        res.json(itinerary);
      } catch (error) {
        res.status(500).json({ error: "Error fetching itinerary" });
      }
    });

    app.post("/itinerary", async (req, res) => {
      try {
        const itinerary = req.body;
        if (itinerary._id) {
          const result = await itinerariesCollection.updateOne(
            { _id: new ObjectId(itinerary._id) },
            { $set: itinerary }
          );
          if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Itinerary not found" });
          }
        } else {
          const result = await itinerariesCollection.insertOne(itinerary);
          itinerary._id = result.insertedId;
        }
        res.json({ message: "Itinerary saved successfully", itinerary });
      } catch (error) {
        res.status(500).json({ error: "Error saving itinerary" });
      }
    });

    app.delete("/itinerary/:id", async (req, res) => {
      try {
        const result = await itinerariesCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Itinerary not found" });
        }
        res.json({ message: "Itinerary deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting itinerary" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Easter Ease Server is running");
});
app.listen(port, () => {
  console.log(`Easter Ease server is running on port ${port}`);
});
