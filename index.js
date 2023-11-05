const express = require('express')
const app = express()
const cors =require('cors')
const port = 3000



app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://assernmentE:dnfs8amkdsdOAzoK@cluster0.kkqbu90.mongodb.net/?retryWrites=true&w=majority";

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
    const asscollection =client.db('assignment').collection('dataAss')

// get some data 
app.get('/my',async(req,res)=>{

  let query={}

      if(req.query?.email){
        query={email:req.query.email}
      }

      const cursor =asscollection.find(query)
      const result =await cursor.toArray()
      res.send(result)
      
   
 
})
// delete 
app.delete('/my/:id',async(req,res)=>{
  const id = req.params.id;
  const query = { _id : new ObjectId(id)}
  const result = await asscollection.deleteOne(query)
  res.send(result)
})
    // post ass
    app.post('/ass',async(req,res)=>{
        try{
       const body = req.body
       const result = await asscollection.insertOne(body)
       res.send(result)
       console.log(body)
        }catch(err){
            console.log(err)
        }
    })
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
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})