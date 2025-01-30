import dotenv from 'dotenv'
dotenv.config();

export const configFile = {
    mongodbConnectionString: process.env.DATABASE,
    jwtSecrete: process.env.JWT_KEY,
    PORT: process.env.PORT
};

export const responseStatus = {
    SUCCESS:"SUCCESS",
    FAIL:"FAIL"
}

export const chatType = {
    OneOnOne :"OneOnOne",
    groupChat :"GroupChat"
}