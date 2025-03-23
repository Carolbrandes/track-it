/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient, ServerApiVersion } = require('mongodb');

// Replace <db_password> with your actual password
const uri = "mongodb+srv://applicationexpense:a7B9c2D4@trackit.53txw.mongodb.net/?retryWrites=true&w=majority&appName=trackit";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server
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