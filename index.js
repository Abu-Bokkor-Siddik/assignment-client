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
    const submitedData = client.db('assignment').collection('dataSubmited')

// get some data 
app.get('/my',async(req,res)=>{
  const selectdatas =req.query.selectdata
  let query={}

      if(req.query?.email){
        query={email:req.query.email}
      }
      if(req.query.selectdata){
        query ={selectdata:req.query.selectdata}
      }

      const cursor =asscollection.find(query)
      const result =await cursor.toArray()
      res.send(result)
      
   
 
})
// submited data filter data 
app.get('/submits',async(req,res)=>{
  const status =req.query?.status;
  let query= {};
  if(req.query.status){
    query={ status:req.query.status}
  }
  const result = await submitedData.find(query).toArray()
  res.send(result)

})
// get view 
app.get('/my/:id',async(req,res)=>{
  const id = req.params.id
const query = {_id: new ObjectId(id)}
const result = await asscollection.findOne(query)
res.send(result)
})
// submitedD find by id
app.get('/submits/:id',async(req,res)=>{
  try{
    const id = req.params.id
    // console.log('my id', typeof(id) )
  const query = {_id: new ObjectId(id)}
  const result = await submitedData.findOne(query)
  res.send(result)
  }catch(errs){
    console.log(errs)
  }

})

// updata data 
app.put('/my/:id',async(req,res)=>{
  const id = req.params.id
const filter ={ _id :new ObjectId(id)}
const options ={ upset:true}
const updateD = req.body 
const updated ={
  $set:{
    titles:updateD.titles,
    mark:updateD.mark,
    description:updateD.description,
    thumbnail:updateD.thumbnail,
    data1:updateD.data1,
    email:updateD.email,
    image:updateD.image,
    selectdata:updateD.selectdata
  }
}
const result = await asscollection.updateOne(filter,updated,options)
res.send(result)
})
// get all ass 
 app.get('/my',async(req,res)=>{
  console.log(req.query.selectdata)
  
  

  const result = await asscollection.find().toArray()
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

    //  submited data here 
    app.post('/submits',async(req,res)=>{
      try{
        const body =req.body 
        const result =await submitedData.insertOne(body)
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