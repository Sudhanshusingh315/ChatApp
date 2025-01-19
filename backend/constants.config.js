import dotenv from 'dotenv'
dotenv.config();
const configFile = {
    mongodbConnectionString: process.env.DATABASE,
    jwtSecrete: process.env.JWT_KEY,
    PORT: process.PORT
};


export default configFile;