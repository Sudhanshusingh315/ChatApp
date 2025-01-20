import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {configFile} from './constants.config.js'
import authRoutes from './routes/authRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

// All routes;

// Auth routes
app.use('/api/auth',authRoutes);



main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(configFile?.mongodbConnectionString);
  console.log("mongoose connected")
}
console.log(configFile.PORT);
app.listen(parseInt(configFile?.PORT),()=>{
    console.log(`Port is running on ${parseInt(configFile.PORT)}`);
})