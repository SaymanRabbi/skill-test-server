const express = require('express')
const app = express()
const port = process.env.PORT || 5000
var cors = require("cors");
require("dotenv").config();
//middleware
app.use(cors());
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xxz3z.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const userTaskCollection = client.db('UserTask').collection('task')
    app.post('/task', async (req, res) => {
      const data = req.body;
      const result = await userTaskCollection.insertOne(data);
      res.send({messages:'Success',result})
    })
    app.get('/task', async (req, res) => {
      const query = {}
      const result = await userTaskCollection.find(query).toArray()
      res.send(result);
      
    })
    app.delete('/task', async (req, res) => {
      const id = req.query.id
      const deletetask = { _id: ObjectId(id)}
      const result = await userTaskCollection.deleteOne(deletetask)
      res.send(result);
      
    })
    app.put("/task", async (req, res) => {
      const id = req.query.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { role: "update" },
      };
      const result = await userTaskCollection.updateOne(filter, updateDoc);
      res.send(result);
    });



  } finally {
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})