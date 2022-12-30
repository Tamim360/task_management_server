const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors());
app.use(express.json());


// main route
app.get("/", (req, res) => {
    res.send(`server is running on ${port}`);
  });
  
  // mongodb uri and client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qbqevch.mongodb.net/?retryWrites=true&w=majority`;
  
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// db function
async function run() {
    try {
        // collections
        const tasksCollection = client.db("taskManagement").collection("tasks");


        // get all tasks for a user
        app.get('/tasks', async (req, res) => {
            const email = req.query.email
            const query = {email: email}
            const tasks = await tasksCollection.find(query).toArray()
            res.send(tasks)
        })

        // post a task
        app.post('/tasks', async (req, res) => {
            const task = req.body
            const result = await tasksCollection.insertOne(task)
            res.send(result)
        })

        // update a task
        app.put('/tasks', async (req, res) => {
            const email = req.query.email
            const status = req.query.status
            const id = req.query.id
            const query = { _id: ObjectId(id), email: email }
            const updateDoc = {
                $set: {
                    status: status,
                }
            }
            const options = {upsert: true}
            const result = await tasksCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        // edit a task
        app.put('/tasks/:id', async (req, res) => {
            const task = req.body
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const updateDoc = {
                $set: task
            } 
            const options = {upsert: true}
            const result = await tasksCollection.updateOne(query, updateDoc, options)
            res.send(result)
        })

        // get a single task
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const task = await tasksCollection.findOne(query)
            res.send(task)
        })

        // delete a book
        app.delete('/tasks/:taskId', async (req, res) => {
            const id = req.params.taskId
            const query = { _id: ObjectId(id) }
            const result = await tasksCollection.deleteOne(query)
            res.send(result)
        })

    } finally {
        
    }
}

run().catch((err) => {
    console.log(err);
  });


app.listen(port, () => {
    console.log(`server is running on ${port}`);
  });