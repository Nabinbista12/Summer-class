import dotenv from "dotenv";
dotenv.config();

import { connect, mongo } from "mongoose";
import app from "./app.js";
// import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";

const port = 3000;

const uri = process.env.MONGO_URL;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = {
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoose.connect(uri, client);
    // Send a ping to confirm a successful connection
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// main()
//   .then(() => {
//     console.log("Connection successful");
//   })
//   .catch((err) => {
//     console.log("Connection failed:", err);
//   });

// async function main() {
//   await connect("mongodb://127.0.0.1:27017/SummerClass1");
// }

app.get("/", (req, res) => {
  res.send("This is the homepage");
});

app.listen(port, () => {
  console.log(`listening at the port ${port}`);
});
