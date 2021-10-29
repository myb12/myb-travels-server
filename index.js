const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

//Database configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ig1ef.mongodb.net/travelDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const run = async () => {
    try {
        await client.connect();
        console.log('DB is connected');
        const database = client.db("travelDB");
        const serviceCollection = database.collection("services");
        const orderCollection = database.collection("orders");

        //======GET all service API======// 
        app.get('/services', async (req, res) => {
            const cursor = await serviceCollection.find({});
            const services = await cursor.toArray();
            console.log(services);
            res.send(services);
        })

        //======GET single service by id API======// 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        //======POST API for orders======//
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);

            res.json(result);
        })

        //=====GET API for specific orders======//
        app.post('/my-orders', async (req, res) => {
            const { email } = req.query;
            const query = { email: email };
            const orders = await orderCollection.find(query).toArray();
            console.log(orders);

            res.json(orders);
        })
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Simple server is running');
});


app.listen(port, () => {
    console.log('Server is running on port', port);
})
