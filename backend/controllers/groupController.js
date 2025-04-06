// todo: make sure all the routes that needs to be protected are protected.
// express.js validator needs to be added to all the routes that it should be added.
import mongoose from "mongoose";
import { GroupChat } from "../models/groupModel.js";
import { User } from "../models/userModel.js";
import { chatTypes } from "../constants.config.js";

export const createGroup = async (req, res) => {
    try {
        const { adminId } = req.params;
        let { participants, groupName, groupAboutSection, groupImage } =
            req.body;
        participants = [...participants, { _id: adminId }];
        console.log("participants are", participants);
        if (participants?.length <= 2) {
            throw new Error("Group must have minimum of three participants!");
        }
        const participantsId = participants?.map((item, index) => {
            return new mongoose.Types.ObjectId(item?._id);
        });
        const roomId = await GroupChat.create({
            groupName,
            participants,
            admin: new mongoose.Types.ObjectId(adminId),
            profileImage: groupImage,
            about: groupAboutSection,
        });

        if (roomId) {
            // update all the users's group field,
            await User.updateMany(
                // filter
                {
                    _id: { $in: participantsId },
                },
                // update fields
                {
                    $push: {
                        groups: roomId,
                    },
                }
            );
            const {
                _id,
                groupName,
                participants,
                admin,
                lastMessage,
                createdAt,
                updatedAt,
                profileImage,
            } = roomId;
            console.log("user document updated successfully");
            return res.status(201).json({
                success: true,
                message: "Group Created Successfully!!!",
                data: {
                    _id,
                    groupName,
                    participants,
                    admin,
                    lastMessage,
                    createdAt,
                    updatedAt,
                    profileImage,
                    chatType: chatTypes.groupChat,
                },
            });
        } else {
            return res.status(422).json({
                success: false,
                message: "Failed to create the group",
            });
        }
    } catch (error) {
        console.log("err is", error);
        return res.status(400).json({
            success: false,
            error: error?.message,
        });
    }
};
