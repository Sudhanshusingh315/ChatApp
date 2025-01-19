import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import configFile from './constants.config.js'


const app = express();

app.use(cors());
app.use(express.json());




main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(configFile?.mongodbConnectionString);
  console.log("mongoose connected")
}

app.listen(configFile.PORT,()=>{
    console.log(`Port is running on ${configFile.PORT}`);
})