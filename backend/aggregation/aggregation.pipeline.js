import {Types} from "mongoose" 
// search all contacts

export const contactPipeline =(userId) =>{
    return [
        {
          $match: {
        _id:Types.ObjectId.createFromHexString(userId)
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "contacts",
            foreignField: "_id",
            as: "contactDetails"
          }
        },
        {
          $project: {
            "contactDetails":1,
            _id:0
          }
        }
      ]
}