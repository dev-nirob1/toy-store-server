const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@simplecrud.xgcpsfy.mongodb.net/?retryWrites=true&w=majority`;

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
        const testimonialsCollection = client.db("toyCar").collection("testimonial");
        const toysCollection = client.db("toyCar").collection("toys");
        const bannerCollection = client.db("toyCar").collection("banner");

        app.get('/toys', async (req, res) => {
            const cursor = toysCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result)
        })

        app.get('/toys/category/:category', async (req, res) => {
            const category = req.params.category
            const cursor = toysCollection.find({category: category})
            const result = await cursor.toArray()
            res.send(result)
        })

        
        app.get('/my-toys', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await toysCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/testimonials', async (req, res) => {
            const cursor = testimonialsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/sliderInfo', async (req, res) => {
            const cursor = bannerCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.post('/toys', async (req, res) => {
            const toys = req.body;
            const result = await toysCollection.insertOne(toys)
            res.send(result)
        })

        app.patch('/update/:id', async (req, res) => {
            const id = req.params.id;
            const updateToy = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedToy = {
                $set: {
                    price: updateToy.price,
                    quantity: updateToy.quantity,
                    description: updateToy.description,
                },
            };
            const result = await toysCollection.updateOne(filter, updatedToy, options)
            res.send(result)
        })

        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query)
            res.send(result)
        })


        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello world')
})
app.listen(port, () => {
    console.log(`the port is running on ${port}`)
})