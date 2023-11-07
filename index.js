const express = require('express')
const app = express()
const cors =require('cors')
const jwt = require('jsonwebtoken');
const cookiePersar =require('cookie-parser')

const port = 3000



app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true 
}));
app.use(express.json())
app.use(cookiePersar())

const verifyToken =(req,res,next)=>{
  const token =req?.cookies?.token 
  if(!token){
    return res.status(401).send('unathorized accessgpt')
  }
  jwt.verify(token,'sricret',(err,decoded)=>{
    if(err){
      return res.status(401).send({message:'unathorize access'})
    }
    req.user=decoded
    next()
  })
}


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
  console.log(req.query)
  const page =parseInt(req.query.page)
  console.log(page)

 
  // console.log('token user ',req.user)

  // verifyToken,

  // if(req.query?.email !== req.user?.email){
  //   return res.status(403).send({message:"forbidden access"})
  // }
  // // cheack cookies 
  // console.log('tok tok ',req.cookies?.token)
  
  
  let query={}

      if(req.query?.email){
        query={email:req.query.email}
      }
      if(req.query.selectdata){
        query ={selectdata:req.query.selectdata}
      }
      const cursor =asscollection.find(query).skip(page*4).limit(4)
      const result =await cursor.toArray()
      res.send(result)
      
   
 
})









// count 
app.get('/myc',async(req,res)=>{
  const count = await asscollection.estimatedDocumentCount()
  res.send({count})
})
// submited data filter data 
app.get('/submits',async(req,res)=>{
  const status =req.query?.stutas;
  let query= {};
  if(req.query.stutas){
    query={ stutas:req.query.stutas}
  }
  const result = await submitedData.find(query).toArray()
  res.send(result)

})
// submted data filter by result route


app.get('/submits',async(req,res)=>{

  // console.log('tok tokddd ',req.cookies?.token)

  const status =req.query?.stutas;
  let query= {};
  if(req.query.stutas){
    query={ stutas:req.query.stutas}
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



// update data form submited data 
app.put('/submits/:id',async(req,res)=>{
  const id = req.params.id
  const filter = {_id :new ObjectId(id)}
  const options ={ upset:true}
const updateDs= req.body 
const updateds ={
  $set:{
    
    mark:updateDs.mark,
    note:updateDs.note,
    stutas:updateDs.stutas,
    textarea:updateDs.textarea 
   
  }

}
const result = await submitedData.updateOne(filter,updateds,options)
res.send(result)
})
// get all ass 
 app.get('/my',async(req,res)=>{
  
  const result = await asscollection.find()
  .toArray()
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

    // jwt 
    app.post('/jwt1',async(req,res)=>{

      const users = req.body
      const token =jwt.sign(users,'sricret',{expiresIn:'1h'})
      res.cookie('token',token,{
        httpOnly:true,
        secure:true,
        sameSite:'none'
       

      })
      
      .send({success:true})

    })
    // clear cookies 
    app.post('/logout',async(req,res)=>{
      const user = req.body 
    res.clearCookie('token',{maxAge:0}).send({message:'successfully clear'})
      console.log(user)
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