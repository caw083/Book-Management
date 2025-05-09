const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Welcome to My Express Website!</h1><p>This is served directly from JavaScript.</p>');
});

app.get('/about', (req, res) => {
  res.send('<h2>About Page</h2><p>This website is built without any HTML files.</p>');
});

app.listen(port, () => {
  console.log(`Website is running at http://localhost:${port}`);
});

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://christopher083ade:TCjue30K0kDvEuYt@bookmanagement.76ttklh.mongodb.net/?retryWrites=true&w=majority&appName=BookManagement";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
