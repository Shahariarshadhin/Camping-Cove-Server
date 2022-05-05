const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const res = require('express/lib/response');
const req = require('express/lib/request');
const port = process.env.PORT || 5000;
const app = express();


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iyytm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const gearCollection = client.db('campingCove').collection('gear');

        app.get('/gear', async (req, res) => {
            const query = {};
            const cursor = gearCollection.find(query);
            const gears = await cursor.toArray();
            res.send(gears);
        })

        app.get('/gear/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const gear = await gearCollection.findOne(query);
            res.send(gear);
        })

        //post
        app.post('/gear', async (req, res) => {
            const newGear = req.body;
            const result = await gearCollection.insertOne(newGear);
            res.send(result);
        })

        //delete
        app.delete('/gear/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await gearCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally { }

}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('Hello from camping cove')
});

app.listen(port, () => {
    console.log('Camping Cove is running on port', port);
})