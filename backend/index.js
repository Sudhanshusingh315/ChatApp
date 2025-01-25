import express from 'express';
import cors from 'cors';
import mongoose, { connect } from 'mongoose';
import {configFile} from './constants.config.js'
import authRoutes from './routes/authRoute.js';
import { app,io,server } from './socket.io.js';
import contactRoutes from './routes/contactRoute.js';

app.use(cors());
app.use(express.json());

// All routes;

// test
app.get('/',(req,res)=>{
  res.status(200).json(
    {
      status:true,
      message:"Server up and running"
    }
  )
})

// Auth routes
app.use('/api/auth',authRoutes);

// search contact
app.use('/api/searchContact',contactRoutes);


main().catch(err => console.log(err));
async function main() {
  const connection = await mongoose.connect(configFile?.mongodbConnectionString);
  await connection.connection.db.collection("users").createIndex({email:"text"});
  
  console.log("mongoose connected")
}


server.listen(parseInt(configFile?.PORT),()=>{
    console.log(`Port is running on ${parseInt(configFile.PORT)}`);
})