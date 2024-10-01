const express = require("express")
const app = express()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors =require("cors")

 mongoose.connect("mongodb://127.0.0.1:27017/E-commerse")
 .then(()=>{
    console.log("Database is connected");
 })
 .catch((err)=>{
    console.log(err);
    
 })

 
 app.use(express.json());
 app.use(cors())


const UserSchema = new mongoose.Schema({
   name:String,
   password:String
})
const Product = new mongoose.Schema({
   name:String,
   date:String,
   description:String,
   imgUrl:String,
   price:String,
   quantity:Number
})

const buySchema = new mongoose.Schema({
   _id: { type: String, required: true },
   name: { type: String, required: true },
   price: { type: Number, required: true },
   date: { type: Date, required: true },
   imgUrl:{ type: String, required: true },
   description:{ type: String, required: true },
 });
 const Support = new mongoose.Schema({
  name:String,
  email:String,
  message:String
})

const UserModel = mongoose.model("User",UserSchema,"User")
const ProductModel = mongoose.model("addproducts",Product)
const buy = mongoose.model("buy",buySchema)
const Contact = mongoose.model("Support",Support)


 app.post("/newacc",async(req,res)=>{
const newuserdata = new UserModel({
   name:req.body.name,
   password:req.body.password
})
const saveduser = await newuserdata.save()
console.log(saveduser)
res.send(saveduser)
 })



 app.post("/Login",async(req,res)=>{
   const {name,password} = req.body
   const finduser =await UserModel.find({name,password})
   res.send(finduser)

   
 })

 app.post("/addproduct", async (req, res) => {
    try {
       const newProduct = req.body;
       console.log('Received request body:', req.body)
 
     const savedProduct = await ProductModel.insertMany(newProduct);
     console.log('Product Added:', savedProduct);
     res.status(201).send(savedProduct);
   } catch (error) {
     console.error('Error adding product:', error);
     res.status(500).send({ message: 'Failed to add product', error });
   }
 })

app.get("/getproduct", async (req, res) => {
const getdata = await ProductModel.find()
res.send(getdata)
})

app.post('/buy', async (req, res) => {
   const { _id, name, price, date , imgUrl,description } = req.body;
 console.log(req.body);
 
   const newPurchase = new buy({
     _id,
     name,
     price,
     date,
     imgUrl,
     description
   });
 
   try {
     const savedPurchase = await newPurchase.save();
     res.status(201).json(savedPurchase);
   } catch (error) {
     console.error('Error saving purchase:', error);
     res.status(500).json({ message: 'Failed to save purchase' });
   }
 });

 app.get('/cart', async (req, res) => {
   try {
     const purchases = await buy.find();
     res.status(200).json(purchases);
   } catch (error) {
     console.error('Error fetching purchases:', error);
     res.status(500).json({ message: 'Failed to fetch purchases' });
   }
 });

 
app.delete('/buy/:id', async (req, res) => {
   const { id } = req.params; 
   try {
     const deletedOrder = await buy.findByIdAndDelete(id); 
     if (!deletedOrder) {
       return res.status(404).json({ message: 'Order not found' }); 
     }
     res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
   } catch (error) {
     console.error('Error deleting order:', error);
     res.status(500).json({ message: 'Failed to delete order' });
   }
 });
 
 app.get("/costmer",async(req,res)=>{
   const coust = await UserModel.find()
res.send(coust)
 })
 
app.delete("/deleteproduct/:id",async(req,res)=>{
const {id} = req.params
const deleteproduct = await ProductModel.findByIdAndDelete(id)
res.send(deleteproduct)
})

app.put('/updateproduct/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, imgUrl, price, quantity } = req.body;
      const updatedProduct = await ProductModel.findByIdAndUpdate(
          id,
          {
              name,
              description,
              imgUrl,
              price,
              quantity,
          },
          { new: true, runValidators: true } 
      );

      res.json(updatedProduct);
     console.log( updatedProduct)
});

app.post("/contact",async(req,res)=>{
  const saveddata = new Contact(req.body) 
const savedmsg = await saveddata.save()
res.send(savedmsg)
console.log(savedmsg);

})

app.get("/contact",async(req,res)=>{
  
const savedmsg = await Contact.find()
res.send(savedmsg)
console.log(savedmsg);
})
const PORT = 8080
 app.listen(PORT,()=>{
   console.log(`${PORT} is running`);
   
 })