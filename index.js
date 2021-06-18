const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const ObjectId = require('mongodb').ObjectId
require('dotenv').config()

app.use(cors())
app.use(express.json());


const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xnyrt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const productsCollection = client.db("Quick-E-Shop").collection("allProducts");
  const ordersCollection = client.db("Quick-E-Shop").collection("orders");

  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productsCollection.insertOne(newProduct)
    .then(result => {
        res.send (result.insertedCount > 0)
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, product) => {
      res.send(product)
    })
  })

  app.get('/singleProduct/:id', (req, res)=>{
    productsCollection.find({_id:new ObjectId(req.params.id)})
    .toArray((err, product) => {
      res.send(product[0])
    })
  })

  app.delete('/delete/:id', (req, res)=>{
    productsCollection.findOneAndDelete({_id:new ObjectId(req.params.id)})
    .then((result) => {
      res.send(result.deletedCount > 0);
    });
  })
  
 app.post('/addOrder', (req, res) => {
   const newOrder = req.body;
   ordersCollection.insertOne(newOrder)
   .then(result => {
     res.send(result.insertedCount > 0)
   })
 })

 app.get('/showOrder', (req, res)=>{
   ordersCollection.find({email: req.query.email})
   .toArray((err, order)=>{
     res.send(order)
   })
 })

  console.log('connecting to database');
});

app.get ('/', (req, res) => {
    res.send('Thanks For Calling me')
})


app.listen( process.env.PORT || 5000)